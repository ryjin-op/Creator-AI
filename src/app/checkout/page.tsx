'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, CreditCard, Sparkles, Loader2, CheckCircle2, ArrowLeft, Lock, Zap, Star, User, Mail, MapPin, Globe, CreditCard as CardIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const cycle = searchParams.get('cycle') || 'monthly';
  const customPrice = searchParams.get('price');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: ''
  });

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login?redirect=/checkout');
      return;
    }

    async function fetchPlan() {
      const { data } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('plan_id', planId || 'pro')
        .single();
      
      if (data) {
        if (customPrice) {
          data.price = parseInt(customPrice);
        }
        setPlan(data);
      } else {
        // Fallback for demo
        setPlan({
          name: 'Pro Creator',
          price: customPrice ? parseInt(customPrice) : 299,
          credits: 500,
          currency_symbol: '₹',
          features: ['AI Image Gen', 'Video Analysis', 'SEO Packages']
        });
      }
    }
    fetchPlan();
  }, [user, planId, router, loading, customPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    if (!formData.fullName || !formData.address || !formData.zipCode) {
      toast.error('Identity Protocol Incomplete: Please fill all billing fields');
      return;
    }

    setLoading(true);
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      // For demo: Grant credits and update plan
      const baseCredits = plan?.credits || 500;
      const totalCreditsToGrant = cycle === 'yearly' ? baseCredits * 12 : baseCredits;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: planId || 'pro',
          credits: (profile?.credits || 0) + totalCreditsToGrant,
          full_name: formData.fullName
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success('System Synchronization Complete: Plan Activated', { icon: '🛡️' });
    } catch (err: any) {
      toast.error('Payment Protocol Interrupted: ' + (err.message || 'Unknown Error'));
    } finally {
      setLoading(false);
    }
  };

  const subtotal = plan?.price || 0;
  const hsnTax = Math.floor(subtotal * 0.18);
  const total = subtotal + hsnTax;

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-10 py-20"
      >
        <div className="w-24 h-24 bg-gradient-main rounded-3xl flex items-center justify-center mx-auto shadow-glow-primary animate-bounce">
          <CheckCircle2 size={48} className="text-white" />
        </div>
        <div className="space-y-4">
          <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase font-heading">Protocol <span className="text-primary italic">Active.</span></h2>
          <p className="text-text-muted text-lg max-w-md mx-auto italic font-medium opacity-60">Your operational assets have been successfully provisioned. Welcome to the elite grid.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary px-12 py-5 text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-glow-primary transition-all hover:scale-105"
          >
            Enter Dashboard <Sparkles size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-10">
      {/* Left: Summary & Details (Cols 1-5) */}
      <div className="lg:col-span-5 space-y-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button onClick={() => router.back()} className="text-text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-8 group transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
          </button>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-heading mb-2">Finalize <span className="text-primary italic">Sync.</span></h1>
          <p className="text-text-muted text-sm font-medium italic opacity-50 mb-10">Authorizing secure node connection...</p>

          <div className="glass-panel p-8 bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-4xl relative overflow-hidden group hover:border-white/10 transition-all duration-500">
            {/* Ambient Background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none group-hover:bg-primary/15 transition-all duration-700"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">active tier</span>
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{plan?.name || 'Pro Creator'}</h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/50 uppercase tracking-widest">{cycle} billing cycle</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2 block">Network Fee</span>
                  <div className="text-4xl font-black text-white tracking-tighter italic font-heading whitespace-nowrap font-sans">{plan?.currency_symbol || '₹'}{plan?.price || 299}</div>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] block opacity-30">neural specs:</span>
                <div className="grid grid-cols-1 gap-3">
                  {(plan?.features || ['Priority Neural Access', '500 Energy Cells', 'Algorithm Bypass']).map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-[1.25rem] group/item transition-all hover:bg-white/[0.05]">
                      <CheckCircle2 size={16} className="text-primary shrink-0 transition-transform group-hover/item:scale-110" />
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic group-hover/item:text-white transition-colors">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-primary/5 border border-primary/20 rounded-[1.5rem] flex items-center gap-4 group/box shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover/box:scale-110 transition-transform border border-primary/20">
                  <Zap size={24} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Instant provision</p>
                  <p className="text-xs font-bold text-white/70 italic">Adds {cycle === 'yearly' ? (plan?.credits || 500) * 12 : (plan?.credits || 500)} energy cells immediately</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Detailed Professional Billing Form (Cols 6-12) */}
      <div className="lg:col-span-12 xl:col-span-7">
        <motion.form 
          onSubmit={handlePayment} 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-10 bg-[#0d0d0f] border-white/10 rounded-[3.5rem] shadow-3xl space-y-10"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-main flex items-center justify-center text-white shadow-glow-primary">
                <Lock size={26} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter font-heading">Secure <span className="text-secondary italic">Authorization</span></h3>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 opacity-50 italic">AES-256 Multi-layer Handshake Enforced</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 opacity-50">
              <ShieldCheck size={16} className="text-secondary" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">PCI Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identity Info */}
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-4">Command Identity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={10} /> Full Legal Name
                  </label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white italic outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail size={10} /> Sync Email
                  </label>
                  <input 
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white/30 italic outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="md:col-span-2 space-y-6 pt-4 border-t border-white/5">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-4">Billing Grid</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={10} /> Terminal Address
                  </label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street Address, Area"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white italic outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    City
                  </label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white italic outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    State / Province
                  </label>
                  <input 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white italic outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Globe size={10} /> Sector (Country)
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white italic outline-none focus:border-primary/50 transition-all appearance-none" 
                  >
                    <option value="India" className="bg-[#0d0d0f]">India</option>
                    <option value="USA" className="bg-[#0d0d0f]">United States</option>
                    <option value="UK" className="bg-[#0d0d0f]">United Kingdom</option>
                    <option value="Singapore" className="bg-[#0d0d0f]">Singapore</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                    Postal Key (Zip)
                  </label>
                  <input 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white italic outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="p-8 bg-black/40 border border-white/10 rounded-[2.5rem] space-y-4 shadow-inner">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic">
              <span>Node Extraction Fee</span>
              <span className="font-sans">{plan?.currency_symbol || '₹'}{subtotal}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic">
              <span>HSN Protocol Tax (18%)</span>
              <span className="font-sans">{plan?.currency_symbol || '₹'}{hsnTax}</span>
            </div>
            <div className="h-px bg-white/5 my-4"></div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-[0.4em] italic block">Total Deployment Cost</span>
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest italic opacity-50">Billed {cycle} thereafter</span>
              </div>
              <span className="text-4xl font-black text-secondary tracking-tighter italic font-heading drop-shadow-glow-secondary font-sans">{plan?.currency_symbol || '₹'}{total}</span>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-[#3399cc] to-[#1d4ed8] text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <><Loader2 size={24} className="animate-spin" /> Node Syncing...</>
              ) : (
                <>Authorize Payment with Razorpay <Zap size={20} className="group-hover:scale-125 transition-transform" /></>
              )}
            </button>

            <div className="flex flex-col items-center gap-4 opacity-40">
              <div className="flex items-center gap-6">
                <ShieldCheck size={20} className="text-secondary" />
                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] italic">Full PCI DSS Node Compatibility Verified</span>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white pt-32 pb-24 px-6 relative overflow-hidden font-sans">
      {/* Cinematic Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-primary/5 blur-[250px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-secondary/5 blur-[200px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Suspense fallback={
          <div className="min-h-[600px] flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={64} />
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse">Initializing Checkout Terminal</p>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
