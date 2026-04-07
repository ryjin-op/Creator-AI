import Hero from '@/components/layout/Hero';
import Features from '@/components/layout/Features';
import HowItWorks from '@/components/layout/HowItWorks';
import Showcase from '@/components/layout/Showcase';
import Testimonials from '@/components/layout/Testimonials';
import Pricing from '@/components/layout/Pricing';
import FAQ from '@/components/layout/FAQ';
import CTA from '@/components/layout/CTA';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Showcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
