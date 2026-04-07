import Pricing from '@/components/layout/Pricing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';
import CTA from '@/components/layout/CTA';

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-24">
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
