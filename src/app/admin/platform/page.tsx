'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ToggleLeft, ToggleRight, CreditCard, Ticket, Plus, Trash2, AlertTriangle, CheckCircle2, Loader2, Shield, Zap, TrendingUp, Sparkles, Layout, Globe, Activity, Image as ImageIcon, Video, Search, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPlatform() {
  const [tab, setTab] = useState('flags');
  const [loading, setLoading] = useState(true);
  
  // Feature Flags State
  const [flags, setFlags] = useState<any>({ thumbnail: true, video: true, seo: true, caption: true });
  
  // Credit Packages State
  const [packages, setPackages] = useState<any[]>([]);
  
  // Referral Codes State
  const [codes, setCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newBonus, setNewBonus] = useState(50);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const { data: settings } = await supabase.from('settings').select('*');
        if (settings) {
          const f = settings.find(s => s.key === 'feature_flags');
          if (f) setFlags(f.value);
          
          const p = settings.find(s => s.key === 'topup_packages');
          if (p) setPackages(p.value);
          else setPackages([
            { id: 1, name: 'Starter Pack', credits: 50, price: 99 },
            { id: 2, name: 'Growth Pack', credits: 150, price: 299 },
            { id: 3, name: 'Scale Pack', credits: 500, price: 799 },
          ]);

          const r = settings.find(s => s.key === 'referral_codes');
          if (r) setCodes(r.value);
        }
      } catch (err) {
        console.error("Platform load fault:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const saveSetting = async (key: string, value: any) => {
    const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
    if (error) { toast.error(`System Rejection: Failed to update ${key}.`); return false; }
    return true;
  };

  const toggleFlag = async (key: string) => {
    const updated = { ...flags, [key]: !flags[key] };
    if (await saveSetting('feature_flags', updated)) {
      setFlags(updated);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} Hub ${updated[key] ? 'Initialized' : 'Offline'}`, { icon: updated[key] ? '⚡' : '🔌' });
    }
  };

  const updatePackage = (id: number, field: string, val: any) => {
    const updated = packages.map(p => p.id === id ? { ...p, [field]: val } : p);
    setPackages(updated);
    saveSetting('topup_packages', updated);
  };

  const removePackage = (id: number) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    saveSetting('topup_packages', updated);
    toast.success('Resource Package Decommissioned');
  };

  const addPackage = () => {
    const nextId = packages.length ? Math.max(...packages.map(p => p.id)) + 1 : 1;
    const updated = [...packages, { id: nextId, name: 'New Inventory', credits: 100, price: 199 }];
    setPackages(updated);
    saveSetting('topup_packages', updated);
  };

  const createReferral = async () => {
    if (!newCode) { toast.error('Encryption Key Required.'); return; }
    const updated = [...codes, { code: newCode.toUpperCase(), bonus: Number(newBonus), used: 0, date: new Date().toISOString().slice(0, 10) }];
    if (await saveSetting('referral_codes', updated)) {
      setCodes(updated);
      setNewCode('');
      toast.success('Promo Protocol Active: ' + newCode.toUpperCase(), { icon: '🔑' });
    }
  };

  const removeReferral = async (code: string) => {
    const updated = codes.filter(c => c.code !== code);
    if (await saveSetting('referral_codes', updated)) {
      setCodes(updated);
      toast.success('Promo Protocol Terminated');
    }
  };

  const tabs = [
    { id: 'flags', label: 'Feature Flags', icon: ToggleRight, color: 'text-primary' },
    { id: 'packages', label: 'Credit Packages', icon: CreditCard, color: 'text-secondary' },
    { id: 'referrals', label: 'Promo Codes', icon: Ticket, color: 'text-accent' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Linking Platform Nodes...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter font-heading">Feature Management</h3>
          <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-0.5 opacity-60">Manage platform features, credits, and promo codes</p>
        </div>
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-black uppercase text-[9px] tracking-widest ${
                tab === t.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-text-muted hover:text-white'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'flags' && (
          <motion.div 
            key="flags" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3 italic"><Activity size={14} className="text-primary" /> Active Tool Grid</h4>
              <div className="glass-panel bg-[#121214] border-white/5 rounded-2xl overflow-hidden shadow-3xl divide-y divide-white/[0.03]">
                {[
                  { id: 'thumbnail', label: 'Thumbnail Maker', desc: 'AI Image/Thumbnail Generation', icon: ImageIcon },
                  { id: 'video', label: 'Video AI', desc: 'AI Video Analysis Services', icon: Video },
                  { id: 'seo', label: 'SEO Optimizer', desc: 'Algorithm Optimization Tools', icon: Search },
                  { id: 'caption', label: 'Caption Gen', desc: 'Auto-captioning Services', icon: Type }
                ].map(f => (
                  <div key={f.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-text-muted transition-colors ${flags[f.id] ? 'text-primary' : 'group-hover:text-primary'}`}>
                        <f.icon size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white italic tracking-tighter uppercase mb-0.5 font-heading">{f.label}</div>
                        <div className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40">{f.desc}</div>
                      </div>
                    </div>
                    <button onClick={() => toggleFlag(f.id)} className={`transition-all ${flags[f.id] ? 'text-primary' : 'text-text-muted opacity-30 hover:opacity-100 italic font-black uppercase text-[9px] tracking-widest'}`}>
                      {flags[f.id] ? <ToggleRight size={36} /> : 'Offline'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6 bg-primary/5 border-primary/20 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-glow shadow-primary/20 animate-pulse"><Zap size={32} /></div>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter font-heading">Direct Control</h4>
              <p className="text-xs text-text-muted font-medium italic opacity-70 max-w-[200px]">Instantly toggle platform capabilities for all users at once.</p>
              <div className="flex gap-4">
                <div className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-primary italic">Status: Operating</div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'packages' && (
          <motion.div 
            key="packages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center px-1">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3 italic"><Zap size={14} className="text-secondary" /> Inventory Distribution</h4>
              <button 
                onClick={addPackage}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-secondary/20"
              >
                <Plus size={14} /> New Package
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map(p => (
                <div key={p.id} className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl flex flex-col gap-5 relative group hover:border-secondary/30 transition-all shadow-xl">
                  <button onClick={() => removePackage(p.id)} className="absolute top-4 right-4 text-red-500/20 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 opacity-50">Package Name</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black text-white uppercase italic tracking-tighter outline-none focus:border-secondary transition-all" 
                        value={p.name} 
                        onChange={e => updatePackage(p.id, 'name', e.target.value)} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 opacity-50">Credits</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black text-secondary outline-none focus:border-secondary transition-all" 
                          type="number" 
                          value={p.credits} 
                          onChange={e => updatePackage(p.id, 'credits', Number(e.target.value))} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 opacity-50">Price ₹</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-black text-emerald-400 outline-none focus:border-secondary transition-all" 
                          type="number" 
                          value={p.price} 
                          onChange={e => updatePackage(p.id, 'price', Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {packages.length === 0 && (
                <div className="col-span-full h-80 flex flex-col items-center justify-center glass-panel bg-white/2 border border-dashed border-white/10 rounded-[3rem] text-text-muted space-y-6">
                  <CreditCard size={48} className="opacity-10" />
                  <p className="text-sm font-black uppercase tracking-[0.3em] italic">No active distribution nodes.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'referrals' && (
          <motion.div 
            key="referrals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3"><Ticket size={16} className="text-accent" /> Promo Codes</h4>
            </div>

            <div className="glass-panel p-6 bg-[#121214] border-white/5 rounded-2xl space-y-6 shadow-3xl">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Code Name (e.g. ALPHA10)</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white uppercase italic tracking-widest outline-none focus:border-accent transition-all" 
                    placeholder="E.G: WELCOME50" 
                    value={newCode} 
                    onChange={e => setNewCode(e.target.value)} 
                  />
                </div>
                <div className="w-full md:w-32 space-y-1.5">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Yield</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-accent outline-none focus:border-accent transition-all" 
                    type="number" 
                    value={newBonus} 
                    onChange={e => setNewBonus(Number(e.target.value))} 
                  />
                </div>
                <button 
                  onClick={createReferral}
                  className="px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/20 active:scale-95 shrink-0"
                >
                  Apply Key
                </button>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/2">
                      {['Protocol', 'Bonus', 'Usage', 'Status', 'Actions'].map(h => (
                        <th key={h} className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {codes.map(c => (
                      <tr key={c.code} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 font-black text-accent uppercase italic tracking-widest text-xs font-heading">{c.code}</td>
                        <td className="p-4 text-xs font-bold text-white flex items-center gap-1.5"><Zap size={12} className="text-accent" /> {c.bonus}</td>
                        <td className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest">{c.used} units</td>
                        <td className="p-4 text-[9px] font-bold text-text-muted italic opacity-60">{c.date}</td>
                        <td className="p-4">
                          <button onClick={() => removeReferral(c.code)} className="p-2 text-red-500/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                    {codes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-20 text-center text-text-muted font-black uppercase tracking-[0.3em] text-[10px] italic">No active promo codes.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
