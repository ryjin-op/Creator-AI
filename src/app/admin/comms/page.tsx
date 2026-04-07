'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Send, BookOpen, Megaphone, Loader2, AlertCircle, Info, CheckCircle2, AlertTriangle, Radio, Activity, Sparkles, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminComms() {
  const [tab, setTab] = useState('announcements');
  
  const tabs = [
    { id: 'announcements', label: 'Dashboard Alerts', icon: Megaphone, color: 'text-primary' },
    { id: 'changelog', label: 'Update Logs', icon: BookOpen, color: 'text-secondary' },
    { id: 'email', label: 'Email Alerts', icon: Send, color: 'text-accent' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Notifications & Alerts</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 opacity-70">Send announcements, update logs, and email notifications to users</p>
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
        {tab === 'announcements' && <Announcements key="announcements" />}
        {tab === 'changelog' && <Changelog key="changelog" />}
        {tab === 'email' && <EmailBlast key="email" />}
      </AnimatePresence>
    </motion.div>
  );
}

function Announcements() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title || !message) { toast.error('Error: Please enter a title and message.'); return; }
    const { error } = await supabase.from('announcements').insert({ title, message, type, active: true });
    if (error) { toast.error('Failed to send announcement.'); return; }
    toast.success('Announcement Published!', { icon: '📡' });
    setTitle(''); setMessage(''); load();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('announcements').update({ active: !active }).eq('id', id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    toast.success('Announcement Deleted'); load();
  };

  const typeStyles: Record<string, any> = {
    info: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: Info },
    warning: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: AlertTriangle },
    success: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle2 },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
      <div className="glass-panel p-10 bg-[#121214] border-white/5 rounded-[3rem] shadow-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Radio size={24} /></div>
          <div>
            <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Create New Alert</h4>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-50">Publish a new alert to all user dashboards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Alert Title</label>
            <input 
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white uppercase italic tracking-widest outline-none focus:border-primary transition-all" 
              placeholder="Announcement Title..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Alert Type</label>
            <select 
              value={type} onChange={e => setType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none cursor-pointer"
            >
              {Object.keys(typeStyles).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Message Content</label>
            <textarea 
              value={message} onChange={e => setMessage(e.target.value)}
              className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-primary transition-all resize-none" 
              placeholder="Write your message here..." 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={add} className="px-12 py-5 bg-gradient-main text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-3">
            <Send size={18} /> Publish Alert
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-2 flex items-center gap-3"><Activity size={16} /> Active Alerts</h4>
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="p-20 text-center text-text-muted font-black uppercase tracking-[0.3em] text-[10px] italic">Loading Alerts...</div>
          ) : items.length === 0 ? (
            <div className="p-20 text-center glass-panel bg-white/2 border border-dashed border-white/10 rounded-[3rem] text-text-muted font-black uppercase tracking-[0.3em] text-[10px] italic">No active alerts found.</div>
          ) : (
            items.map(a => {
              const Style = typeStyles[a.type] || typeStyles.info;
              return (
                <div key={a.id} className={`glass-panel p-6 bg-[#121214] border-white/5 rounded-3xl flex items-center gap-8 transition-all hover:bg-white/[0.01] ${!a.active && 'opacity-30'}`}>
                  <div className={`w-12 h-12 rounded-2xl ${Style.bg} ${Style.color} flex items-center justify-center shrink-0`}>
                    <Style.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-black text-white uppercase italic tracking-tighter truncate leading-none mb-1">{a.title}</h5>
                    <p className="text-[10px] font-bold text-text-muted truncate opacity-60 leading-none">{a.message}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button 
                      onClick={() => toggle(a.id, a.active)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        a.active ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-white/5 text-text-muted border-white/10 opacity-50'
                      }`}
                    >
                      {a.active ? 'Visible' : 'Hidden'}
                    </button>
                    <button onClick={() => remove(a.id)} className="p-3 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Changelog() {
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('new');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('value').eq('key', 'changelog').maybeSingle();
    if (data?.value) setEntries(data.value);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (list: any[]) => {
    await supabase.from('settings').upsert({ key: 'changelog', value: list }, { onConflict: 'key' });
  };

  const add = async () => {
    if (!title) { toast.error('Error: Please enter a title.'); return; }
    const updated = [{ id: Date.now(), title, body, tag, date: new Date().toISOString().slice(0, 10) }, ...entries];
    await save(updated); setEntries(updated); toast.success('Update Logged!');
    setTitle(''); setBody(''); setTag('new');
  };

  const remove = async (id: number) => {
    const updated = entries.filter(e => e.id !== id);
    await save(updated); setEntries(updated); toast.success('Log Deleted');
  };

  const tagColors: Record<string, string> = { new: 'text-primary', improved: 'text-secondary', fix: 'text-accent', breaking: 'text-red-500' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-1 space-y-8">
        <div className="glass-panel p-10 bg-[#121214] border-white/5 rounded-[3rem] shadow-3xl space-y-8 sticky top-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><BookOpen size={24} /></div>
            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">Log New Update</h4>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Protocol Name</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:border-secondary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Log Category</label>
              <select value={tag} onChange={e => setTag(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest outline-none appearance-none cursor-pointer">
                {['new','improved','fix','breaking'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Mission Report</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-secondary transition-all resize-none" />
            </div>
            <button onClick={add} className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Plus size={18} /> Save Update
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-10">
        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] ml-2 flex items-center gap-3"><Activity size={16} /> Update History</h4>
        <div className="space-y-6 relative border-l-2 border-white/5 ml-6 pl-10">
          {entries.map((e, idx) => (
            <motion.div 
              key={e.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative glass-panel p-8 bg-[#121214] border-white/5 rounded-[2.5rem] hover:border-secondary/20 transition-all group shadow-xl"
            >
              <div className="absolute -left-[3.2rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#121214] border-2 border-secondary shadow-glow-secondary z-10" />
              <div className="flex justify-between items-start gap-6">
                <div className="space-y-3">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${tagColors[e.tag]}`}>{e.tag}</div>
                  <h5 className="text-xl font-black text-white italic tracking-tighter uppercase">{e.title}</h5>
                  {e.body && <p className="text-sm font-bold text-text-muted italic opacity-80 leading-relaxed max-w-lg">{e.body}</p>}
                  <div className="text-[9px] font-black text-text-muted uppercase tracking-widest pt-2">{e.date}</div>
                </div>
                <button onClick={() => remove(e.id)} className="p-3 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
          {entries.length === 0 && (
            <div className="p-20 text-center text-text-muted font-black uppercase tracking-[0.3em] text-[10px] italic">No updates found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmailBlast() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto space-y-10">
      <div className="p-8 bg-accent/5 border border-accent/20 rounded-[2.5rem] flex items-center gap-6 shadow-xl shadow-accent/5">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 text-accent flex items-center justify-center shrink-0"><AlertTriangle size={32} /></div>
        <div className="min-w-0">
          <p className="text-sm font-black text-white uppercase italic tracking-tighter mb-1">Warning: Email Service Disconnected</p>
          <p className="text-[10px] font-black text-accent uppercase tracking-widest opacity-80">Sending mass emails requires an active email provider integration. Use the settings below for drafting.</p>
        </div>
      </div>

      <div className="glass-panel p-12 bg-[#121214] border-white/5 rounded-[3.5rem] shadow-3xl space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center"><Bell size={28} /></div>
          <div>
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Mass Email Alerts</h4>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Draft and send announcements to all users via email</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Subject</label>
            <input 
              value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white outline-none focus:border-accent transition-all" 
              placeholder="Enter email subject..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Content (HTML/Text)</label>
            <textarea 
              value={body} onChange={e => setBody(e.target.value)}
              className="w-full min-h-[300px] bg-black/40 border border-white/10 rounded-3xl p-8 text-sm font-medium text-white/90 font-mono leading-relaxed outline-none focus:border-accent transition-all custom-scrollbar shrink-0"
              placeholder="Write your email content here..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            disabled 
            className="px-12 py-6 bg-white/5 text-text-muted border border-white/10 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 cursor-not-allowed grayscale"
          >
            <Send size={18} /> Service Unavailable
          </button>
        </div>
      </div>
    </motion.div>
  );
}
