'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save, Loader2, X, Upload, ShieldCheck, Globe, Star, Camera, Instagram, PlusCircle, Check, Trash2, Layout, Zap, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettings() {
  const [tab, setTab] = useState('site');
  
  const tabs = [
    { id: 'site', label: 'Site Identity', icon: Globe, color: 'text-primary' },
    { id: 'admins', label: 'Admin Access', icon: ShieldCheck, color: 'text-secondary' },
    { id: 'keys', label: 'AI API Keys', icon: Zap, color: 'text-yellow-400' },
    { id: 'pricing', label: 'Pricing Data', icon: Award, color: 'text-accent' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Global Settings</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 opacity-70">Manage site info, admin access, and pricing data</p>
        </div>
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest ${
                tab === t.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-text-muted hover:text-white'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'site' && <SiteSettings key="site" />}
        {tab === 'admins' && <AdminAccess key="admins" />}
        {tab === 'keys' && <AIKeysSettings key="keys" />}
        {tab === 'pricing' && <PricingLegacy key="pricing" />}
      </AnimatePresence>
    </motion.div>
  );
}

function SiteSettings() {
  const [settings, setSettings] = useState({ siteName: '', tagline: '', founderPhoto: '', founderInstagram: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('settings').select('value').eq('key', 'site_settings').maybeSingle();
      if (data?.value) setSettings(prev => ({ ...prev, ...data.value }));
      setLoading(false);
    }
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({ key: 'site_settings', value: settings }, { onConflict: 'key' });
    if (error) toast.error('Save Failed');
    else toast.success('Settings Saved', { icon: '🛡️' });
    setSaving(false);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    try {
      const fileName = `founder-${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `public/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setSettings(prev => ({ ...prev, founderPhoto: publicUrl }));
      toast.success('Image Uploaded');
    } catch (err) {
      toast.error('Upload Error: Could not save image.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase text-[10px] tracking-widest text-text-muted opacity-40 italic flex items-center justify-center gap-4"><Loader2 className="animate-spin" size={20} /> Loading Settings...</div>;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="glass-panel p-12 bg-[#121214] border-white/5 rounded-[3.5rem] shadow-3xl space-y-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-glow shadow-primary/20"><Globe size={28} /></div>
        <div>
          <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">General Info</h4>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Basic site identification and branding details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Site Name</label>
          <input 
            value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white uppercase italic tracking-widest outline-none focus:border-primary transition-all" 
            placeholder="CREATOR AI" 
          />
        </div>
        <div className="space-y-6">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Founder Photo (1:1)</label>
          <div className="flex items-center gap-6">
            {settings.founderPhoto ? (
              <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img src={settings.founderPhoto} alt="Founder" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <button onClick={() => setSettings(prev => ({ ...prev, founderPhoto: '' }))} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 size={24} /></button>
              </div>
            ) : (
              <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 bg-white/2 hover:bg-white/5 hover:border-primary/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group">
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <Camera size={24} className="text-text-muted group-hover:text-primary transition-colors" />
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Upload Photo</span>
              </label>
            )}
            <div className="flex-1 space-y-2">
              <div className="text-[10px] items-center gap-2 flex font-black text-white italic uppercase tracking-tighter"><Instagram size={14} className="text-primary" /> Founder Instagram</div>
              <input value={settings.founderInstagram} onChange={e => setSettings({...settings, founderInstagram: e.target.value})} className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-text-muted outline-none focus:border-primary" placeholder="@commander" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-white/5">
        <button onClick={save} disabled={saving} className="px-12 py-5 bg-gradient-main text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
        </button>
      </div>
    </motion.div>
  );
}

function AdminAccess() {
  const PRIMARY_ADMIN = 'pratyaygharai13@gmail.com';
  const [admins, setAdmins] = useState([PRIMARY_ADMIN]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('settings').select('value').eq('key', 'admin_emails').maybeSingle();
      if (data?.value) setAdmins(data.value);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-20 text-center font-black uppercase text-[10px] tracking-widest text-text-muted opacity-40 italic flex items-center justify-center gap-4"><Loader2 className="animate-spin" size={20} /> Loading Admin List...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10">
      <div className="glass-panel p-10 bg-[#121214] border-white/5 rounded-[3rem] shadow-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><ShieldCheck size={24} /></div>
          <div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Admin List</h4>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-50">Authorized users with administrative permissions</p>
          </div>
        </div>

        <div className="space-y-4">
          {admins.map(a => (
            <div key={a} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-secondary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${a === PRIMARY_ADMIN ? 'bg-secondary text-white' : 'bg-white/5 text-text-muted'}`}>
                  {a[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-black text-white italic truncate leading-none mb-1 lowercase">{a}</div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">{a === PRIMARY_ADMIN ? 'System Owner' : 'Sub Admin'}</div>
                </div>
              </div>
              {a === PRIMARY_ADMIN && <div className="px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-glow-secondary shadow-secondary/5">Primary Admin</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-secondary/5 border border-secondary/20 rounded-[2.5rem] flex items-center justify-center text-center gap-4 group">
        <Star size={16} className="text-secondary opacity-50 group-hover:scale-125 transition-transform" />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Root-level access can only be modified via database</p>
      </div>
    </motion.div>
  );
}

function PricingLegacy() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('settings').select('value').eq('key', 'pricing_plans').maybeSingle();
      if (data?.value) setPlans(data.value);
      setLoading(false);
    }
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({ key: 'pricing_plans', value: plans }, { onConflict: 'key' });
    if (error) toast.error('Sync error');
    else toast.success('Pricing Data Updated', { icon: '🎖️' });
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center font-black uppercase text-[10px] tracking-widest text-text-muted opacity-40 italic flex items-center justify-center gap-4"><Loader2 className="animate-spin" size={20} /> Loading Data...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12">
      <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[2.5rem] flex items-center gap-6 shadow-xl shadow-blue-500/5">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0"><Layout size={32} /></div>
        <div className="min-w-0">
          <p className="text-sm font-black text-white uppercase italic tracking-tighter mb-1">Notice: Static Pricing Data</p>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-80 leading-relaxed">This section controls the text on the static pricing page. For managing dynamic subscriptions, use the "Plans & Pricing" section.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((p, idx) => (
          <div key={idx} className="glass-panel p-8 bg-[#121214] border-white/5 rounded-[2.5rem] space-y-8 hover:border-blue-500/30 transition-all group shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-blue-500/10 text-text-muted group-hover:text-blue-500 flex items-center justify-center transition-all">
                <Award size={20} />
              </div>
              <input 
                value={p.name} 
                onChange={e => {const n=[...plans]; n[idx].name=e.target.value.toUpperCase(); setPlans(n);}} 
                className="bg-transparent text-xl font-black text-white uppercase italic tracking-tighter outline-none border-b border-transparent focus:border-blue-500/50 w-full" 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">Fee (₹)</label>
                <input 
                  type="number" value={p.price} 
                  onChange={e => {const n=[...plans]; n[idx].price=Number(e.target.value); setPlans(n);}} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white outline-none focus:border-blue-500 font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">Credits Label</label>
                <input 
                  value={p.credits} 
                  onChange={e => {const n=[...plans]; n[idx].credits=e.target.value; setPlans(n);}} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white outline-none focus:border-blue-500 font-mono" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <button onClick={save} disabled={saving} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save All Changes
        </button>
      </div>
    </motion.div>
  );
}

function AIKeysSettings() {
  const [keys, setKeys] = useState({ gemini: '', openrouter: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('settings').select('value').eq('key', 'api_keys').maybeSingle();
      if (data?.value) setKeys(prev => ({ ...prev, ...data.value }));
      setLoading(false);
    }
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({ key: 'api_keys', value: keys }, { onConflict: 'key' });
    if (error) toast.error('Sync Error');
    else toast.success('AI Nodes Synchronized', { icon: '⚡' });
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center font-black uppercase text-[10px] tracking-widest text-text-muted opacity-40 italic flex items-center justify-center gap-4"><Loader2 className="animate-spin" size={20} /> Accessing Encryption Keys...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10">
      <div className="glass-panel p-10 bg-[#121214] border-white/5 rounded-[3rem] shadow-3xl space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center shadow-glow shadow-yellow-400/20"><Zap size={28} /></div>
          <div>
            <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">LLM Node Keys</h4>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Manage connection keys for AI providers</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Google Gemini API Key</label>
            <div className="relative group">
              <input 
                type="password"
                value={keys.gemini} 
                onChange={e => setKeys({...keys, gemini: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white italic tracking-widest outline-none focus:border-yellow-400 transition-all font-mono" 
                placeholder="AIzaSy..." 
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-6 p-2 bg-white/5 border border-white/10 rounded-lg text-text-muted text-[8px] font-black uppercase tracking-widest pointer-events-none group-focus-within:hidden">Hidden</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">OpenRouter API Key (sk-or-...)</label>
            <div className="relative group">
              <input 
                type="password"
                value={keys.openrouter} 
                onChange={e => setKeys({...keys, openrouter: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white italic tracking-widest outline-none focus:border-yellow-400 transition-all font-mono" 
                placeholder="sk-or-v1-..." 
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-6 p-2 bg-white/5 border border-white/10 rounded-lg text-text-muted text-[8px] font-black uppercase tracking-widest pointer-events-none group-focus-within:hidden">Hidden</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/5">
          <button onClick={save} disabled={saving} className="px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-yellow-500/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Synchronize Keys
          </button>
        </div>
      </div>

      <div className="p-8 bg-yellow-400/5 border border-yellow-400/20 rounded-[2.5rem] flex items-start gap-6 shadow-xl shadow-yellow-400/5">
        <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center shrink-0 mt-1"><ShieldCheck size={24} /></div>
        <div className="space-y-2">
          <p className="text-sm font-black text-white uppercase italic tracking-tighter">Security Protocol</p>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-relaxed opacity-70">
            These keys are used for platform-wide AI features. Ensure they have sufficient credits. 
            Gemini keys are retrieved on-demand from the database, while OpenRouter keys are cached in the environment for performance.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
