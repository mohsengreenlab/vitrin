import { useEffect, useRef, useState } from 'react';
import { SiReact, SiNodedotjs, SiPython, SiPostgresql, SiMysql, SiMongodb, SiAmazon, SiDocker, SiKubernetes, SiTypescript, SiVuedotjs, SiAngular } from 'react-icons/si';

const technologies = [
  { icon: SiReact, name: 'React' },
  { icon: SiNodedotjs, name: 'Node.js' },
  { icon: SiPython, name: 'Python' },
  { icon: SiPostgresql, name: 'PostgreSQL' },
  { icon: SiMysql, name: 'MySQL' },
  { icon: SiMongodb, name: 'MongoDB' },
  { icon: SiAmazon, name: 'AWS' },
  { icon: SiDocker, name: 'Docker' },
  { icon: SiKubernetes, name: 'Kubernetes' },
  { icon: SiTypescript, name: 'TypeScript' },
  { icon: SiVuedotjs, name: 'Vue.js' },
  { icon: SiAngular, name: 'Angular' },
];

export default function TechStackSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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
    <section id="tech-stack" ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Tech & Integrations</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We work with cutting-edge technologies to build robust, scalable solutions.
          </p>
        </div>

        <div
          className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-white hover:shadow-md transition-all duration-300 hover:scale-105 grayscale hover:grayscale-0"
                data-testid={`tech-${index}`}
              >
                <Icon className="w-12 h-12 md:w-16 md:h-16" />
                <span className="mt-3 text-xs md:text-sm font-medium text-center">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
