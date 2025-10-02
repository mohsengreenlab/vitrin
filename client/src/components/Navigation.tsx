import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-xl md:text-2xl font-bold text-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md"
            data-testid="link-logo"
          >
            Partner Systems
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('why-modular')}
              className="text-sm hover:text-primary transition-colors"
              data-testid="link-why-modular"
            >
              Why Modular
            </button>
            <button
              onClick={() => scrollToSection('offerings')}
              className="text-sm hover:text-primary transition-colors"
              data-testid="link-offerings"
            >
              Offerings
            </button>
            <button
              onClick={() => scrollToSection('how-we-work')}
              className="text-sm hover:text-primary transition-colors"
              data-testid="link-how-we-work"
            >
              How We Work
            </button>
            <button
              onClick={() => scrollToSection('tech-stack')}
              className="text-sm hover:text-primary transition-colors"
              data-testid="link-tech-stack"
            >
              Tech Stack
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="rounded-full"
              data-testid="button-get-quote-nav"
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
