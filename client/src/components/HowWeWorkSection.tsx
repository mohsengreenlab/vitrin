import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Pencil, Code, Rocket, Headphones, ArrowRight } from 'lucide-react';
import workflowImage from '@assets/generated_images/Work_process_flow_imagery_4187b386.png';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'We analyze your needs and identify opportunities',
  },
  {
    icon: Pencil,
    title: 'Design',
    description: 'Crafting the perfect solution architecture',
  },
  {
    icon: Code,
    title: 'Build',
    description: 'Expert development with best practices',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Seamless deployment to production',
  },
  {
    icon: Headphones,
    title: 'Support',
    description: 'Ongoing maintenance and evolution',
  },
];

export default function HowWeWorkSection() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false, false, false]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 120);
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
    <section id="how-we-work" ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How We Work</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A proven process that delivers results. From discovery to ongoing support.
          </p>
        </div>

        <div className="mb-16">
          <img
            src={workflowImage}
            alt="Work process flow"
            className="w-full h-64 md:h-80 object-cover rounded-2xl"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card
                  className={`p-6 text-center border-2 border-primary/20 hover:shadow-lg transition-all duration-300 ${
                    visibleSteps[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  data-testid={`card-step-${index}`}
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary text-white flex items-center justify-center mb-4 font-bold">
                    {index + 1}
                  </div>
                  <Icon className="w-8 h-8 mx-auto text-primary mb-3" />
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-primary/30 w-8 h-8" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
