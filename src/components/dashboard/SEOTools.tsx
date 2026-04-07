'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Search, TrendingUp, Hash, AlignLeft, Target, ChevronDown, Zap, Lock, Loader2 } from 'lucide-react';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { generateSEOContent } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface SEOToolsProps {
  onZeroCredits: () => void;
  initialProject?: any;
}

const MODELS = {
  'gemini': {
    id: 'gemini',
    name: 'Gemini 1.5 Flash',
    provider: 'Google AI',
    description: 'High-quality SEO optimization with precision.',
    cost: '1 Credit',
    icon: <Sparkles size={18} className="text-primary" />,
    isPro: true
  },
  'stepfun/step-3.5-flash:free': {
    id: 'stepfun/step-3.5-flash:free',
    name: 'Step 3.5 Flash',
    provider: 'StepFun',
    description: 'High-speed SEO optimization.',
    cost: '1 Credit',
    icon: <Zap size={18} className="text-secondary" />
  },
  'minimax/minimax-m2.5:free': {
    id: 'minimax/minimax-m2.5:free',
    name: 'MiniMax M2.5',
    provider: 'MiniMax',
    description: 'Smart contextual analysis.',
    cost: '1 Credit',
    icon: <TrendingUp size={18} className="text-accent" />
  }
};

export default function SEOTools({ onZeroCredits, initialProject }: SEOToolsProps) {
  const { addProject } = useProjects();
  const { profile, deductCredit } = useAuth();
  const [topic, setTopic] = useState(initialProject?.name || '');
  const [about, setAbout] = useState('');
  const [contentType, setContentType] = useState('Long video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(!!initialProject?.content);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [modelType, setModelType] = useState(() => 
    (profile?.plan === 'pro' || profile?.plan === 'premium') ? 'gemini' : 'stepfun/step-3.5-flash:free'
  );
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);

  const [seoData, setSeoData] = useState(() => {
    if (initialProject?.content) {
      try { return JSON.parse(initialProject.content); } catch { return { title: '', description: '', tags: '', hashtags: '' }; }
    }
    return { title: '', description: '', tags: '', hashtags: '' };
  });

  const currentModel = (MODELS as any)[modelType] || MODELS.gemini;
  const isModelLocked = currentModel.isPro && (!profile?.plan || profile.plan === 'free');

  const handleGenerate = async () => {
    if (!topic) return;
    if (!profile || (profile.credits || 0) <= 0) {
      onZeroCredits();
      return;
    }

    setIsGenerating(true);
    try {
      if (isModelLocked) {
        toast.error('Gemini is reserved for PRO users.', { icon: '👑' });
        setIsGenerating(false);
        return;
      }

      const data = await generateSEOContent(topic, about, contentType, modelType);
      await deductCredit();
      setSeoData(data);
      setHasGenerated(true);

      addProject({
        name: topic,
        type: 'SEO',
        thumbnail: 'SEO_TEXT_ONLY',
        content: JSON.stringify(data)
      });

      toast.success(`SEO Pack generated using ${currentModel.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false });
    }, 2000);
    toast.success('Copied to clipboard!', { position: 'bottom-center' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-160px)] text-white text-left">
      {/* Input Side */}
      <div className="w-full lg:w-[320px] glass-panel bg-[#121214] flex flex-col border border-white/5 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
        <div className="p-5 border-b border-white/5 bg-white/2">
          <h2 className="text-lg font-black font-heading flex items-center gap-2 uppercase italic tracking-tighter">
            <Search className="text-primary" size={20} /> SEO Optimizer
          </h2>
          <p className="text-[10px] text-text-muted mt-1.5 font-bold uppercase tracking-widest opacity-60">Boost your reach automatically.</p>
        </div>

        <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Format</label>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              {['Long video', 'Reel or shorts'].map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    contentType === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Video Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Top 10 Creators Tools"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all font-body text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Context (Optional)</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Specific keywords or style..."
              className="w-full min-h-[100px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all font-body text-xs resize-none"
            />
          </div>
        </div>

        {/* Model Picker & Action */}
        <div className="p-5 border-t border-white/5 bg-black/20 space-y-4">
          <div className="relative">
            <button
              onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all border ${
                isModelPickerOpen ? 'border-primary ring-4 ring-primary/5' : 'border-white/5 bg-white/2'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                {currentModel.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{currentModel.name}</span>
                  {isModelLocked && <Lock size={10} className="text-primary" />}
                </div>
                <div className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-tight">{currentModel.provider}</div>
              </div>
              <ChevronDown size={14} className={`text-text-muted transition-transform ${isModelPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isModelPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-3 left-0 right-0 bg-[#13131A] border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-[50] p-2"
                >
                  {Object.values(MODELS).map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => { setModelType(m.id); setIsModelPickerOpen(false); }}
                      className={`w-full p-3 rounded-xl flex items-center gap-4 text-left transition-colors ${
                        modelType === m.id ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{m.icon}</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {m.name}
                          {m.isPro && <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] leading-tight font-black uppercase">PRO</span>}
                        </div>
                        <div className="text-[10px] text-text-muted line-clamp-1">{m.description}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic || isModelLocked}
            className={`btn btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 group shadow-xl text-xs font-black uppercase tracking-widest ${
              isModelLocked ? 'grayscale opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" size={16} /> Generating...</>
            ) : isModelLocked ? (
              <><Lock size={16} /> Unlock Gemini</>
            ) : (
              <>
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                Generate Pack
                <span className="ml-auto text-[10px] font-black bg-black/20 px-2 py-0.5 rounded uppercase tracking-widest">{currentModel.cost}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Side */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
        {!hasGenerated && !isGenerating ? (
          <div className="flex-1 glass-panel bg-[#121214] border-white/5 flex items-center justify-center text-center p-12 rounded-2xl border border-dashed border-white/20">
            <div className="max-w-xs">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-text-muted">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-black font-heading mb-2 text-white italic uppercase tracking-tighter">Ready to grow?</h3>
              <p className="text-xs text-text-muted font-medium leading-relaxed italic opacity-60">Enter your video topic and watch the SEO magic happen.</p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="flex-1 glass-panel bg-[#121214] border-white/5 flex flex-col items-center justify-center text-center p-12 rounded-2xl animate-pulse-slow">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-8">
              <TrendingUp size={40} className="text-primary" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tight leading-none">Analyzing Content...</h3>
            <p className="text-text-muted uppercase tracking-[0.2em] text-xs font-bold opacity-60">Finding high-reach keywords</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div 
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl shadow-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black font-heading flex items-center gap-3 uppercase italic tracking-tighter"><TrendingUp className="text-primary" size={18} /> Optimized Title</h3>
                <button onClick={() => handleCopy('title', seoData.title)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10">
                  {copiedStates['title'] ? <Check size={16} className="text-[#00fa9a]" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-xl font-black font-heading leading-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent italic uppercase tracking-tight">{seoData.title}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.1 }}
                className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black font-heading flex items-center gap-3 uppercase italic tracking-tighter"><Target className="text-secondary" size={16} /> High-Ranking Tags</h3>
                  <button onClick={() => handleCopy('tags', seoData.tags)} className="p-2 text-text-muted hover:text-white transition-all"><Copy size={16} /></button>
                </div>
                <div className="text-[11px] p-3.5 bg-white/2 border border-white/5 rounded-xl text-text-muted leading-relaxed font-mono opacity-80 break-words">
                  {seoData.tags}
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black font-heading flex items-center gap-3 uppercase italic tracking-tighter"><Hash className="text-accent" size={16} /> Viral Hashtags</h3>
                  <button onClick={() => handleCopy('hashtags', seoData.hashtags)} className="p-2 text-text-muted hover:text-white transition-all"><Copy size={16} /></button>
                </div>
                <div className="text-[11px] p-3.5 bg-white/2 border border-white/5 rounded-xl text-text-muted leading-relaxed font-mono opacity-80 break-words">
                  {seoData.hashtags}
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black font-heading flex items-center gap-3 text-secondary uppercase italic tracking-tighter"><AlignLeft size={16} /> Smart Description</h3>
                <button onClick={() => handleCopy('description', seoData.description)} className="p-2 text-text-muted hover:text-white transition-all"><Copy size={16} /></button>
              </div>
              <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl font-body text-xs leading-relaxed text-[#f8fafc]/80 whitespace-pre-wrap text-left custom-scrollbar max-h-[300px] overflow-y-auto">
                {seoData.description}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
