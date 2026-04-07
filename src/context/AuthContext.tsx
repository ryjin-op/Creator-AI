'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (params: any) => Promise<any>;
  signIn: (params: any) => Promise<any>;
  signOut: () => Promise<void>;
  deductCredit: () => Promise<void>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('Profile fetch error:', error);
        return;
      }

      if (data) {
        let currentProfile = data as Profile;

        // Daily Bonus Logic
        const todayIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().split('T')[0];

        if (currentProfile.last_bonus_date !== todayIST) {
          const { data: config } = await supabase.from('app_config').select('bonus_enabled').single();
          
          if (config?.bonus_enabled) {
            const [planRes, bonusRes] = await Promise.all([
              supabase.from('subscription_plans').select('name').eq('plan_id', currentProfile.plan || 'free').single(),
              supabase.from('plan_bonus').select('daily_bonus').eq('plan_id', currentProfile.plan || 'free').single()
            ]);

            if (planRes.data && bonusRes.data && (bonusRes.data as any).daily_bonus > 0) {
              const bonus = (bonusRes.data as any).daily_bonus;
              const planName = planRes.data.name;
              const newCredits = (currentProfile.credits || 0) + bonus;

              const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                  credits: newCredits, 
                  last_bonus_date: todayIST 
                })
                .eq('id', userId);

              if (!updateError) {
                currentProfile.credits = newCredits;
                currentProfile.last_bonus_date = todayIST;
                toast.success(`You received +${bonus} ${planName} daily credits 🎁`, {
                  icon: '🚀',
                  duration: 5000,
                });
              }
            }
          }
        }
        
        // Auto-promote specific emails to admin if they are not already
        const ADMIN_EMAILS = ['pratyaygharai13@gmail.com'];
        if (currentProfile.email && ADMIN_EMAILS.includes(currentProfile.email) && currentProfile.role !== 'admin') {
          const { error: promoteError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
          
          if (!promoteError) {
            currentProfile.role = 'admin';
            console.log('User auto-promoted to admin based on email protocol.');
          }
        }
        
        setProfile(currentProfile);
      }
    } catch (e) {
      console.warn('Profile fetch error:', e);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, fullName }: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const deductCredit = async () => {
    if (!user || !profile) return;
    if (profile.credits <= 0) throw new Error('No credits remaining');
    const newCredits = profile.credits - 1;
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);
    if (!error) {
      setProfile(prev => prev ? ({ ...prev, credits: newCredits }) : null);
    }
  };

  const refreshProfile = () => {
    if (user) fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, deductCredit, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
