import { Button } from '@/components/ui/button';
import heroImage from '@assets/generated_images/Hero_tech_office_imagery_ada79e19.png';

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern technology workspace"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
          Pay only for what matters to you!
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
          Modular, bespoke IT solutions tailored to your business needs. Build exactly what you want, when you want it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-semibold"
            onClick={() => scrollToSection('contact')}
            data-testid="button-get-quote-hero"
          >
            Get a Quote
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
            onClick={() => scrollToSection('offerings')}
            data-testid="button-see-work"
          >
            See Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}
