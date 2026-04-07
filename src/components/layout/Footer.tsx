'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wand2, Youtube, Twitter, Instagram, Github, Linkedin, ArrowRight, Mail, Zap } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features & Tools', href: '/#tools' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Showcase', href: '/#showcase' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Changelog', href: '#' },
  ],
  Tools: [
    { label: 'AI Caption Generator', href: '/dashboard' },
    { label: 'Thumbnail Lab', href: '/dashboard' },
    { label: 'Video Generator', href: '/dashboard' },
    { label: 'SEO Tools', href: '/dashboard' },
    { label: 'Project Library', href: '/dashboard' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
};

const socials = [
  { icon: Youtube, label: 'YouTube', href: '#', color: '#FF0000' },
  { icon: Twitter, label: 'Twitter / X', href: '#', color: '#1DA1F2' },
  { icon: Instagram, label: 'Instagram', href: '#', color: '#E1306C' },
  { icon: Github, label: 'GitHub', href: '#', color: '#fff' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', color: '#0A66C2' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative mt-16 bg-[#0B0B0F] border-t border-white/10 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent before:pointer-events-none">
      <div className="relative z-10">
        {/* Newsletter Banner */}
        <div className="bg-primary/5 backdrop-blur-md border-b border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-secondary font-semibold text-xs tracking-widest uppercase">
                <Zap size={18} /> News & Updates
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">
                Stay ahead of the curve
              </h3>
              <p className="text-text-muted text-sm max-w-sm">
                Get the latest AI tools, tutorials & creator tips — no spam.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex-1 w-full max-w-md flex gap-3">
              {subscribed ? (
                <div className="bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-3 text-secondary font-bold flex items-center gap-2 w-full animate-bounce">
                  <Mail size={18} /> You&apos;re subscribed! 🎉
                </div>
              ) : (
                <>
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary whitespace-nowrap">
                    Subscribe <ArrowRight size={16} />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold font-heading mb-6 group">
                <Wand2 className="text-primary group-hover:rotate-12 transition-transform" />
                Creator<span className="text-gradient">AI</span>
              </Link>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                The all-in-one AI-powered platform for creators. Generate, optimize, and grow faster.
              </p>
              <div className="flex gap-2 flex-wrap">
                {socials.map(({ icon: Icon, label, href, color }) => (
                  <a 
                    key={label} href={href} aria-label={label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all transform hover:-translate-y-1 hover:border-primary shadow-lg"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-text-muted mb-6">
                  {group}
                </h4>
                <ul className="space-y-4">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link 
                        href={href}
                        className="text-text-muted hover:text-white transition-colors text-sm"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-muted">
            <p>© {new Date().getFullYear()} <span className="text-white font-bold">CreatorAI</span>. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
