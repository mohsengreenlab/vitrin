# Partner Systems Website - Design Guidelines

## Design Approach: Reference-Based (Enterprise SaaS)
Drawing inspiration from **Stripe** (clean, confident) and **Linear** (modern typography, subtle animations) with enterprise polish. This approach suits the modular IT services offering with its emphasis on clarity, professionalism, and trust-building.

## Core Design Principles
- **Enterprise Confidence**: Clean, spacious layouts that communicate reliability
- **Modular Clarity**: Each section clearly delineated with purpose
- **Subtle Sophistication**: Restrained animations and gradients that enhance, not distract
- **Premium Tech-Forward**: Modern aesthetic that matches high-value IT services

## Color Palette

**Light Mode (Primary)**
- Background: 0 0% 98% (off-white for reduced eye strain)
- Surface: 0 0% 100% (pure white cards)
- Text Primary: 220 20% 15% (deep blue-gray)
- Text Secondary: 220 10% 45% (muted blue-gray)
- Accent Primary: 215 85% 55% (confident blue - CTAs, links)
- Accent Hover: 215 85% 48% (deeper blue)
- Border: 220 15% 88% (subtle separation)
- Gradient Start: 215 80% 92% (light blue)
- Gradient End: 265 75% 94% (light purple tint)

**Semantic Colors**
- Success: 142 76% 40% (form validation)
- Error: 0 84% 55% (validation errors)

## Typography

**Font Stack**
- Primary: 'Inter' (body text, UI elements) - clean, professional
- Headings: 'Cal Sans' or 'Satoshi' (hero, section titles) - modern, impactful
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Scale & Usage**
- Hero Headline: text-6xl md:text-7xl lg:text-8xl, font-bold, tracking-tight
- Section Headers: text-4xl md:text-5xl, font-bold, tracking-tight
- Card Titles: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, leading-relaxed
- Subtext: text-sm md:text-base, text-secondary

## Layout System

**Spacing Units**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section Padding: py-16 md:py-24 lg:py-32
- Card Padding: p-6 md:p-8
- Element Spacing: gap-4, gap-6, gap-8, gap-12
- Container: max-w-7xl mx-auto px-6 md:px-8

**Grid Structure**
- Offerings Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Benefit Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Process Steps: grid-cols-1 md:grid-cols-5 (horizontal flow)
- Tech Logos: grid-cols-3 md:grid-cols-4 lg:grid-cols-6

## Component Library

**Navigation**
- Sticky header: bg-white/80 backdrop-blur-lg with shadow-sm on scroll
- Height: h-16 md:h-20
- Logo: font-bold text-xl md:text-2xl
- Nav links: text-sm md:text-base with hover:text-accent transition
- CTA button in nav: rounded-full px-6 py-2.5

**Hero Section**
- Full-width AI-generated tech imagery (1920x1080 recommended)
- Overlay: bg-gradient-to-r from-black/60 to-black/40
- Content: centered, max-w-4xl, text-white
- Primary CTA: bg-accent text-white px-8 py-4 rounded-full text-lg font-semibold
- Secondary CTA: variant="outline" with backdrop-blur-md bg-white/10 border-white/30

**Benefit Cards (Why Modular)**
- Background: bg-white with subtle shadow-sm hover:shadow-lg transition
- Border: rounded-2xl border border-border
- Icon container: w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5
- Hover lift: hover:-translate-y-1 transition-transform

**Offering Pillar Cards**
- Larger cards: rounded-3xl bg-white p-8 shadow-md
- Header with gradient background: rounded-t-3xl p-6 bg-gradient-to-br
- Service lists: space-y-3 text-sm with checkmark icons
- Dividers: border-b border-border/50 between items

**Process Flow (How We Work)**
- Horizontal timeline on desktop, vertical on mobile
- Step containers: rounded-2xl bg-white p-6 border-2 border-accent/20
- Connector arrows: text-accent/30 between steps
- Step numbers: w-10 h-10 rounded-full bg-accent text-white

**Tech Stack Section**
- Logo containers: grayscale hover:grayscale-0 transition
- Grid layout with consistent sizing: h-16 object-contain
- Subtle borders: rounded-xl border border-border p-4

**Contact Form**
- Contained layout: max-w-2xl mx-auto
- Input styling: rounded-lg border-2 border-border focus:border-accent p-3
- Textarea: min-h-32
- Submit button: w-full bg-accent text-white rounded-lg py-4 font-semibold
- Success message: rounded-lg bg-success/10 border border-success/20 p-4

**Footer**
- Background: bg-gray-50 border-t border-border
- Multi-column: grid-cols-1 md:grid-cols-4 gap-8
- Social icons: w-10 h-10 rounded-full hover:bg-accent/10 transition

## Animations (Minimal & Purposeful)

**Scroll Animations**
- Fade-in: opacity-0 to opacity-100 with translate-y-8 to translate-y-0
- Duration: 600ms with ease-out
- Stagger: 100ms delay between cards in same section

**Micro-interactions**
- Buttons: hover:scale-105 active:scale-95 transition-transform duration-200
- Cards: hover:shadow-xl hover:-translate-y-1 duration-300
- Links: underline decoration-2 underline-offset-4 decoration-accent/0 hover:decoration-accent/100

**Smooth Scroll**: scroll-behavior: smooth for anchor navigation

## Images

**Hero Image**
- Full-width, high-quality AI-generated image (1920x1080)
- Theme: Modern office with tech elements, servers, or abstract data visualization
- Overlay gradient for text readability
- Position: object-cover with object-center

**Section Header Images**
- Offerings: Abstract modular blocks or puzzle pieces (1200x400)
- How We Work: Team collaboration or workflow visualization
- Tech Stack: Server room or code on screens
- All images: rounded-2xl with lazy loading, aspect-video

## Accessibility
- WCAG AA compliant contrast ratios (4.5:1 minimum)
- Focus visible states: ring-2 ring-accent ring-offset-2
- Semantic HTML structure with proper heading hierarchy
- Alt text for all images describing business context
- Form labels properly associated with inputs