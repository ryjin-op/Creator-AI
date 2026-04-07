'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CreditCard, Edit2, Trash2, Plus, Loader2, Save, X, PlusCircle, Check, Sparkles, Zap, DollarSign, Activity, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSubscription() {
  const [plans, setPlans] = useState<any[]>([]);
  const [bonuses, setBonuses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    plan_id: '',
    name: '',
    subtitle: '',
    price: 0,
    currency_symbol: '₹',
    features: [''],
    is_active: true
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [{ data: plansData }, { data: bonusData }] = await Promise.all([
        supabase.from('subscription_plans').select('*').order('price', { ascending: true }),
        supabase.from('plan_bonus').select('*')
      ]);
      
      if (plansData) setPlans(plansData);
      if (bonusData) {
        const bMap: Record<string, number> = {};
        bonusData.forEach((b: any) => bMap[b.plan_id] = b.daily_bonus);
        setBonuses(bMap);
      }
    } catch (err) {
      toast.error('Sync Error: Could not reach plans database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleEditClick = (plan: any) => {
    setFormData({
      plan_id: plan.plan_id,
      name: plan.name || '',
      subtitle: plan.subtitle || '',
      price: plan.price || 0,
      currency_symbol: plan.currency_symbol || '₹',
      features: plan.features?.length ? [...plan.features] : [''],
      is_active: plan.is_active !== false
    });
    setEditingPlan(plan.plan_id);
    setShowForm(true);
  };

  const handleNewPlanClick = () => {
    setFormData({
      plan_id: `plan_${Date.now()}`,
      name: '',
      subtitle: '',
      price: 0,
      currency_symbol: '₹',
      features: [''],
      is_active: true
    });
    setEditingPlan(null);
    setShowForm(true);
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFeatures = formData.features.filter(f => f.trim() !== '');
    const payload = { ...formData, features: cleanFeatures };
    const isExisting = plans.find(p => p.plan_id === payload.plan_id);

    try {
      if (isExisting) {
        await supabase.from('subscription_plans').update(payload).eq('plan_id', payload.plan_id);
      } else {
        await supabase.from('subscription_plans').insert([payload]);
        await supabase.from('plan_bonus').insert([{ plan_id: payload.plan_id, daily_bonus: 0 }]);
      }
      toast.success(isExisting ? "Plan Updated" : "New Plan Created", { icon: '🛡️' });
      setShowForm(false);
      fetchPlans();
    } catch (err) {
      toast.error('Save Failed: Could not update plan');
    }
  };

  const updateBonus = async (plan_id: string, val: number) => {
    const { error } = await supabase.from('plan_bonus').upsert({ plan_id, daily_bonus: val }, { onConflict: 'plan_id' });
    if (!error) {
      setBonuses({ ...bonuses, [plan_id]: val });
      toast.success('Daily Credits Updated', { icon: '🔋' });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Loading Subscription Plans...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter font-heading line-clamp-1">Plans & Pricing</h3>
          <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-0.5 opacity-60">Define subscription plans, prices, and daily credit bonuses</p>
        </div>
        {!showForm && (
          <button 
            onClick={handleNewPlanClick}
            className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-xl shadow-secondary/20 shrink-0"
          >
            <Plus size={16} /> Create Plan
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div 
            key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-6 bg-[#121214] border-secondary/30 rounded-2xl shadow-3xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter font-heading">{editingPlan ? "Edit Plan" : "Create New Plan"}</h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={savePlan} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Plan Name</label>
                  <input 
                    required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-secondary transition-all" 
                    placeholder="E.G: PRO_PLAN" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Subtitle</label>
                  <input 
                    value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-text-muted italic outline-none focus:border-secondary transition-all" 
                    placeholder="Brief description..." 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary opacity-60" size={16} />
                      <input 
                        type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary transition-all font-black text-base" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 opacity-60">Currency</label>
                    <select 
                      value={formData.currency_symbol} onChange={e => setFormData({...formData, currency_symbol: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-black text-white outline-none focus:border-secondary transition-all appearance-none cursor-pointer"
                    >
                      <option value="₹">₹ (INR)</option>
                      <option value="$">$ (USD)</option>
                      <option value="€">€ (EUR)</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer p-3.5 bg-white/2 border border-white/5 rounded-xl hover:border-secondary/30 transition-all">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded-lg bg-white/5 border-white/10" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Visible to Users</span>
                </label>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3 italic"><Activity size={16} /> Plan Features</label>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.features.map((feat, index) => (
                    <div key={index} className="flex gap-2 group">
                      <input 
                        required value={feat} onChange={e => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-[10px] font-bold text-white outline-none focus:border-secondary" 
                        placeholder="Feature name..." 
                      />
                      <button type="button" onClick={() => {
                        const newFeatures = formData.features.filter((_, i) => i !== index);
                        setFormData({ ...formData, features: newFeatures });
                      }} className="p-2.5 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                    className="w-full py-3 bg-white/2 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase text-text-muted hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={14} /> Add Feature
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 pt-6 border-t border-white/5 flex justify-end gap-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-text-muted hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-gradient-main text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-2.5">
                  <Save size={16} /> Save Plan
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div key={plan.plan_id} className={`glass-panel p-6 rounded-2xl relative flex flex-col gap-6 transition-all ${plan.is_active ? 'bg-[#121214] border-white/5' : 'bg-white/2 border-white/5 opacity-50'}`}>
                  {!plan.is_active && <div className="absolute -top-3 right-6 px-3 py-1 bg-white/10 text-text-muted text-[8px] font-black rounded-full border border-white/10 uppercase tracking-widest">offline</div>}
                  {plan.plan_id.toLowerCase().includes('pro') && <div className="absolute -top-3 left-6 px-4 py-1 bg-primary text-white text-[8px] font-black rounded-full shadow-glow-primary uppercase tracking-widest">pro tier</div>}
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-white italic tracking-tighter uppercase font-heading">{plan.name}</h4>
                    <p className="text-[10px] font-bold text-text-muted italic opacity-60 line-clamp-1">{plan.subtitle}</p>
                  </div>

                  <div className="text-3xl font-black text-white tracking-tighter">
                    <span className="text-secondary text-2xl">{plan.currency_symbol}</span>{plan.price} <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">/ mo</span>
                  </div>

                  <div className="space-y-2.5 flex-1 custom-scrollbar max-h-[120px] overflow-y-auto pr-2">
                    {plan.features?.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-white/70 italic leading-snug">
                        <Check size={12} className="text-secondary shrink-0" /> {f}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                    <button onClick={() => handleEditClick(plan)} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Edit2 size={14} className="text-text-muted" /> Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Delete plan ${plan.name}? This cannot be undone.`)) {
                          supabase.from('subscription_plans').delete().eq('plan_id', plan.plan_id).then(() => fetchPlans());
                        }
                      }} 
                      className="p-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all flex items-center justify-center"
                    >
                      <Trash2 size={14} className="text-red-500/40" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-glow-primary shrink-0"><Zap size={20} /></div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase italic tracking-tighter leading-none font-heading">Daily Credit Bonus</h3>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-1.5 opacity-60">Assign daily credits to each plan level</p>
                </div>
              </div>
              
              <div className="glass-panel bg-[#121214] border-white/5 rounded-2xl overflow-hidden shadow-3xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/2">
                        {['Plan Level', 'Daily Credits', 'Save Settings'].map(h => (
                          <th key={h} className="p-4 text-[9px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {plans.map(plan => (
                        <tr key={plan.plan_id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4">
                            <div className="text-sm font-black text-white uppercase italic tracking-tighter font-heading">{plan.name}</div>
                            <div className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40">{plan.plan_id}</div>
                          </td>
                          <td className="p-4">
                            <div className="relative w-32 group">
                              <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary opacity-60" size={14} />
                              <input 
                                type="number" min="0" 
                                value={bonuses[plan.plan_id] !== undefined ? bonuses[plan.plan_id] : 0} 
                                onChange={(e) => setBonuses({...bonuses, [plan.plan_id]: parseInt(e.target.value) || 0})}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white font-black text-sm outline-none focus:border-primary transition-all"
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => updateBonus(plan.plan_id, bonuses[plan.plan_id])}
                              className="px-5 py-2.5 bg-gradient-main text-white rounded-lg text-[9px] font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                              <Settings size={12} /> Update Credits
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
