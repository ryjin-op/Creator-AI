'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { LayoutDashboard, Image as ImageIcon, Search, Video, Folder, Sparkles, Bell, Zap, TrendingUp, MoreVertical, Menu, X, User, Settings, Type, Megaphone, Info, AlertCircle, CheckCircle2, Plus, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProjectLibrary from '@/components/dashboard/ProjectLibrary';
import SEOTools from '@/components/dashboard/SEOTools';
import ContentWriting from '@/components/dashboard/ContentWriting';
import Profile from '@/components/dashboard/Profile';
import SettingsComponent from '@/components/dashboard/Settings';
import EarnCredits from '@/components/dashboard/EarnCredits';
import ZeroCreditPopup from '@/components/dashboard/ZeroCreditPopup';
import { Project } from '@/types';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { projects } = useProjects();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('library');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showZeroPopup, setShowZeroPopup] = useState(false);
  const [zeroPopupContext, setZeroPopupContext] = useState<'login' | 'generate'>('login');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    if (project.type === 'Script' || project.type === 'Idea') {
      setActiveView('content');
    } else if (project.type === 'SEO') {
      setActiveView('seo');
    }
  };

  const triggerZeroPopup = (ctx: 'login' | 'generate') => {
    setZeroPopupContext(ctx);
    setShowZeroPopup(true);
  };

  useEffect(() => {
    if (profile && profile.credits !== undefined && profile.credits <= 0) {
      const shown = sessionStorage.getItem('popup_shown_this_session');
      if (!shown) {
        sessionStorage.setItem('popup_shown_this_session', 'true');
        setTimeout(() => triggerZeroPopup('login'), 800);
      }
    }
  }, [profile]);

  useEffect(() => {
    // Fetch active announcements
    supabase.from('announcements')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setAnnouncements(data);
      });
  }, []);

  const dismissAnnouncement = (id: any) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Creator';
  const initials = displayName.charAt(0).toUpperCase();
  const credits = profile?.credits ?? 0;
  const plan = profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) + ' Plan' : 'Free Plan';

  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className="bg-[#121214] border-r border-white/5 flex flex-col relative z-50 shrink-0"
      >
        <div className={`p-6 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} mb-4`}>
          <Link href="/" className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 rounded-xl bg-gradient-main flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles size={16} color="#fff" />
            </div>
            <span className="text-xl font-black font-heading text-white tracking-tighter">
              Creator<span className="text-primary">AI</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-4">
          <div className="space-y-1">
            {sidebarOpen && <p className="text-[10px] font-black text-text-muted px-4 mb-4 tracking-[0.3em] uppercase opacity-50">Main Menu</p>}
            {[
              { id: 'library', icon: Folder, label: 'My Projects' },
              { id: 'seo', icon: Search, label: 'SEO Tools' },
              { id: 'content', icon: Type, label: 'Content Lab' },
              { id: 'thumbnail', icon: ImageIcon, label: 'Thumbnail Maker', soon: true },
              { id: 'channel', icon: BarChart2, label: 'Channel Analyser', soon: true }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full group relative flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-primary/10 text-white shadow-xl shadow-primary/5 border border-primary/20' 
                    : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                } ${!sidebarOpen && 'justify-center px-0'}`}
              >
                <item.icon size={18} className={activeView === item.id ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                {sidebarOpen && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    {item.soon && <span className="text-[9px] font-black bg-white/5 text-text-muted px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">Soon</span>}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-6 border-t border-white/5">
            {sidebarOpen && <p className="text-[10px] font-black text-text-muted px-4 mb-4 tracking-[0.3em] uppercase opacity-50">Account</p>}
            {[
              { id: 'credits', icon: Zap, label: 'Get Credits' },
              { id: 'profile', icon: User, label: 'My Profile' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full group flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-primary/10 text-white border border-primary/20 shadow-lg shadow-primary/5' 
                    : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                } ${!sidebarOpen && 'justify-center px-0'}`}
              >
                <item.icon size={18} className={activeView === item.id ? 'text-primary' : 'group-hover:text-primary'} />
                {sidebarOpen && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {sidebarOpen && (
          <div className="p-6">
            <div className="p-6 bg-[#0E0E11] border border-primary/30 rounded-3xl relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles size={48} className="text-primary" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 leading-tight uppercase italic tracking-tighter">Upgrade to Pro</h3>
              <p className="text-[10px] text-text-muted font-bold leading-relaxed mb-6 uppercase tracking-widest">Get faster generation and more credits with our Pro plan.</p>
              <Link href="/pricing" className="btn btn-primary w-full py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-primary/30 flex items-center justify-center gap-2">
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4">
            <div className="glass-panel px-5 py-2.5 bg-white/5 rounded-2xl flex items-center gap-4 border-white/10 shadow-xl group">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-secondary animate-pulse shadow-glow shadow-secondary/20" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.15em] mb-0.5 leading-none">Credits</span>
                  <span className={`text-sm font-black tracking-widest ${credits > 5 ? 'text-white' : 'text-red-500'}`}>{credits}</span>
                </div>
              </div>
              <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (credits / 50) * 100)}%` }}
                  className={`h-full ${credits > 10 ? 'bg-gradient-main' : 'bg-red-500'} shadow-[0_0_10px_rgba(138,43,226,0.3)]`}
                />
              </div>
              <button 
                onClick={() => setActiveView('credits')}
                className="p-1.5 bg-primary/20 hover:bg-primary/40 rounded-lg text-primary transition-all border border-primary/20"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all hover:bg-white/10 relative shadow-xl"
              >
                <Bell size={20} className={showNotifications ? 'text-primary' : ''} />
                {announcements.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#09090B]" />}
              </button>

              <AnimatePresence>
              {showNotifications && (
                <>
                  <div onClick={() => setShowNotifications(false)} className="fixed inset-0 z-40" />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-96 bg-[#13131A] border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                      <h4 className="text-lg font-black text-white italic tracking-tighter uppercase">Notifications</h4>
                      <span className="text-[10px] font-black bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{announcements.length} New</span>
                    </div>
                    <div className="max-h-[440px] overflow-y-auto custom-scrollbar">
                      {announcements.length > 0 ? (
                        announcements.map(a => (
                          <div key={a.id} className="p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors relative group">
                            <div className="flex gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                a.type === 'warning' ? 'bg-orange-500/10 text-orange-400' :
                                a.type === 'error' ? 'bg-red-500/10 text-red-400' :
                                'bg-secondary/10 text-secondary'
                              }`}>
                                {a.type === 'warning' ? <AlertCircle size={20} /> : <Info size={20} />}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-white leading-tight">{a.title}</p>
                                <p className="text-[11px] text-text-muted font-medium leading-relaxed italic">{a.message}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => dismissAnnouncement(a.id)}
                              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-16 text-center space-y-4">
                          <Bell size={48} className="mx-auto text-text-muted opacity-10" />
                          <p className="text-sm font-black text-text-muted uppercase tracking-[0.2em] italic">No new notifications.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
              </AnimatePresence>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <button 
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-4 group transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white italic tracking-tighter leading-none group-hover:text-primary transition-colors">{displayName}</p>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-60 leading-none">{plan}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-primary/40 flex items-center justify-center font-black text-primary shadow-lg shadow-primary/10 transition-transform group-hover:scale-110">
                {initials}
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView + (activeProject?.id || 'default')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {activeView === 'library' && <ProjectLibrary onViewChange={setActiveView} onOpenProject={handleOpenProject} />}
              {activeView === 'seo' && <SEOTools key={activeProject?.id || 'seo'} initialProject={activeProject?.type === 'SEO' ? activeProject : null} onZeroCredits={() => triggerZeroPopup('generate')} />}
              {activeView === 'content' && <ContentWriting key={activeProject?.id || 'content'} initialProject={activeProject?.type === 'Script' || activeProject?.type === 'Idea' ? activeProject : null} onZeroCredits={() => triggerZeroPopup('generate')} />}
              {activeView === 'credits' && <EarnCredits />}
              {activeView === 'profile' && <Profile />}
              {activeView === 'settings' && <SettingsComponent />}
              
              {/* Coming Soon Views */}
              {['thumbnail', 'channel'].includes(activeView) && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-lg p-12 glass-panel bg-white/2 border-white/10 rounded-[3rem] shadow-3xl">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 animate-pulse text-text-muted">
                      {activeView === 'thumbnail' ? <ImageIcon size={48} /> : <BarChart2 size={48} />}
                    </div>
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">
                      <Sparkles size={12} className="animate-spin-slow" /> Under Development
                    </div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4">
                      {activeView === 'thumbnail' ? 'Thumbnail Maker' : 'Channel Analyser'}
                    </h2>
                    <p className="text-text-muted text-lg font-medium leading-relaxed italic opacity-70">
                      We are currently building our AI models for high-quality {activeView === 'thumbnail' ? 'image' : 'data'} generation.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <ZeroCreditPopup 
          isOpen={showZeroPopup} 
          onClose={() => setShowZeroPopup(false)} 
          context={zeroPopupContext} 
          onNavigate={() => { setShowZeroPopup(false); setActiveView('credits'); }} 
        />

      </div>
    </div>
  );
}
