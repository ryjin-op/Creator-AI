'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { LayoutDashboard, Users, Shield, CreditCard, Ticket, BarChart3, Bell, MessageSquare, Menu, X, Rocket, Sparkles, History, DollarSign, Settings } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ADMIN_EMAILS = ['pratyaygharai13@gmail.com'];
  const isEmailAdmin = (profile?.email && ADMIN_EMAILS.includes(profile.email)) || (user?.email && ADMIN_EMAILS.includes(user.email));
  const isAdmin = profile?.role === 'admin' || isEmailAdmin;

  useEffect(() => {
    if (!loading && !isAdmin) {
      // Small delay for UX, then redirect if they definitely shouldn't be here
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="h-screen bg-[#09090B] flex items-center justify-center">
        <Rocket className="animate-bounce text-primary" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#09090B] flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center border border-red-500/20">
          <Shield size={48} className="text-red-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic italic">Access <span className="text-red-500">Denied</span></h1>
          <p className="text-text-muted text-lg font-medium italic opacity-70 max-w-md mx-auto">
            You do not have permission to access the Admin Panel. Please contact the owner if you believe this is an error.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline px-10 py-4 text-xs font-black uppercase tracking-widest">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { id: 'users', label: 'Manage Users', icon: Users, href: '/admin/users' },
    { id: 'platform', label: 'Features', icon: Shield, href: '/admin/platform' },
    { id: 'subscriptions', label: 'Plans & Pricing', icon: CreditCard, href: '/admin/subscriptions' },
    { id: 'prompts', label: 'AI Settings', icon: MessageSquare, href: '/admin/prompts' },
    { id: 'comms', label: 'Send Alerts', icon: Bell, href: '/admin/comms' },
    { id: 'audit', label: 'Activity Log', icon: History, href: '/admin/audit' },
    { id: 'credits', label: 'Credit Pricing', icon: DollarSign, href: '/admin/credits' },
    { id: 'settings', label: 'Global Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#09090B] text-white">
      {/* Admin Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className="bg-[#121214] border-r border-white/5 flex flex-col shrink-0 relative z-50 transition-all duration-300"
      >
        <div className="p-4.5 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-main flex items-center justify-center">
                <Sparkles size={14} />
              </div>
              <span className="text-lg font-black font-heading tracking-tighter">Admin<span className="text-primary italic">Panel</span></span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-text-muted hover:text-white rounded-lg">
            {sidebarOpen ? <X size={18} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 pt-6">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 text-text-muted hover:text-white ${!sidebarOpen && 'justify-center px-0'}`}
            >
              <item.icon size={18} className="group-hover:text-primary transition-colors" />
              {sidebarOpen && <span className="text-[11px] font-black tracking-widest uppercase italic">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-4.5">
            <div className="p-4.5 bg-primary/5 border border-primary/20 rounded-2xl text-center">
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 leading-none">System Status</p>
              <p className="text-base font-black text-white italic uppercase tracking-tighter">Online</p>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Admin Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
        <header className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 opacity-80">Admin Control</h1>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none font-heading">Overview</h2>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Rocket size={14} /> Back to Dashboard
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
