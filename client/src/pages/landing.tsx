import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import WhyModularSection from '@/components/WhyModularSection';
import OfferingsSection from '@/components/OfferingsSection';
import HowWeWorkSection from '@/components/HowWeWorkSection';
import TechStackSection from '@/components/TechStackSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <WhyModularSection />
        <OfferingsSection />
        <HowWeWorkSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
