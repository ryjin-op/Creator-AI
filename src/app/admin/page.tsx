'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BarChart3, Users, Shield, CreditCard, MessageSquare, Bell, ArrowRight, Zap, Target, Activity, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { profile } = useAuth();

  const quickStats = [
    { label: 'Security Level', value: 'Alpha-01', icon: ShieldCheck, color: 'text-green-400' },
    { label: 'System Uptime', value: '99.98%', icon: Activity, color: 'text-primary' },
    { label: 'Neural Activity', value: 'Optimal', icon: Zap, color: 'text-secondary' },
    { label: 'Grid Integrity', value: 'Stable', icon: Target, color: 'text-accent' },
  ];

  const adminNodes = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Real-time performance metrics and user growth mapping.', href: '/admin/analytics', color: 'bg-primary' },
    { id: 'users', label: 'User Management', icon: Users, desc: 'View and manage all registered users and permissions.', href: '/admin/users', color: 'bg-secondary' },
    { id: 'platform', label: 'Feature Control', icon: Shield, desc: 'Enable or disable platform features and resources.', href: '/admin/platform', color: 'bg-accent' },
    { id: 'subscriptions', label: 'Revenue & Plans', icon: CreditCard, desc: 'Manage subscription plans and pricing structures.', href: '/admin/subscriptions', color: 'bg-green-500' },
    { id: 'prompts', label: 'AI Prompt Settings', icon: MessageSquare, desc: 'Configure the AI instruction sets for the platform.', href: '/admin/prompts', color: 'bg-purple-500' },
    { id: 'comms', label: 'System Alerts', icon: Bell, desc: 'Send notifications to users and view system logs.', href: '/admin/comms', color: 'bg-orange-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-16 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Management Dashboard</span>
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Welcome back, <span className="text-primary italic">Admin</span></h1>
          <p className="text-sm font-bold text-text-muted max-w-lg italic opacity-80 leading-relaxed">Centralized control for Creator AI. Manage users, features, and platform settings from this panel.</p>
        </div>
        <div className="flex gap-4">
          <div className="p-6 bg-white/2 border border-white/10 rounded-3xl text-right">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Current Session ID</p>
            <p className="text-xs font-black text-white italic truncate w-32">{profile?.id.slice(0, 16)}...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((s, idx) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-[#121214] border border-white/5 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
            <s.icon size={20} className={`${s.color} relative z-10`} />
            <div className="space-y-0.5 relative z-10">
              <div className="text-2xl font-black text-white tracking-tighter italic uppercase">{s.value}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] ml-2 flex items-center gap-4">
          <Activity size={16} /> Admin Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminNodes.map((node, idx) => (
            <Link 
              key={node.id} 
              href={node.href}
              className="group p-10 bg-[#121214] border border-white/5 rounded-[3rem] hover:border-white/10 transition-all overflow-hidden relative shadow-3xl flex flex-col gap-8"
            >
              <div className={`w-16 h-16 rounded-2xl ${node.color} text-white flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                <node.icon size={28} />
              </div>
              <div className="space-y-3 relative z-10 flex-1">
                <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{node.label}</h4>
                <p className="text-xs font-bold text-text-muted italic opacity-60 leading-relaxed">{node.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                Open Settings <ArrowRight size={14} className="text-primary" />
              </div>
              <div className={`absolute -bottom-12 -right-12 w-40 h-40 ${node.color} opacity-[0.03] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-20 border-t border-white/5 flex flex-col items-center justify-center text-center space-y-6 opacity-30 group hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-primary" />
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em]">System Protected by RSA-4096 Encryption</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest italic flex-wrap justify-center">
          Handcrafted with <Heart size={14} className="text-red-500 animate-pulse inline" /> by <span className="text-white">Creator AI Team</span> &copy; 2026 Platform Support
        </div>
      </div>
    </motion.div>
  );
}
