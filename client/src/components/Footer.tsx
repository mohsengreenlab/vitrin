import { Mail, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-muted/50 border-t border-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Partner Systems</h3>
            <p className="text-sm text-muted-foreground">
              Modular IT solutions tailored to your business needs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('why-modular')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-link-why-modular"
                >
                  Why Modular
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('offerings')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-link-offerings"
                >
                  Offerings
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-we-work')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-link-how-we-work"
                >
                  How We Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@partnersystems.com" className="hover:text-primary transition-colors">
                  info@partnersystems.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center hover-elevate active-elevate-2 border border-border"
                aria-label="LinkedIn"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center hover-elevate active-elevate-2 border border-border"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center hover-elevate active-elevate-2 border border-border"
                aria-label="GitHub"
                data-testid="link-github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Partner Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
