'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, Users, Folder, CreditCard, DollarSign, ImageIcon, Video, Search, Type, Loader2, Activity, Zap, Rocket, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PLAN_PRICES: Record<string, number> = { free: 0, creator: 19, pro: 39, premium: 99 };

const CustomTooltip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="bg-[#1C1C20] border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md">
    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{label}</div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-primary" />
      <div className="text-sm font-black text-white">{payload[0].value} {payload[0].name}</div>
    </div>
  </div>
) : null;

export default function AdminAnalytics() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [p, pr] = await Promise.all([
          supabase.from('profiles').select('plan, credits, created_at'),
          supabase.from('projects').select('type, created_at'),
        ]);

        if (p.error) throw p.error;
        if (pr.error) throw pr.error;

        setProfiles(p.data || []);
        setProjects(pr.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to sync with central node.');
        toast.error('Sync Error: Uplink unstable.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const monthlyRevenue = useMemo(() =>
    profiles.reduce((sum, p) => sum + (PLAN_PRICES[p.plan] || 0), 0), [profiles]);

  const totalCredits = useMemo(() => profiles.reduce((s, p) => s + (p.credits || 0), 0), [profiles]);
  const estimatedDistributed = useMemo(() => profiles.reduce((s, p) => s + (p.plan === 'pro' ? 500 : p.plan === 'creator' ? 200 : 10), 0), [profiles]);
  const burnRate = Math.max(0, estimatedDistributed - totalCredits);

  const userGrowth = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });
    const counts: Record<string, number> = {};
    profiles.forEach(p => { const d = p.created_at?.slice(0, 10); if (d) counts[d] = (counts[d] || 0) + 1; });
    return days.map(day => ({ day: day.slice(5), signups: counts[day] || 0 }));
  }, [profiles]);

  const toolUsage = useMemo(() => {
    const tools = [
      { name: 'Idea', color: '#8A2BE2' },
      { name: 'Script', color: '#00E5FF' },
      { name: 'SEO', color: '#00FA9A' },
      { name: 'Thumbnail', color: '#FF00FF' },
    ];
    return tools.map(t => ({ name: t.name, count: projects.filter(p => p.type === t.name).length, color: t.color }));
  }, [projects]);

  const statCards = [
    { label: 'Projected MRR', value: `₹${monthlyRevenue}`, sub: 'Estimated monthly yield', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Active Commandars', value: profiles.length, sub: 'Total signed units', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Platform Output', value: projects.length, sub: 'Total successful missions', icon: Folder, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Credit Burn Rate', value: burnRate, sub: 'Resource consumption', icon: Rocket, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Calibrating Analytics Grid...</p>
    </div>
  );

  if (error) return (
    <div className="glass-panel p-16 text-center space-y-6 border-red-500/20 bg-red-500/5 rounded-[3rem]">
      <AlertCircle className="mx-auto text-red-500" size={64} />
      <h3 className="text-2xl font-black text-white uppercase italic">System Fault Detected</h3>
      <p className="text-text-muted max-w-md mx-auto">{error}</p>
      <button onClick={() => window.location.reload()} className="btn btn-primary px-10">Re-initiate Uplink</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-12"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => (
          <motion.div 
            key={c.label}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0`}>
              <c.icon size={20} />
            </div>
            <div className="text-2xl font-black text-white tracking-tighter mb-0.5">{c.value}</div>
            <div className="text-[11px] font-black text-white uppercase italic tracking-tight font-heading">{c.label}</div>
            <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-60">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div 
          initial={{ x: -15, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl space-y-5"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white uppercase italic tracking-tighter font-heading">Growth Trajectory</h3>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">New Arrivals — Last 30 Cycles</p>
            </div>
            <Activity className="text-primary animate-pulse" size={18} />
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 900 }} interval={4} dy={10} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="signups" name="New Commanders" stroke="var(--primary)" fill="url(#ug)" strokeWidth={3} strokeLinecap="round" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tool Distribution */}
        <motion.div 
          initial={{ x: 15, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl space-y-5"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white uppercase italic tracking-tighter font-heading">Mission Profiles</h3>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Usage across AI Sectors</p>
            </div>
            <TrendingUp className="text-secondary" size={18} />
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toolUsage}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 900 }} dy={10} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Missions" radius={[8, 8, 0, 0]}>
                  {toolUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Credit Summary */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-6 bg-[#121214] border-white/5 rounded-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0"><Zap size={20} /></div>
          <div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter font-heading">Resource Logistics</h3>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Credit Allocation & Burn Analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Distributed', value: estimatedDistributed, color: 'text-primary' },
            { label: 'Current Inventory', value: totalCredits, color: 'text-secondary' },
            { label: 'Combat Burn', value: burnRate, color: 'text-accent' },
          ].map(s => (
            <div key={s.label} className="p-5 bg-white/2 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <div className={`text-2xl font-black ${s.color} tracking-tighter mb-1`}>{s.value.toLocaleString()}</div>
              <div className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
