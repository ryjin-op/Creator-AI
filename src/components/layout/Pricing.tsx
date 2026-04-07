'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, Star, Loader2, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { SubscriptionPlan } from '@/types';

export default function Pricing() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    async function fetchDynamicPlans() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (!error && data && data.length > 0) {
          const freePlan = data.find(p => p.plan_id.toLowerCase() === 'free');
          const paidPlans = data.filter(p => p.plan_id.toLowerCase() !== 'free').sort((a, b) => a.price - b.price);

          let finalPlans: SubscriptionPlan[] = [];
          if (freePlan) finalPlans.push(freePlan);
          finalPlans = [...finalPlans, ...paidPlans];
          setPlans(finalPlans);
        } else {
          // Fallback to mock plans if database is empty or restricted
          console.warn('Using mock plans fallback');
          setPlans([
            { plan_id: 'free', name: 'Free', price: 0, credits: 50, currency_symbol: '₹', is_active: true, features: ['50 Credits', 'Standard Access', 'Basic Support'] },
            { plan_id: 'pro', name: 'Pro', price: 299, credits: 500, currency_symbol: '₹', is_active: true, features: ['500 Credits', 'Priority Access', 'Advanced AI'] },
            { plan_id: 'premium', name: 'Premium', price: 699, credits: 2000, currency_symbol: '₹', is_active: true, features: ['2000 Credits', 'Elite Engine', '24/7 Support'] }
          ] as any);
        }
      } catch (e) {
        console.error('Pricing fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchDynamicPlans();
  }, []);

  const handlePlanClick = (plan: SubscriptionPlan) => {
    const finalPrice = billingCycle === 'yearly' ? Math.floor(plan.price * 12 * 0.8) : plan.price;
    if (plan.plan_id.toLowerCase() === 'free') {
      router.push(user ? '/dashboard' : '/signup');
    } else {
      router.push(user ? `/checkout?plan=${plan.plan_id}&cycle=${billingCycle}&price=${finalPrice}` : '/signup');
    }
  };

  if (loading) {
    return (
      <section id="pricing" className="py-24 min-h-[600px] flex items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="text-primary" size={48} />
        </motion.div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-[#050505]">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Online</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-heading mb-6 tracking-tight text-white uppercase italic leading-[1.1]">
            Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary inline-block px-1">Plans.</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-12 font-medium italic opacity-70">
            Choose the perfect engine for your creative workflow.
          </p>
          {/* Redesigned Billing Toggle - Zero Overlap */}
          <div className="p-1 px-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[1.25rem] inline-flex items-center relative overflow-hidden group">
            <div className="relative flex items-center z-10">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-20 w-32 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${billingCycle === 'monthly' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-20 w-44 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              >
                Yearly
                <span className="bg-primary px-2 py-0.5 rounded-full text-[8px] font-black text-white shrink-0 shadow-glow-primary">20% OFF</span>
              </button>
            </div>
            {/* Smooth Indicator */}
            <motion.div
              className="absolute inset-y-1 bg-white/[0.08] backdrop-blur-2xl rounded-xl border border-white/10 shadow-xl"
              animate={{
                left: billingCycle === 'monthly' ? '4px' : '132px',
                width: billingCycle === 'monthly' ? '128px' : '176px',
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        >
          {plans.map((plan, index) => {
            const isPopular = plan.plan_id.toLowerCase() === 'pro' || (plans.length > 1 && index === 1);
            const isFree = plan.plan_id.toLowerCase() === 'free';
            const buttonText = isFree ? 'Engine Start' : 'Sync Tier';

            const monthlyPrice = plan.price;
            const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8);
            const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

            return (
              <motion.div
                key={plan.plan_id}
                variants={cardVariants}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className={`p-10 relative flex flex-col transition-all duration-500 rounded-[3rem] group ${isPopular
                    ? 'bg-[#120a1f] border border-primary/40 ring-1 ring-primary/20 shadow-[0_30px_100px_-20px_rgba(138,43,226,0.25)]'
                    : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 shadow-2xl'
                  }`}
              >
                {/* Visual Depth Background for Popular Plan - Rounded separately to avoid clipping Badge */}
                {isPopular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none opacity-60 rounded-[3rem]" />
                )}

                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-main px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl z-20 border border-white/20 ring-[8px] ring-[#120a1f] whitespace-nowrap">
                    <Star size={12} fill="currentColor" className="animate-pulse" /> Most Populer
                  </div>
                )}

                <div className="relative z-10 mb-8">
                  <h3 className="text-4xl font-black font-heading mb-4 italic tracking-tighter flex items-center justify-between uppercase text-white">
                    {plan.name}
                    {isPopular && <Zap size={24} className="text-primary animate-pulse" />}
                  </h3>
                  <p className="text-text-muted text-[10px] font-black leading-relaxed min-h-[44px] uppercase tracking-[0.25em] opacity-50 italic">
                    {(plan as any).subtitle || 'Universal AI Interface Model.'}
                  </p>
                </div>

                <div className="relative z-10 mb-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter text-white font-heading italic">
                      {plan.currency_symbol || '₹'}{currentPrice}
                    </span>
                    <span className="text-text-muted text-[10px] font-black uppercase tracking-widest opacity-30">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && !isFree && (
                    <motion.div
                      className="mt-4 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg inline-block shadow-glow-primary/20"
                    >
                      <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                        ~ {plan.currency_symbol || '₹'}{Math.floor(yearlyPrice / 12)} / Month Average
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="relative z-10 flex-1 space-y-6 mb-12">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-30">Neural Specs:</p>
                  <ul className="space-y-4">
                    {((plan as any).features || ['Base Logic Access', 'Neural Response Flow', 'Priority Sequence', 'Encrypted Payload']).map((feature: string, fIndex: number) => (
                      <li key={fIndex} className="flex items-center gap-4 text-xs font-bold group/item">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isPopular ? 'bg-primary shadow-[0_0_12px_rgba(138,43,226,1)]' : 'bg-white/20 shadow-none'}`} />
                        <span className="text-white/60 tracking-wider group-hover/item:text-white group-hover/item:translate-x-1 transition-all duration-300 italic">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanClick(plan)}
                  className={`relative overflow-hidden group/btn w-full py-5 rounded-2xl font-black uppercase tracking-[0.35em] text-[10px] transition-all z-10 ${isPopular
                      ? 'bg-gradient-main text-white shadow-glow-primary hover:scale-[1.03] active:scale-95'
                      : 'bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.08] hover:border-white/20 active:scale-95'
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {buttonText}
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                  </span>
                  {/* High-speed Shine Effect */}
                  <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-[45deg] -translate-x-[250%] group-hover/btn:translate-x-[250%] transition-transform duration-700 ease-out" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
