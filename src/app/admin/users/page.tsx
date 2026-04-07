'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Mail, Ban, MoreVertical, Edit2, Shield, CreditCard, Trash2, Key, Loader2, Gift, RotateCcw, CheckCircle, UserCheck, AlertCircle, Calendar, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [grantId, setGrantId] = useState<string | null>(null);
  const [grantAmt, setGrantAmt] = useState('');
  const [grantNote, setGrantNote] = useState('');
  const [search, setSearch] = useState('');
  const [activePlans, setActivePlans] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: usersData, error: usersError }, { data: plansData }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('subscription_plans').select('plan_id, name').eq('is_active', true)
      ]);
      
      if (usersError) throw usersError;
      setUsers(usersData || []);
      if (plansData) setActivePlans(plansData);
    } catch (err: any) {
      setError(err.message);
      toast.error('Sync Fault: Users unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter((u: any) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const saveUser = async (u: any) => {
    const { error } = await supabase.from('profiles').update({ credits: Number(editCredits), plan: editPlan }).eq('id', u.id);
    if (error) { toast.error('Encryption Check Failed: Update Aborted'); return; }
    toast.success('Commander Profile Updated!', { icon: '🎖️' });
    setEditId(null); 
    load();
  };

  const toggleBan = async (u: any) => {
    const banned = !u.is_banned;
    const { error } = await supabase.from('profiles').update({ is_banned: banned }).eq('id', u.id);
    if (error) { toast.error('System Refusal: Access adjustment failed'); return; }
    toast.success(banned ? `Target ${u.email} Locked.` : `Target ${u.email} Released.`, { icon: banned ? '🚫' : '✅' });
    load();
  };

  const grantCredits = async () => {
    const u = users.find(x => x.id === grantId);
    const amt = Number(grantAmt);
    if (!amt || amt <= 0) { toast.error('Zero or negative injection invalid.'); return; }
    const { error } = await supabase.from('profiles').update({ credits: (u.credits || 0) + amt }).eq('id', grantId);
    if (error) { toast.error('Fuel Injection Synchronizer Error.'); return; }
    toast.success(`Injected ${amt} Credits into ${u.email}`, { icon: '⛽' });
    setGrantId(null); setGrantAmt(''); setGrantNote(''); load();
  };

  const resetPassword = async (u: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(u.email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) { toast.error('Comms Failure: Reset mail not sent.'); return; }
    toast.success(`Reset link patched through to ${u.email}`, { icon: '📡' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter font-heading">User List</h3>
          <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-0.5 opacity-60">Oversee all registered users and their permissions</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors" size={16} />
          <input 
            placeholder="Search Users (Name/Email)..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all w-full md:w-72 font-bold text-xs shadow-xl"
          />
        </div>
      </div>

      <div className="glass-panel bg-[#121214] border-white/5 rounded-2xl overflow-hidden shadow-3xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2">
                {['User Info', 'Plan', 'Credits', 'Last Login', 'Status', 'Actions'].map(h => (
                  <th key={h} className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-text-muted font-black uppercase tracking-[0.3em] text-xs">
                    <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} /> Loading User Data
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-text-muted font-black uppercase tracking-[0.3em] text-xs italic">No users found.</td>
                </tr>
              ) : filtered.map((u: any) => (
                <tr key={u.id} className={`hover:bg-white/[0.01] transition-colors ${u.is_banned ? 'opacity-30' : ''}`}>
                  <td className="p-4 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] border border-primary/20 shrink-0">
                        {u.full_name?.charAt(0) || u.email?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate leading-none mb-1 uppercase tracking-tight">{u.full_name || 'Anonymous'}</p>
                        <p className="text-[9px] font-bold text-text-muted truncate lowercase opacity-50 flex items-center gap-1.5 leading-none">
                          <Mail size={9} /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {editId === u.id ? (
                      <select 
                        value={editPlan} 
                        onChange={e => setEditPlan(e.target.value)}
                        className="bg-[#1C1C20] border border-white/10 rounded-lg text-white p-1.5 text-[9px] font-black uppercase tracking-widest outline-none focus:border-primary"
                      >
                        {activePlans.map(p => <option key={p.plan_id} value={p.plan_id}>{p.name}</option>)}
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        u.plan === 'pro' ? 'bg-primary/10 text-primary border-primary/20' :
                        u.plan === 'creator' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        'bg-white/5 text-text-muted border-white/10'
                      }`}>
                        {u.plan || 'Free Plan'}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editId === u.id ? (
                      <input 
                        type="number" 
                        value={editCredits} 
                        onChange={e => setEditCredits(e.target.value)}
                        className="w-16 bg-[#1C1C20] border border-white/10 rounded-lg text-white p-1.5 text-[9px] font-black outline-none focus:border-primary"
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 font-black text-[11px] text-white">
                        <Zap size={12} className={u.credits > 10 ? 'text-secondary' : 'text-orange-500'} /> {u.credits ?? 0}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-[9px] font-bold text-text-muted flex items-center gap-2 shrink-0">
                    <Calendar size={10} /> {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${u.is_banned ? 'text-red-500' : 'text-green-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.is_banned ? 'bg-red-500' : 'bg-green-400'} animate-pulse`} />
                      {u.is_banned ? 'Locked' : 'Active'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                    {editId === u.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveUser(u)} className="px-4 py-2 bg-gradient-main text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">Save</button>
                        <button onClick={() => setEditId(null)} className="px-4 py-2 bg-white/5 text-text-muted rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 group-hover:scale-100 transition-transform">
                        <button 
                          onClick={() => { setEditId(u.id); setEditCredits(u.credits || 0); setEditPlan(u.plan || 'free'); }}
                          className="p-1.5 bg-white/5 hover:bg-primary/20 text-text-muted hover:text-primary rounded-lg border border-white/10 transition-all"
                          title="Override System"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => setGrantId(u.id)}
                          className="p-1.5 bg-white/5 hover:bg-secondary/20 text-text-muted hover:text-secondary rounded-lg border border-white/10 transition-all"
                          title="Inject Energy"
                        >
                          <Gift size={13} />
                        </button>
                        <button 
                          onClick={() => resetPassword(u)}
                          className="p-1.5 bg-white/5 hover:bg-accent/20 text-text-muted hover:text-accent rounded-lg border border-white/10 transition-all"
                          title="Recalibrate Pass-Key"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button 
                          onClick={() => toggleBan(u)}
                          className={`p-1.5 border transition-all rounded-lg ${u.is_banned ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}
                          title={u.is_banned ? 'Unban User' : 'Ban User'}
                        >
                          {u.is_banned ? <CheckCircle size={13} /> : <Ban size={13} />}
                        </button>
                      </div>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Credits Modal */}
      <AnimatePresence>
        {grantId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGrantId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm bg-[#13131A] border border-white/10 p-6 rounded-2xl shadow-4xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><Gift size={24} /></div>
                <div>
                  <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none font-heading">Add Credits</h3>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1.5 opacity-60">Grant bonus credits to this user</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Amount</label>
                  <div className="relative">
                    <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary opacity-60" size={16} />
                    <input 
                      type="number" 
                      value={grantAmt} 
                      onChange={e => setGrantAmt(e.target.value)} 
                      placeholder="e.g. 100"
                      className="w-full pl-10 pr-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary transition-all font-black text-base"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Note (Optional)</label>
                  <input 
                    value={grantNote} 
                    onChange={e => setGrantNote(e.target.value)} 
                    placeholder="e.g. Support bonus"
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary transition-all font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={grantCredits} className="flex-1 py-3.5 bg-gradient-main text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">Grant Credits</button>
                <button onClick={() => setGrantId(null)} className="px-6 py-3.5 bg-white/5 text-text-muted rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
