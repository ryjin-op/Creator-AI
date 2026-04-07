'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Project } from '@/types';

interface ProjectContextType {
  projects: Project[];
  loadingProjects: boolean;
  addProject: (project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  loadProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const loadProjects = async () => {
    if (!user) return;
    setLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      }
    } catch (e) {
      console.error('Projects load error:', e);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const addProject = async (project: Partial<Project>) => {
    if (!user) return;

    const newProject = {
      user_id: user.id,
      name: project.name,
      type: project.type,
      thumbnail: project.thumbnail || null,
      content: project.content || null
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select()
      .single();

    if (!error && data) {
      setProjects(prev => [data as Project, ...prev]);
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...(data as Project) } : p));
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, deleteProject, updateProject, loadingProjects, loadProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
