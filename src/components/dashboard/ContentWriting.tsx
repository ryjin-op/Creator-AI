'use client';

import { useState } from 'react';
import { Sparkles, Type, Send, RefreshCw, ChevronRight, MessageSquare, Layout, Zap, Check, Copy, Languages, Globe, Activity, Scissors, TrendingUp, Target, ChevronDown, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import toast from 'react-hot-toast';
import { generateContentIdeas, generateScript, refineScript } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentWritingProps {
  onZeroCredits: () => void;
  initialProject?: any;
}

const MODELS = {
  'gemini': {
    id: 'gemini',
    name: 'Gemini 1.5 Flash',
    provider: 'Google AI',
    description: 'Smart logic with audience focus.',
    cost: '1 Credit',
    icon: <Sparkles size={18} className="text-primary" />,
    isPro: true
  },
  'stepfun/step-3.5-flash:free': {
    id: 'stepfun/step-3.5-flash:free',
    name: 'Step 3.5 Flash',
    provider: 'StepFun',
    description: 'Fast and effective script structures.',
    cost: '1 Credit',
    icon: <Zap size={18} className="text-secondary" />
  },
  'minimax/minimax-m2.5:free': {
    id: 'minimax/minimax-m2.5:free',
    name: 'MiniMax M2.5',
    provider: 'MiniMax',
    description: 'Sophisticated creative writing.',
    cost: '1 Credit',
    icon: <TrendingUp size={18} className="text-accent" />
  }
};

const languages = [
  { id: 'English', name: 'English' },
  { id: 'Hinglish', name: 'Hinglish', sub: 'Hindi with English typing' },
  { id: 'Hindi', name: 'Hindi' },
  { id: 'Bengali', name: 'Bengali' }
];

export default function ContentWriting({ onZeroCredits, initialProject }: ContentWritingProps) {
  const { profile, deductCredit } = useAuth();
  const { addProject } = useProjects();
  
  const [activeTab, setActiveTab] = useState(initialProject?.type === 'Script' ? 'script' : 'ideas');
  const [contentType, setContentType] = useState('Long video');
  const [niche, setNiche] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Hinglish');
  const [modelType, setModelType] = useState(() => 
    (profile?.plan === 'pro' || profile?.plan === 'premium') ? 'gemini' : 'stepfun/step-3.5-flash:free'
  );
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);

  const [lastTopic, setLastTopic] = useState('');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideas, setIdeas] = useState<any[]>(() => {
    if (initialProject?.type === 'Idea' && initialProject?.content) {
      try { return JSON.parse(initialProject.content); } catch { return []; }
    }
    return [];
  });

  const [scriptIdeaPrompt, setScriptIdeaPrompt] = useState(initialProject?.type === 'Script' ? initialProject.name : '');
  const [activeIdea, setActiveIdea] = useState<any>(initialProject?.type === 'Script' ? { title: initialProject.name, hook: '' } : null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [currentScript, setCurrentScript] = useState(initialProject?.type === 'Script' ? (initialProject.content || '') : '');
  const [refinements, setRefinements] = useState<string[]>([]);
  const [customInstruction, setCustomInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentModel = (MODELS as any)[modelType] || MODELS.gemini;
  const isModelLocked = currentModel.isPro && (!profile?.plan || profile.plan === 'free');

  const handleGenerateIdeas = async () => {
    if (!lastTopic || !niche) return toast.error('Please fill in last topic and niche.');
    if (!profile || (profile.credits || 0) <= 0) {
      onZeroCredits();
      return;
    }

    setIsGeneratingIdeas(true);
    setIdeas([]);
    try {
      if (isModelLocked) {
        toast.error('Gemini is reserved for PRO users.', { icon: '👑' });
        return;
      }
      const data = await generateContentIdeas(contentType, lastTopic, niche, modelType);
      setIdeas(data.ideas);
      await deductCredit();
      
      addProject({
        name: `Ideas: ${lastTopic.slice(0, 20)}...`,
        type: 'Idea',
        thumbnail: 'IDEA_TEXT_ONLY',
        content: JSON.stringify(data.ideas)
      });
      toast.success('Ideas generated!');
    } catch (err: any) {
      toast.error(err.message || 'Error generating ideas');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleWriteScript = async (idea: any) => {
    if (!profile || (profile.credits || 0) <= 0) {
      onZeroCredits();
      return;
    }
    setActiveIdea(idea);
    setIsGeneratingScript(true);
    setCurrentScript('');
    try {
      if (isModelLocked) {
        toast.error('Gemini is PRO only.', { icon: '👑' });
        return;
      }
      const data = await generateScript(idea, contentType, niche, selectedLanguage, modelType);
      setCurrentScript(data.script);
      setRefinements(data.refinements);
      await deductCredit();
      
      addProject({
        name: idea.title,
        type: 'Script',
        thumbnail: 'SCRIPT_TEXT_ONLY',
        content: data.script
      });
      toast.success('Script written!');
    } catch (err: any) {
      toast.error(err.message || 'Error writing script');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!instruction.trim()) return;
    if (!profile || (profile.credits || 0) <= 0) {
      onZeroCredits();
      return;
    }
    setIsRefining(true);
    try {
      const data = await refineScript(currentScript, instruction, selectedLanguage, modelType);
      setCurrentScript(data.script);
      setRefinements(data.refinements);
      await deductCredit();
      toast.success('Script refined!');
    } catch (err: any) {
      toast.error(err.message || 'Refinement failed');
    } finally {
      setIsRefining(false);
      setCustomInstruction('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-160px)] text-white">
      {/* Input Side */}
      <div className="w-full lg:w-[320px] glass-panel bg-[#121214] flex flex-col border border-white/5 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
        <div className="flex bg-white/5 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('ideas')}
            className={`flex-1 py-3 text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
              activeTab === 'ideas' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-text-muted hover:text-white'
            }`}
          >
            Topics
          </button>
          <button 
            onClick={() => setActiveTab('script')}
            className={`flex-1 py-3 text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
              activeTab === 'script' ? 'text-secondary border-b-2 border-secondary bg-white/5' : 'text-text-muted hover:text-white'
            }`}
          >
            Script
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Shared Content Type */}
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

          {activeTab === 'ideas' ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Topic History</label>
                <input
                  value={lastTopic}
                  onChange={(e) => setLastTopic(e.target.value)}
                  placeholder="e.g. 10 Best AI Productivity Tools"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all font-body text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Channel Niche</label>
                <input
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Technology, Gaming, Finance"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-all font-body text-xs"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Script Concept</label>
                <textarea
                  value={scriptIdeaPrompt}
                  onChange={(e) => setScriptIdeaPrompt(e.target.value)}
                  placeholder="Paste your idea or description here..."
                  className="w-full min-h-[100px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary transition-all font-body text-xs resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Output Language</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={16} />
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary appearance-none cursor-pointer text-xs font-bold"
                  >
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id} className="bg-[#121214]">{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Model Picker */}
          <div className="relative">
            <button
              onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all border ${
                isModelPickerOpen ? 'border-primary ring-4 ring-primary/10' : 'border-white/5 bg-white/2'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{currentModel.icon}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{currentModel.name}</span>
                  {isModelLocked && <Lock size={12} className="text-primary" />}
                </div>
                <div className="text-[10px] text-text-muted font-black uppercase tracking-widest leading-tight">{currentModel.provider}</div>
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
                          {m.isPro && <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] leading-tight">PRO</span>}
                        </div>
                        <div className="text-[10px] text-text-muted line-clamp-1">{m.description}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-5 bg-black/20 border-t border-white/5">
          <button
            onClick={activeTab === 'ideas' ? handleGenerateIdeas : () => handleWriteScript({ title: scriptIdeaPrompt, hook: '' })}
            disabled={isGeneratingIdeas || isGeneratingScript || (activeTab === 'ideas' ? !lastTopic : !scriptIdeaPrompt) || isModelLocked}
            className={`btn btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 group shadow-xl text-xs font-black uppercase tracking-widest ${
              isModelLocked ? 'grayscale opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGeneratingIdeas || isGeneratingScript ? (
              <><Loader2 className="animate-spin" size={18} /> Processing...</>
            ) : isModelLocked ? (
              <><Lock size={18} /> Unlock Gemini Pro</>
            ) : (
              <>
                {activeTab === 'ideas' ? <Zap size={18} /> : <Type size={18} />}
                {activeTab === 'ideas' ? 'Find Topics' : 'Generate Full Script'}
                <span className="ml-auto text-[10px] font-black bg-black/20 px-2 py-0.5 rounded uppercase tracking-widest">{currentModel.cost}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Side */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
        {activeTab === 'ideas' ? (
          <>
            {isGeneratingIdeas ? (
              <div className="flex-1 glass-panel bg-[#121214] border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-[40px] animate-pulse" />
                  <Zap size={64} className="text-primary relative animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white mt-8 mb-2 tracking-tight italic uppercase leading-none">Analyzing...</h3>
                <p className="text-text-muted uppercase tracking-[0.2em] text-xs font-bold opacity-60">Scanning for content opportunities</p>
              </div>
            ) : ideas.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black font-heading flex items-center gap-3 uppercase italic tracking-tighter">
                    <Layout size={20} className="text-secondary" /> Topic Results
                  </h3>
                  <span className="text-[10px] font-black bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full uppercase tracking-widest">
                    {ideas.length} Concepts Found
                  </span>
                </div>
                <div className="grid gap-4">
                  {ideas.map((idea, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-panel p-4 bg-[#121214] border-white/5 rounded-2xl hover:border-secondary/30 group transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-1 text-left">
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-black text-white group-hover:text-secondary transition-colors tracking-tight italic uppercase">{idea.title}</h4>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-[9px] font-black uppercase tracking-tighter">
                              <Activity size={10} /> {idea.viralScore}% Match
                            </div>
                          </div>
                          <p className="text-xs text-text-muted font-medium italic opacity-80 leading-relaxed">{idea.hook}</p>
                        </div>
                        <button
                          onClick={() => { setScriptIdeaPrompt(idea.title); setActiveTab('script'); handleWriteScript(idea); }}
                          className="px-5 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap"
                        >
                          Write Script
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 glass-panel bg-[#121214] border-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-text-muted">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-black font-heading mb-2 text-white italic uppercase">Topic Library</h3>
                <p className="text-xs text-text-muted max-w-xs font-medium opacity-60 leading-relaxed italic">Enter your niche details to discover video concepts.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {isGeneratingScript ? (
              <div className="flex-1 glass-panel bg-[#121214] border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center mb-8">
                  <Type size={40} className="text-secondary animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight italic uppercase leading-none">Writing your script...</h3>
                <p className="text-text-muted uppercase tracking-[0.2em] text-xs font-bold opacity-60">Creating high-quality content</p>
              </div>
            ) : currentScript ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full gap-6"
              >
                <div className="glass-panel p-5 bg-[#121214] border-white/5 rounded-2xl flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-5 shrink-0">
                    <h3 className="text-lg font-black font-heading flex items-center gap-3 italic uppercase tracking-tighter">
                      <MessageSquare size={20} className="text-secondary" /> Written Script
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { navigator.clipboard.writeText(currentScript); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); toast.success('Copied!'); }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                      >
                        {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                      <button 
                        onClick={() => handleWriteScript(activeIdea || { title: scriptIdeaPrompt, hook: '' })}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 bg-white/[0.01] border border-white/5 rounded-2xl font-body text-sm leading-relaxed text-[#f8fafc] whitespace-pre-wrap selection:bg-secondary/30 text-left custom-scrollbar">
                    {currentScript}
                  </div>
                </div>

                {/* Refinement Area */}
                <div className="glass-panel p-5 bg-black/40 border-white/5 rounded-2xl shrink-0 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {refinements.map((ref, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleRefine(ref)}
                        className="px-3 py-1.5 bg-secondary/5 hover:bg-secondary/15 border border-secondary/20 rounded-full text-[9px] font-black uppercase tracking-widest text-secondary transition-all"
                      >
                        + {ref}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      value={customInstruction}
                      onChange={(e) => setCustomInstruction(e.target.value)}
                      placeholder="Ask for edits, tone changes, or polish..."
                      onKeyDown={(e) => e.key === 'Enter' && handleRefine(customInstruction)}
                      className="w-full pl-5 pr-14 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary transition-all font-body text-xs"
                    />
                    <button
                      onClick={() => handleRefine(customInstruction)}
                      disabled={!customInstruction || isRefining}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white shadow-lg shadow-secondary/20 disabled:grayscale transition-all"
                    >
                      {isRefining ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 glass-panel bg-[#121214] border-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-text-muted">
                  <Type size={32} />
                </div>
                <h3 className="text-lg font-black font-heading mb-2 text-white italic uppercase tracking-tighter">Script Writer</h3>
                <p className="text-xs text-text-muted max-w-xs font-medium opacity-60 leading-relaxed italic">Type or select a concept to begin the writing process.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
