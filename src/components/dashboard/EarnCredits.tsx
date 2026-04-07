'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Gift, PlaySquare, CreditCard, Loader2, Zap, ArrowRight, Check, Rocket, Sparkles, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EarnCredits() {
  const { user, profile, refreshProfile } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [configRes, plansRes, bonusRes] = await Promise.all([
          supabase.from('app_config').select('*').eq('id', 1).single(),
          supabase.from('subscription_plans').select('*').eq('is_active', true).order('price', { ascending: true }),
          supabase.from('plan_bonus').select('*')
        ]);
        
        if (configRes.data) setConfig(configRes.data);
        if (plansRes.data && bonusRes.data) {
          const bMap: Record<string, number> = {};
          bonusRes.data.forEach((b: any) => bMap[b.plan_id] = b.daily_bonus);
          const mapped = plansRes.data.map((p: any) => ({
            ...p,
            daily_bonus: bMap[p.plan_id] || 0
          }));
          
          const freePlan = mapped.find((p: any) => p.plan_id.toLowerCase() === 'free' || p.plan_id.toLowerCase() === 'f');
          const paidPlans = mapped.filter((p: any) => p.plan_id.toLowerCase() !== 'free' && p.plan_id.toLowerCase() !== 'f');
          setPlans(freePlan ? [freePlan, ...paidPlans] : paidPlans);
        }
      } catch (err) {
        console.error("Error fetching credit config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const todayIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().split('T')[0];
  const adsWatchedToday = profile?.last_ad_date === todayIST ? (profile?.daily_ads_watched || 0) : 0;
  const maxAds = config?.daily_ad_limit || 5;
  const adReward = config?.ad_reward || 1;
  const canWatchAd = adsWatchedToday < maxAds;

  const handleWatchAd = () => {
    if (!canWatchAd) return toast.error('You have reached your daily ad limit!');
    toast('Loading Ad...', { icon: '📺', position: 'bottom-center' });
    
    setTimeout(async () => {
      if (!profile || !user) return;
      
      const newCredits = (profile.credits || 0) + adReward;
      const newWatchedCount = adsWatchedToday + 1;

      const { error } = await supabase.from('profiles').update({ 
        credits: newCredits,
        daily_ads_watched: newWatchedCount,
        last_ad_date: todayIST
      }).eq('id', user.id);

      if (!error) {
        toast.success(`Success: +${adReward} Credits Added!`, {
          icon: '💎',
          style: { background: '#121214', color: '#00fa9a', border: '1px solid #00fa9a30' }
        });
        refreshProfile();
      } else {
        toast.error('Sync failed. Please retry.');
      }
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted space-y-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Loading Credits...</p>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-12 pb-16 text-white"
    >
      {/* Balance Summary */}
      <motion.div variants={itemVariants} className="glass-panel p-10 bg-primary/5 border-primary/20 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors" />
        <div className="text-center md:text-left space-y-3">
          <h2 className="text-4xl font-black font-heading tracking-tight flex items-center justify-center md:justify-start gap-4">
            <Zap size={32} className="text-primary animate-pulse" /> Get More Credits
          </h2>
          <p className="text-text-muted text-lg font-medium max-w-lg italic opacity-80 leading-relaxed">
            Credits power your AI generations. Top up instantly or earn daily rewards.
          </p>
        </div>
        <div className="p-8 bg-[#121214] border border-white/10 rounded-2xl text-center shadow-2xl min-w-[200px] relative group-hover:border-primary/40 transition-colors">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 leading-none">Your Balance</div>
          <div className="text-6xl font-black text-primary tracking-tighter leading-none">{profile?.credits || 0}</div>
          <div className="mt-2 text-[10px] font-black text-primary/60 uppercase tracking-widest">Available</div>
        </div>
      </motion.div>

      {/* Ad Earning */}
      {config?.ads_enabled && (
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
            <PlaySquare size={16} className="text-secondary" /> Daily Ad Rewards
          </h3>
          <div className="glass-panel p-8 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 group">
            <div className="space-y-4 text-center lg:text-left">
              <h4 className="text-2xl font-black text-white italic">Earn {adReward} Credit via Ad</h4>
              <p className="text-sm text-text-muted font-medium max-w-md">Watch a 30-second ad to support the service and get rewarded instantly.</p>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  Capacity: <span className={canWatchAd ? 'text-secondary' : 'text-orange-500'}>{adsWatchedToday} / {maxAds}</span>
                </div>
                {canWatchAd && <div className="text-[10px] font-bold text-secondary flex items-center gap-2 italic animate-pulse"><TrendingUp size={12} /> High Yield Available</div>}
              </div>
            </div>
            <button 
              onClick={handleWatchAd} 
              disabled={!canWatchAd} 
              className="px-10 py-5 bg-secondary hover:bg-secondary/80 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-4 transition-all shadow-xl shadow-secondary/20 active:scale-95 disabled:grayscale disabled:opacity-50"
            >
              <PlaySquare size={20} className={canWatchAd ? 'animate-bounce' : ''} /> {canWatchAd ? 'Watch Ad' : 'Daily Limit Reached'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Instant Packages */}
      {config?.purchase_enabled && config?.credit_packages?.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
            <CreditCard size={16} className="text-primary" /> Buy Credits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {config.credit_packages.map((pkg: any, i: number) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -8 }}
                className="glass-panel p-8 bg-[#121214] border-white/5 rounded-3xl flex flex-col items-center gap-6 cursor-pointer hover:border-primary/40 transition-all shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {pkg.credits > 100 ? <Rocket size={32} /> : <Zap size={32} />}
                </div>
                <div className="text-center space-y-1">
                  <div className="text-4xl font-black text-white tracking-tighter leading-none">{pkg.credits}</div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Credits</div>
                </div>
                <div className="text-2xl font-black text-[#00fa9a] drop-shadow-[0_0_10px_rgba(0,250,154,0.3)]">₹{pkg.price}</div>
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all border border-white/10">
                  Buy Now <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plans Bonus */}
      {config?.bonus_enabled && plans.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
            <Gift size={16} className="text-accent" /> Subscription Bonuses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {plans.map(plan => {
              const isActive = profile?.plan === plan.plan_id;
              return (
                <div key={plan.plan_id} className={`glass-panel p-10 rounded-[2.5rem] relative flex flex-col gap-8 transition-all ${
                  isActive ? 'bg-primary/10 border-primary ring-2 ring-primary/20 scale-[1.02]' : 'bg-[#121214] border-white/5'
                }`}>
                  {isActive && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Current Plan</div>}
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">{plan.name}</h4>
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span className="text-5xl font-black text-white tracking-tighter">{plan.currency_symbol || '₹'}{plan.price}</span>
                      {plan.plan_id.toLowerCase() !== 'free' && <span className="text-text-muted font-bold text-sm uppercase opacity-60">/ Mo</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0"><Sparkles size={20} /></div>
                    <div className="text-sm font-black text-white uppercase tracking-widest">+{plan.daily_bonus} <span className="text-text-muted font-medium opacity-60 italic normal-case">Credits Generated Daily</span></div>
                  </div>
                  <button 
                    disabled={isActive}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${
                      isActive ? 'bg-white/5 text-text-muted cursor-default' : 'btn btn-primary shadow-2xl active:scale-95'
                    }`}
                  >
                    {isActive ? 'Current' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
