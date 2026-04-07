'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Sparkles, Save, RefreshCw, Target, Type, AlignLeft, Hash, Cpu, Zap, Activity, Shield, Code, Settings, Loader2 } from 'lucide-react';
import { DEFAULT_PROMPTS } from '@/lib/prompt-manager';
import { motion, AnimatePresence } from 'framer-motion';

const MODELS = [
  { id: 'gemini', name: 'Gemini 2.5 Flash (Pro)', color: 'text-primary' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (Pro)', color: 'text-secondary' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (Pro)', color: 'text-accent' },
  { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash (Free)', color: 'text-white' },
];

export default function AdminPrompts() {
  const [activeTab, setActiveTab] = useState('seo');
  const [seoSection, setSeoSection] = useState<'short' | 'long'>('short');
  const [prompts, setPrompts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { loadPrompts(); }, []);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('ai_prompts').select('*');
      if (error) throw error;

      const loaded: any = {
        seo: { short: {}, long: {} },
        content: { idea: {}, script: {} }
      };
      
      data?.forEach(p => {
        if (!loaded[p.tool]) loaded[p.tool] = {};
        if (!loaded[p.tool][p.section]) loaded[p.tool][p.section] = {};
        loaded[p.tool][p.section][p.sub_section] = {
          text: p.prompt_text,
          model: p.model_id || 'gemini'
        };
      });

      // Fill missing with defaults
      for (const t in DEFAULT_PROMPTS) {
        for (const s in (DEFAULT_PROMPTS as any)[t]) {
          for (const sub in (DEFAULT_PROMPTS as any)[t][s]) {
             if (typeof (DEFAULT_PROMPTS as any)[t][s][sub] === 'string') {
               if (!loaded[t]?.[s]?.[sub]) {
                 if (!loaded[t]) loaded[t] = {};
                 if (!loaded[t][s]) loaded[t][s] = {};
                 loaded[t][s][sub] = { text: (DEFAULT_PROMPTS as any)[t][s][sub], model: 'gemini' };
               }
             }
          }
        }
      }
      setPrompts(loaded);
    } catch (err: any) {
      toast.error('Sync Error: Could not reach prompt database.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (tool: string, section: string, sub: string, key: string, value: any) => {
    setPrompts((prev: any) => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        [section]: {
          ...prev[tool][section],
          [sub]: { ...prev[tool][section][sub], [key]: value }
        }
      }
    }));
  };

  const savePrompt = async (tool: string, section: string, sub: string) => {
    const saveKey = `${tool}-${section}-${sub}`;
    setSavingId(saveKey);
    try {
      const data = prompts[tool][section][sub];
      const { error } = await supabase
        .from('ai_prompts')
        .upsert({
          tool,
          section,
          sub_section: sub,
          prompt_text: data.text,
          model_id: data.model,
          last_updated: new Date().toISOString()
        }, { onConflict: 'tool,section,sub_section' });
        
      if (error) throw error;
      toast.success('Prompt Saved: ' + sub.toUpperCase(), { icon: '💾' });
    } catch (err: any) {
      toast.error('Save Failed: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const resetPrompt = async (tool: string, section: string, sub: string) => {
    const defaultText = (DEFAULT_PROMPTS as any)[tool][section][sub];
    if (!defaultText) return;

    handleUpdate(tool, section, sub, 'text', defaultText);
    const saveKey = `${tool}-${section}-${sub}`;
    setSavingId(saveKey);
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .upsert({
          tool,
          section,
          sub_section: sub,
          prompt_text: defaultText,
          model_id: 'gemini',
          last_updated: new Date().toISOString()
        }, { onConflict: 'tool,section,sub_section' });
        
      if (error) throw error;
      toast.success('Prompt Restored to Default Settings', { icon: '♻️' });
    } catch (err: any) {
      toast.error('Restore Fault Detected');
    } finally {
      setSavingId(null);
    }
  };

  const renderPromptBox = (tool: string, section: string, sub: string, label: string, icon: any) => {
    const isSaving = savingId === `${tool}-${section}-${sub}`;
    const Icon = icon;
    const data = prompts[tool]?.[section]?.[sub] || { text: '', model: 'gemini' };

    return (
      <div className="glass-panel p-8 bg-[#121214] border-white/5 rounded-[2.5rem] space-y-6 hover:border-primary/20 transition-all group shadow-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-primary transition-all">
              <Icon size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{label}</h4>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-50">AI Instruction Set</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/2 border border-white/5 rounded-xl px-4 py-2">
            <Cpu size={14} className="text-secondary" />
            <select
              value={data.model}
              onChange={(e) => handleUpdate(tool, section, sub, 'model', e.target.value)}
              className="bg-transparent text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer"
            >
              {MODELS.map(m => <option key={m.id} value={m.id} className="bg-[#121214]">{m.name}</option>)}
            </select>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={data.text}
            onChange={(e) => handleUpdate(tool, section, sub, 'text', e.target.value)}
            className="w-full min-h-[160px] bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-medium text-white/90 font-mono leading-relaxed outline-none focus:border-primary transition-all custom-scrollbar shrink-0"
            placeholder="Write AI instructions here..."
          />
          <div className="absolute top-4 right-4 pointer-events-none opacity-10">
            <Code size={40} />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={() => resetPrompt(tool, section, sub)}
            disabled={isSaving}
            className="px-6 py-3 bg-white/5 text-text-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-30"
          >
            Factory Reset
          </button>
          <button
            onClick={() => savePrompt(tool, section, sub)}
            disabled={isSaving}
            className="px-10 py-3 bg-gradient-main text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Loading AI Settings...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Prompt Settings</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 opacity-70">Customise the AI instructions for various tools</p>
        </div>
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
          {[
            { id: 'seo', label: 'SEO Generator', icon: Target },
            { id: 'content', label: 'Content Lab', icon: AlignLeft },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest ${
                activeTab === t.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-text-muted hover:text-white'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'seo' && (
          <motion.div key="seo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
            <div className="flex gap-8 border-b border-white/5">
              {[
                { id: 'short', label: 'Short Content' },
                { id: 'long', label: 'Long Form' },
              ].map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSeoSection(s.id as any)}
                  className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                    seoSection === s.id ? 'text-primary' : 'text-text-muted hover:text-white opacity-50 hover:opacity-100'
                  }`}
                >
                  {s.label}
                  {seoSection === s.id && <motion.div layoutId="seo-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-glow-primary" />}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">
              {renderPromptBox('seo', seoSection, 'title', 'Headline Logic', Type)}
              {renderPromptBox('seo', seoSection, 'description', 'Narrative Logic', AlignLeft)}
              {renderPromptBox('seo', seoSection, 'tags', 'Metadata Matrix', Target)}
              {renderPromptBox('seo', seoSection, 'hashtags', 'Signal Identifier', Hash)}
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4 ml-2">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><Sparkles size={20} /></div>
                <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">AI Ideation Model</h4>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {renderPromptBox('content', 'idea', 'short', 'Short/Reel Conception', Sparkles)}
                {renderPromptBox('content', 'idea', 'long', 'Long Video Conception', Activity)}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 ml-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center"><AlignLeft size={20} /></div>
                <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">AI Scripting Model</h4>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {renderPromptBox('content', 'script', 'short', 'Short/Reel Screenplay', AlignLeft)}
                {renderPromptBox('content', 'script', 'long', 'Long Video Screenplay', Zap)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
