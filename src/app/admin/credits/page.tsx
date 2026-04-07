'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, CreditCard, Save, Plus, Trash2, ToggleRight, ToggleLeft, Loader2, PlaySquare, Gift, Zap, Activity, Shield, TrendingUp, Sparkles, DollarSign, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCredits() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('app_config').select('*').eq('id', 1).single();
      if (data) setConfig(data);
      else if (error) throw error;
    } catch (err: any) {
      toast.error('Sync Error: Could not reach credit settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('app_config').upsert({ id: 1, ...config });
      if (error) throw error;
      toast.success('Monetization Settings Saved!', { icon: '💰' });
    } catch (err: any) {
      toast.error('Encryption Check Failed: Record Rejected');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => setConfig((prev: any) => ({ ...prev, [key]: value }));

  const updatePackage = (idx: number, field: string, value: any) => {
    const newPackages = [...config.credit_packages];
    newPackages[idx][field] = Number(value);
    updateField('credit_packages', newPackages);
  };

  const addPackage = () => {
    updateField('credit_packages', [...(config.credit_packages || []), { credits: 100, price: 999 }]);
  };

  const removePackage = (idx: number) => {
    const newPackages = [...config.credit_packages];
    newPackages.splice(idx, 1);
    updateField('credit_packages', newPackages);
    toast.success('Credit Package Removed');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Loading Credit Settings...</p>
    </div>
  );

  if (!config) return (
    <div className="glass-panel p-16 text-center space-y-6 border-red-500/20 bg-red-500/5 rounded-[3rem]">
      <AlertCircle className="mx-auto text-red-500" size={64} />
      <h3 className="text-2xl font-black text-white uppercase italic">Configuration Error</h3>
      <p className="text-text-muted max-w-md mx-auto">The app configuration could not be found in the database. Please ensure the database is properly initialized.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Credit Pricing</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 opacity-70">Manage credit packages, ad rewards, and daily bonuses</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-10 py-4 bg-gradient-main text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <div className="glass-panel bg-[#121214] border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
            <div className="p-8 border-b border-white/5 bg-white/2 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Shield size={20} /></div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Global Settings</h4>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {[
                { label: 'Enable Purchases', desc: 'Allow users to buy credits', field: 'purchase_enabled', icon: CreditCard },
                { label: 'Ad Rewards', desc: 'Allow users to earn credits by watching ads', field: 'ads_enabled', icon: PlaySquare },
                { label: 'Daily Bonuses', desc: 'Grant automatic daily credits to users', field: 'bonus_enabled', icon: Gift },
              ].map(f => (
                <div key={f.field} className="p-8 flex items-center justify-between group hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="text-text-muted group-hover:text-primary transition-colors"><f.icon size={24} /></div>
                    <div>
                      <div className="text-sm font-black text-white italic tracking-tighter uppercase leading-none mb-1">{f.label}</div>
                      <div className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">{f.desc}</div>
                    </div>
                  </div>
                  <button onClick={() => updateField(f.field, !config[f.field])} className="transition-all">
                    {config[f.field] ? <ToggleRight size={44} className="text-primary" /> : <ToggleLeft size={44} className="text-text-muted opacity-30" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-10 bg-[#121214] border-white/5 rounded-[3rem] shadow-3xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 text-orange-400 flex items-center justify-center"><Activity size={20} /></div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Limits & Rewards</h4>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Daily Cap (Ads per user)</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black text-white outline-none focus:border-orange-400 transition-all font-mono" value={config.daily_ad_limit} onChange={e => updateField('daily_ad_limit', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Credits per ad</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black text-white outline-none focus:border-orange-400 transition-all font-mono" value={config.ad_reward} onChange={e => updateField('ad_reward', Number(e.target.value))} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel bg-[#121214] border-white/5 rounded-[3rem] shadow-3xl flex flex-col h-full">
          <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><DollarSign size={20} /></div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Credit Packages</h4>
            </div>
            <button onClick={addPackage} className="px-5 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
              <Plus size={16} /> Add Package
            </button>
          </div>
          <div className="p-8 flex-1 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
            {config.credit_packages?.map((pkg: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 bg-white/2 border border-white/5 rounded-[2rem] flex items-center gap-6 group hover:border-secondary/30 transition-all shadow-lg"
              >
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 leading-none">Credits</label>
                      <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-secondary outline-none focus:border-secondary transition-all font-mono" value={pkg.credits} onChange={e => updatePackage(i, 'credits', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 leading-none">Price ₹</label>
                      <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-green-400 outline-none focus:border-secondary transition-all font-mono" value={pkg.price} onChange={e => updatePackage(i, 'price', e.target.value)} />
                    </div>
                  </div>
                </div>
                <button onClick={() => removePackage(i)} className="w-12 h-12 rounded-xl bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"><Trash2 size={18} /></button>
              </motion.div>
            ))}
            {(!config.credit_packages || config.credit_packages.length === 0) && (
              <div className="h-60 flex flex-col items-center justify-center glass-panel bg-white/2 border border-dashed border-white/10 rounded-[3rem] text-text-muted space-y-4 opacity-50">
                <CreditCard size={40} className="opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">No active credit packages.</p>
              </div>
            )}
          </div>
          <div className="p-8 border-t border-white/5 text-center mt-auto">
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.5em] leading-none">Pricing System Active</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
