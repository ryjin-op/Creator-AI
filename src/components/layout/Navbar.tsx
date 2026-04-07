'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wand2, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const navLinks = [
    { label: 'Features & Tools', href: '/#tools' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Showcase', href: '/#showcase' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];


  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 px-6 bg-[#0B0B0F]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
          : 'py-5 px-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div variants={itemVariants} className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); closeMenu(); }} className="flex items-center gap-2 text-2xl font-bold font-heading">
            <Wand2 className="text-primary" />
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Creator<span className="text-gradient">AI</span>
            </motion.span>
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>

        <div className={`
          fixed md:static top-[70px] left-0 w-full md:w-auto p-6 md:p-0
          bg-[#13131A] md:bg-transparent border-b border-white/5 md:border-none
          flex-col md:flex-row items-center gap-8 md:flex
          transition-all duration-300 ease-in-out
          ${isOpen ? 'flex opacity-100 translate-y-0' : 'hidden md:flex opacity-0 md:opacity-100 -translate-y-4 md:translate-y-0'}
        `}>
          <nav className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <motion.div key={link.label} variants={itemVariants}>
                <Link 
                  href={link.href} 
                  onClick={closeMenu}
                  className="text-text-muted hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-6 md:mt-0">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="btn btn-primary w-full md:w-auto text-sm"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  title={displayName}
                  className="hidden md:flex w-10 h-10 rounded-full bg-gradient-main border-2 border-primary/50 items-center justify-center font-bold shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  {initials}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="btn btn-outline w-full md:w-auto text-sm">Login</Link>
                <Link href="/signup" onClick={closeMenu} className="btn btn-primary w-full md:w-auto text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
