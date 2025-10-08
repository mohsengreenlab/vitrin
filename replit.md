# Partner Systems - Modular IT Solutions Website

## Overview

Partner Systems is a single-page marketing website for an IT services company offering modular, pay-as-you-go solutions. The site showcases four main service pillars: Business & Productivity Tools, Data & Storage Solutions, Communication & Collaboration, and Consumer-Facing Applications. Built with React, TypeScript, and Express, it features a modern design with scroll animations, a contact form with database persistence, and a fully responsive layout optimized for enterprise clients.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and API calls

**UI Component System**
- shadcn/ui component library (New York style) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Design system inspired by Stripe and Linear with enterprise polish

**State & Form Management**
- React Hook Form with Zod resolver for type-safe form validation
- TanStack Query for data fetching, caching, and mutations
- Local component state for UI interactions (scroll animations, visibility toggles)

**Design Approach**
- Single-page application with smooth scroll navigation between sections
- Intersection Observer API for scroll-triggered fade-in animations
- Custom CSS variables for light/dark theming (currently light mode focused)
- Mobile-first responsive design with breakpoints at 768px and 1024px

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- RESTful API design pattern
- Middleware for JSON parsing, URL encoding, and request/response logging
- Error handling middleware for consistent error responses

**API Endpoints**
- `POST /api/contacts` - Submit contact form (with Zod validation)
- `GET /api/contacts` - Retrieve all contacts (admin functionality)

**Validation Layer**
- Zod schemas for runtime type checking and validation
- Shared schema definitions between client and server
- Detailed error messages via zod-validation-error library

### Data Storage Solutions

**Database**
- SingleStore (MySQL-compatible) as the primary database
- Drizzle ORM for type-safe database queries and schema management
- MySQL2 connection pool with SSL support (10 connection limit)
- Migration system using SQL files executed on application startup

**Schema Design**
- `contacts` table: id (UUID), name, email, message, createdAt timestamp
- UUIDs generated server-side using Node.js crypto module
- Timestamps automatically set with database defaults

**Storage Pattern**
- Repository pattern implementation via `SingleStoreStorage` class
- Interface-based storage abstraction (`IStorage`) for potential future database swaps
- Connection pooling for efficient database resource management

### External Dependencies

**UI Component Libraries**
- @radix-ui/* - Accessible, unstyled UI primitives (accordion, dialog, dropdown, toast, etc.)
- lucide-react - Icon library
- react-icons - Additional icons (used for tech stack logos: React, Node.js, Python, etc.)
- embla-carousel-react - Carousel/slider functionality

**Form & Validation**
- react-hook-form - Form state management
- @hookform/resolvers - Zod integration
- zod - Schema validation
- drizzle-zod - Database schema to Zod schema conversion

**Database & ORM**
- drizzle-orm - Type-safe ORM
- drizzle-kit - Migration tooling
- mysql2 - MySQL client with promise support

**Styling & Utilities**
- tailwindcss - Utility-first CSS framework
- tailwind-merge & clsx - Class name merging utilities
- class-variance-authority - Component variant management
- autoprefixer - CSS vendor prefixing

**Development Tools**
- vite - Build tool and dev server
- tsx - TypeScript execution for Node.js
- esbuild - JavaScript bundler for production server build
- @replit/vite-plugin-* - Replit-specific development plugins (error overlay, cartographer, dev banner)

**Fonts**
- Google Fonts: Inter (primary font for body text and UI)

**Hosting Environment**
- Replit deployment with environment variables for database credentials
- Static asset serving via Vite in production
- Development mode with HMR and hot module replacement

### Deployment Package

**VPS Deployment Structure** (Located in `deployment/` directory)
- Manual step-by-step deployment approach (not automated scripts)
- Complete isolation on Ubuntu VPS with dedicated user and port (3006)
- Designed for zero conflicts with existing applications

**Deployment Files**
- `docs/DEPLOYMENT_GUIDE.md` - Comprehensive 12-step manual deployment guide with test commands after each checkpoint
- `DEPLOYMENT_CHECKLIST.txt` - Step-by-step checklist for tracking progress
- `README.md` - Overview and quick reference
- `configs/` - PM2 process manager and Nginx configurations
- `scripts/` - Utility scripts (database health check, config update, rollback)

**Deployment Approach**
- User runs commands manually step-by-step on Ubuntu terminal
- Each step includes verification/test commands before proceeding
- No "black box" automated scripts - full visibility and control
- Critical checkpoints: database connection test, PM2 status, SSL certificate validation

**Architecture on VPS**
- Internet → Cloudflare (optional) → Nginx (port 443) → Node.js (port 3006) → SingleStore DB
- Dedicated system user: `partnersystems`
- Application directory: `/home/partnersystems/app`
- Process management: PM2 with auto-restart
- Reverse proxy: Nginx with Let's Encrypt SSL
- Domain: partnersystems.online