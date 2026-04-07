'use client';

import { useState, useMemo } from 'react';
import { Plus, Edit2, Download, Trash2, ImageIcon, Search, Type, MoreVertical, Files, SearchCode, X, Lightbulb, Check } from 'lucide-react';
import { useProjects } from '@/context/ProjectContext';
import { SkeletonCard } from './SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Project } from '@/types';

interface ProjectLibraryProps {
  onViewChange: (view: string) => void;
  onOpenProject: (project: Project) => void;
}

export default function ProjectLibrary({ onViewChange, onOpenProject }: ProjectLibraryProps) {
  const { projects, deleteProject, updateProject, loadingProjects } = useProjects();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filterTypes = ['All', 'Script/Idea', 'SEO'];

  const handleDownload = (project: Project) => {
    if (project.thumbnail && !['SEO', 'SCRIPT', 'IDEA'].some(t => project.thumbnail?.startsWith(t))) {
      const a = document.createElement('a');
      a.href = project.thumbnail;
      a.download = `${project.name}.png`;
      a.target = '_blank';
      a.click();
    } else {
      const content = `Project: ${project.name}\nType: ${project.type}\nCreated: ${project.created_at ? new Date(project.created_at).toLocaleString() : new Date().toLocaleString()}\n\n---\nThis is a ${project.type} project from CreatorAI.\n`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    toast.success('Download started!');
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editingProject) return;
    try {
      await updateProject(editingProject.id, { name: editName.trim() });
      toast.success('Project renamed!');
      setEditingProject(null);
    } catch (e) {
      toast.error('Failed to rename project.');
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' 
        || (activeFilter === 'Script/Idea' && (p.type === 'Script' || p.type === 'Idea'))
        || p.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header section with Create button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl font-black font-heading text-white tracking-tight uppercase italic mb-1">Project Library</h2>
          <p className="text-text-muted text-sm font-medium opacity-70">Manage all your generated content in one workspace.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Create New Project
        </motion.button>
      </motion.div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-black font-heading text-white flex items-center gap-2 tracking-tight uppercase italic">
            Previous Projects
            <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-text-muted font-black border border-white/10">
              {filteredProjects.length}
            </span>
          </h3>
          {/* Search bar */}
          <div className="relative flex-1 max-w-[320px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all text-xs font-medium"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filterTypes.map(type => (
            <motion.button 
              key={type} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all border uppercase tracking-widest uppercase italic ${
                activeFilter === type 
                  ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/5' 
                  : 'border-white/10 bg-white/5 text-text-muted hover:border-white/20'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {loadingProjects ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/2 rounded-2xl border border-dashed border-white/10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-text-muted">
                <Files size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-text-muted max-w-xs mx-auto">Generate content or use an AI tool to see your projects appear here.</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isHovered = hoveredCard === project.id;
              let ToolIcon = ImageIcon;
              if (project.type === 'Script') ToolIcon = Type;
              if (project.type === 'SEO') ToolIcon = SearchCode;
              if (project.type === 'Idea') ToolIcon = Lightbulb;
              
              const isTextThumbnail = project.thumbnail?.includes('_TEXT_ONLY');
              
              let ThumbIcon = SearchCode;
              let ThumbText = 'SEO';
              if (project.thumbnail === 'SCRIPT_TEXT_ONLY') {
                ThumbIcon = Type;
                ThumbText = 'SCRIPT';
              } else if (project.thumbnail === 'IDEA_TEXT_ONLY') {
                ThumbIcon = Lightbulb;
                ThumbText = 'IDEA';
              }
              
              return (
                <motion.div 
                  key={project.id}
                  variants={cardVariants}
                  onClick={() => onOpenProject && onOpenProject(project)}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -8 }}
                  className={`glass-panel rounded-xl border overflow-hidden cursor-pointer relative group transition-all duration-300 ${
                    isHovered ? 'border-primary shadow-[0_10px_30px_rgba(138,43,226,0.1)]' : 'border-white/5'
                  }`}
                >
                  {/* Thumbnail Preview */}
                  <div className={`relative h-32 overflow-hidden ${isTextThumbnail ? 'bg-gradient-main bg-opacity-80' : 'bg-black/50'}`}>
                    {isTextThumbnail ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white animate-pulse-slow">
                        <ThumbIcon size={40} className="drop-shadow-2xl" />
                        <span className="font-black text-xl tracking-[0.2em]">{ThumbText}</span>
                      </div>
                    ) : (
                      <img 
                        src={project.thumbnail || ''} 
                        alt={project.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    )}
                    
                    {/* Tool Badge */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1.5 text-[0.55rem] font-black text-white border border-white/10 z-10 tracking-widest uppercase">
                      <ToolIcon size={10} className="text-secondary" />
                      {project.type}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 relative z-10">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-white truncate group-hover:text-primary transition-colors tracking-tight">
                          {project.name}
                        </h4>
                        <p className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5 font-black opacity-60">
                          {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'NEW'}
                        </p>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === project.id ? null : project.id); }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-all"
                        >
                          <MoreVertical size={16} />
                        </button>

                        <AnimatePresence>
                          {openMenuId === project.id && (
                            <>
                              <div onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} className="fixed inset-0 z-40" />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute right-0 bottom-full mb-3 bg-[#13131A] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 min-w-[160px] overflow-hidden"
                              >
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditingProject(project); setEditName(project.name); }}
                                  className="w-full px-4 py-3 text-left hover:bg-white/5 text-white flex items-center gap-3 text-xs font-bold transition-colors"
                                >
                                  <Edit2 size={14} className="text-primary" /> Rename
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDownload(project); }}
                                  className="w-full px-4 py-3 text-left hover:bg-white/5 text-white flex items-center gap-3 text-xs font-bold transition-colors"
                                >
                                  <Download size={14} className="text-secondary" /> Download
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                                  className="w-full px-4 py-3 text-left hover:bg-white/5 text-red-400 flex items-center gap-3 text-xs font-bold transition-colors"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-8 rounded-3xl border border-primary/30 shadow-2xl relative"
            >
              <button onClick={() => setEditingProject(null)} className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Edit2 size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rename Project</h3>
                  <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Update your project name</p>
                </div>
              </div>
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary transition-all font-body mb-8"
                placeholder="New project name..."
              />
              <div className="flex gap-3">
                <button onClick={() => setEditingProject(null)} className="flex-1 py-4 bg-white/5 rounded-2xl text-text-muted font-bold hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="btn btn-primary flex-[2] py-4 rounded-2xl flex items-center justify-center gap-2">
                  <Check size={18} /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass-panel w-full max-w-2xl p-10 md:p-14 rounded-[2.5rem] border border-primary/40 shadow-3xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
              
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-text-muted hover:text-white transition-colors">
                <X size={28} />
              </button>

              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Create New Content</h2>
                <p className="text-text-muted text-lg max-w-md mx-auto">Choose an AI tool to help bring your ideas to life.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'content', toolName: 'Script Writer', icon: Type, color: 'var(--primary)', desc: 'Generate trending topics & high-quality scripts' },
                  { id: 'seo', toolName: 'SEO Optimizer', icon: Search, color: '#FF4500', desc: 'Optimize titles, tags & descriptions for SEO content' }
                ].map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onViewChange(tool.id);
                      setIsModalOpen(false);
                    }}
                    className="glass-panel p-10 bg-white/5 border border-white/10 rounded-3xl text-left group hover:bg-white/[0.08] transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110" style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}40` }}>
                      <tool.icon size={32} />
                    </div>
                    <div className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">{tool.toolName}</div>
                    <p className="text-xs text-text-muted font-bold leading-relaxed line-clamp-2 uppercase tracking-widest">{tool.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
