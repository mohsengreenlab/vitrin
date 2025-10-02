import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Puzzle, Zap, DollarSign, Rocket } from 'lucide-react';
import modularImage from '@assets/generated_images/Modular_solutions_concept_675dcd51.png';

const benefits = [
  {
    icon: Puzzle,
    title: 'Custom-Fit Solutions',
    description: 'Build exactly what your business needs. No unnecessary features, just perfect alignment with your goals.',
  },
  {
    icon: Zap,
    title: 'Faster Delivery',
    description: 'Modular approach means quicker deployment. Get your solutions up and running in record time.',
  },
  {
    icon: DollarSign,
    title: 'Budget Control',
    description: 'Pay-as-you-go pricing with no lock-ins. Scale up or down as your needs change.',
  },
  {
    icon: Rocket,
    title: 'Future-Ready',
    description: 'Easily add new features and capabilities as your business evolves and grows.',
  },
];

export default function WhyModularSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            benefits.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-modular" ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Why Modular?</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexibility meets precision. Our modular approach delivers tailored solutions that grow with your business.
          </p>
        </div>

        <div className="mb-16">
          <img
            src={modularImage}
            alt="Modular solutions concept"
            className="w-full h-64 md:h-96 object-cover rounded-2xl"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className={`p-6 md:p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                  visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                data-testid={`card-benefit-${index}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
