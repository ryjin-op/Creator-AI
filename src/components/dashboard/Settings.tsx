'use client';

import { Settings2, Shield, Bell, Globe, ChevronRight, Lock, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="max-w-3xl space-y-10 pb-12"
    >
      <div>
        <h2 className="text-2xl font-black font-heading text-white tracking-tight flex items-center gap-3 uppercase italic">
          <Settings2 className="text-primary" size={24} /> Settings
        </h2>
        <p className="text-text-muted mt-1 text-sm font-medium opacity-70">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">General Preferences</h3>
        <div className="glass-panel bg-[#121214] border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {/* Notifications */}
          <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-text-muted transition-colors group-hover:text-primary group-hover:bg-primary/10 shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Email Notifications</h4>
                <p className="text-[10px] text-text-muted font-medium italic opacity-60">Get alerts for usage and plan limits.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-5.5 rounded-full relative transition-all duration-300 ${notifications ? 'bg-primary' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: notifications ? 22 : 4 }}
                className="w-4 h-4 rounded-full bg-white absolute top-0.5 shadow-lg"
              />
            </button>
          </div>

          {/* Language */}
          <div className="p-4 md:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-text-muted transition-colors group-hover:text-secondary group-hover:bg-secondary/10 shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Language & Region</h4>
                <p className="text-[10px] text-text-muted font-medium opacity-60">English (US) / UTC Global</p>
              </div>
            </div>
            <button className="p-2 text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Legal & Security</h3>
        <div className="glass-panel bg-[#121214] border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {[
            { label: 'Security & Privacy', icon: Shield, href: '/privacy', color: 'accent' },
            { label: 'Terms of Service', icon: Lock, href: '/terms', color: 'primary' },
            { label: 'Account Data Privacy', icon: User, href: '#', color: 'secondary' }
          ].map((item, idx) => (
            <Link 
              key={idx}
              href={item.href}
              className={`p-4 md:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all group ${
                idx !== 2 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-text-muted transition-colors group-hover:text-${item.color} group-hover:bg-${item.color}/10 shrink-0`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-4 text-left">
        <button className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all italic hover:underline underline-offset-8">
          Delete Account (Deactivate)
        </button>
      </div>
    </motion.div>
  );
}
