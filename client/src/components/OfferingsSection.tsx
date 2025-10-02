import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import businessImage from '@assets/generated_images/Business_productivity_tools_imagery_e7d30c67.png';
import dataImage from '@assets/generated_images/Data_storage_solutions_imagery_0bdbbf87.png';
import communicationImage from '@assets/generated_images/Communication_collaboration_imagery_f128a9e9.png';
import consumerImage from '@assets/generated_images/Consumer_applications_imagery_361b4cfa.png';

const offerings = [
  {
    title: 'Business & Productivity Tools',
    subtitle: 'Tailored to your custom needs',
    image: businessImage,
    services: [
      'Custom CRM/ERP Systems – customer tracking, invoicing, sales pipelines.',
      'Custom Project & Task Management Tools – Kanban boards, to-do apps, resource planning.',
      'Custom Inventory & Supply Chain Management – stock levels, purchase orders, vendor portals.',
      'Knowledge Bases & Internal Wikis – documentation platforms with search & collaboration.',
    ],
  },
  {
    title: 'Data & Storage Solutions',
    subtitle: 'As much space as you feel comfortable with',
    image: dataImage,
    services: [
      'Database Management Interfaces – lightweight admin dashboards for PostgreSQL/MySQL.',
      'File Management & Sharing – cloud-like storage with user roles and permissions.',
      'Data Visualization Dashboards – charts, KPIs, and real-time reporting tools.',
      'Scheduling & Booking Systems – appointment booking, class scheduling, calendar sync.',
    ],
  },
  {
    title: 'Communication & Collaboration',
    subtitle: 'Tailored to your needs',
    image: communicationImage,
    services: [
      'Chat & Messaging Apps – team chat, customer support chatbots, community spaces.',
      'Collaboration Workspaces – shared whiteboards, document editing.',
    ],
  },
  {
    title: 'Consumer-Facing Applications',
    subtitle: 'To care about your unique customers',
    image: consumerImage,
    services: [
      'Winning websites and landing pages',
      'E-commerce Platforms – storefronts, shopping carts, order management.',
    ],
  },
];

export default function OfferingsSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            offerings.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="offerings" ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Offerings</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Four pillars of excellence. Choose what you need, when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offerings.map((offering, index) => (
            <Card
              key={index}
              className={`overflow-hidden hover:shadow-xl transition-all duration-500 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              data-testid={`card-offering-${index}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offering.image}
                  alt={offering.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{offering.title}</h3>
                  <p className="text-sm text-white/90">{offering.subtitle}</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <ul className="space-y-3">
                  {offering.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
