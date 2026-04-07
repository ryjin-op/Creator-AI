'use client';

import { useMemo } from 'react';
import { User, LogOut, Zap, TrendingUp, ImageIcon, Video, Search, Folder, Calendar, Mail, ExternalLink, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const { projects } = useProjects();
  const router = useRouter();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Creator';
  const initials = displayName.charAt(0).toUpperCase();
  const plan = profile?.plan || 'free';
  const credits = profile?.credits ?? 0;
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

  const videoCount = projects.filter(p => p.type === 'Script').length;
  const seoCount = projects.filter(p => p.type === 'SEO').length;
  const ideaCount = projects.filter(p => p.type === 'Idea').length;

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toISOString().split('T')[0];
      const count = projects.filter(p => {
        if (!p.created_at) return false;
        const pDate = new Date(p.created_at);
        return pDate.toISOString().split('T')[0] === dateStr;
      }).length;
      days.push({ name: dayName, value: count });
    }
    return days;
  }, [projects]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-10 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black font-heading text-white tracking-tight uppercase italic mb-1">Account Overview</h2>
          <p className="text-text-muted text-sm font-medium opacity-70">View your stats and manage your profile.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-5 py-2.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white rounded-xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all shadow-xl group"
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 glass-panel p-6 bg-[#121214] border-white/5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 group-hover:bg-primary/10 transition-colors" />
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1C1C20] border-2 border-primary/40 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_20px_rgba(138,43,226,0.3)]">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight">{displayName}</h3>
              <div className="flex items-center gap-1.5 justify-center text-text-muted font-bold text-[10px]">
                <Mail size={12} className="text-primary" /> {user?.email}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                <Calendar size={12} className="text-primary" /> Since {memberSince}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 bg-gradient-main border-white/10 rounded-2xl relative overflow-hidden shadow-3xl text-white">
          <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
            <Zap size={80} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-none italic">
                {plan}
              </h3>
              <div className="flex items-center gap-2.5 font-bold opacity-90">
                <span className="text-4xl font-black">{credits}</span>
                <div className="text-[10px] font-black uppercase tracking-widest leading-none">
                  Credits<br />Remaining
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/pricing" className="px-5 py-2.5 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                View Plans
              </Link>
              <button className="px-5 py-2.5 bg-black/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black/30 transition-all flex items-center gap-2">
                Billing Details <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3 italic">
          <TrendingUp className="text-primary" size={20} /> Account Statistics
        </h3>
        <div className="dashboard-metrics-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Scripts', value: videoCount, icon: Video, color: 'primary', count: '+12%' },
            { label: 'SEO Packs', value: seoCount, icon: Search, color: 'secondary', count: '+5%' },
            { label: 'Topic Ideas', value: ideaCount, icon: Zap, color: 'accent', count: '+8%' },
            { label: 'Total Projects', value: projects.length, icon: Folder, color: '[#4169E1]', count: 'Live' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black rounded-lg">
                  {stat.count}
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tighter mb-0.5">{stat.value}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="xl:col-span-2 glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl space-y-6 flex flex-col h-[380px]">
          <div>
            <h3 className="text-sm font-black font-heading text-white uppercase italic tracking-tighter">Usage Statistics</h3>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">Projects created over time</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} dy={15} />
                <Tooltip 
                  contentStyle={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', padding: '12px' }} 
                  itemStyle={{ color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" strokeLinecap="round" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl space-y-6 h-[380px] overflow-hidden flex flex-col">
          <h3 className="text-sm font-black font-heading text-white flex items-center gap-2 shrink-0 uppercase italic tracking-tighter">
            <Activity className="text-secondary" size={16} /> Recent Projects
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {projects.slice(0, 8).map(p => {
              const ToolIcon = p.type === 'Script' ? Video : p.type === 'SEO' ? Search : Zap;
              return (
                <div key={p.id} className="flex gap-3 group cursor-pointer hover:bg-white/2 p-2 rounded-xl transition-all">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/40 flex items-center justify-center shrink-0 transition-colors">
                    <ToolIcon size={16} className="text-text-muted group-hover:text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-white truncate mb-0.5 group-hover:text-primary transition-colors">{p.name}</div>
                    <div className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-60">{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'New'}</div>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 italic">
                <Folder size={32} className="mb-4" />
                <p className="text-sm">No projects found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
