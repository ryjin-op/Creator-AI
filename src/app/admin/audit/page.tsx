'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { History, Search, Filter, Shield, User as UserIcon, Settings as SettingsIcon, Loader2, Calendar, Database, Activity, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200);
        if (error) throw error;
        setLogs(data || []);
      } catch (err: any) {
        setError(err.message);
        toast.error('Sync Error: Could not load activity logs.');
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(l => 
    (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.target || '').toLowerCase().includes(search.toLowerCase())
  );

  const getActionStyles = (action: string) => {
    if (action.includes('DELETE') || action.includes('BAN')) return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    if (action.includes('CREATE') || action.includes('GRANT')) return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' };
    if (action.includes('UPDATE') || action.includes('TOGGLE')) return { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
    return { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/10' };
  };

  const getIcon = (action: string) => {
    if (action.includes('USER') || action.includes('PASSWORD') || action.includes('CREDIT')) return <UserIcon size={14} />;
    if (action.includes('FEATURE') || action.includes('ANNOUNCEMENT')) return <SettingsIcon size={14} />;
    return <Shield size={14} />;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Loading Activity Log...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Activity Log</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 opacity-70">A complete history of all administrative actions</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors" size={18} />
          <input 
            placeholder="Search action or user..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="pl-12 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary transition-all w-full md:w-80 font-bold text-sm shadow-xl"
          />
        </div>
      </div>

      <div className="glass-panel bg-[#121214] border-white/5 rounded-[3.5rem] overflow-hidden shadow-3xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2">
                {['Time', 'Action', 'Target', 'Details'].map(h => (
                  <th key={h} className="p-8 text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-text-muted font-black uppercase tracking-[0.3em] text-[10px] italic">No activity logs found.</td>
                </tr>
              ) : filtered.map(log => {
                const Styles = getActionStyles(log.action);
                return (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">
                        <Clock size={12} className="text-primary opacity-50" />
                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${Styles.bg} ${Styles.color} ${Styles.border} text-[10px] font-black uppercase tracking-widest`}>
                        {getIcon(log.action)} {log.action}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="text-sm font-black text-white italic tracking-tighter truncate max-w-[200px] leading-none uppercase">{log.target}</div>
                    </td>
                    <td className="p-8">
                      <div className="text-[10px] font-bold text-text-muted italic opacity-60 leading-normal max-w-sm font-mono truncate hover:text-white transition-colors cursor-help" title={JSON.stringify(log.details)}>
                        {log.details ? JSON.stringify(log.details).replace(/{|}|"/g, '').replace(/:/g, ': ').replace(/,/g, ' | ') : '—'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <div className="glass-panel p-6 bg-primary/5 border-primary/20 rounded-full flex items-center gap-6 shadow-xl shadow-primary/5">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-glow shadow-primary/20 animate-pulse"><Activity size={20} /></div>
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-black text-white uppercase italic tracking-tighter leading-none mb-1">System Status: Secure</p>
            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-60 leading-none">Showing latest {filtered.length} actions</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
