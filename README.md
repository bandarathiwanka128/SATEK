# SATEK - Smart Accessories Tools Electronics Knowledge

A full-stack tech affiliate web application built with Next.js 14, Supabase, and TailwindCSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion
- **Deployment**: Vercel-ready with GitHub Actions CI/CD

## Features

- Product catalog with categories (Gadgets & Software)
- Affiliate link management with animated CTAs
- Blog system with tagging and search
- Deals section with countdown timers
- Admin panel with full CRUD operations
- User authentication (registration, login, roles)
- Contact form with validation
- Responsive design with dark mode
- SEO optimized with dynamic metadata and sitemap
- Scroll animations and page transitions

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd satek
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the database migration:
   - Go to your Supabase dashboard > SQL Editor
   - Run the contents of `supabase/migrations/001_initial_schema.sql`

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Admin Access

After running the migration, create a user via the app's registration page, then update their role to 'admin' in the Supabase dashboard:

```sql
UPDATE public.profiles SET role = 'admin' WHERE user_id = 'your-user-uuid';
```

## Project Structure

```
src/
  app/
    (auth)/          # Login & Register pages
    (public)/        # Public-facing pages
    admin/           # Admin panel (protected)
    api/             # API routes
  components/
    ui/              # shadcn/ui components
    layout/          # Navbar, Footer, Mobile Menu
    home/            # Homepage sections
    products/        # Product components
    blog/            # Blog components
    deals/           # Deal components
    contact/         # Contact form
    admin/           # Admin panel components
    shared/          # Shared animated components
  hooks/             # Custom React hooks
  lib/               # Utilities and Supabase clients
  types/             # TypeScript type definitions
supabase/
  migrations/        # Database schema and seed data
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The app is configured for deployment on Vercel with GitHub Actions CI/CD:

- **CI**: Runs lint, type-check, and build on pull requests
- **Deploy**: Auto-deploys to Vercel on push to main

Set the following secrets in your GitHub repository:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## License

Private project. All rights reserved.
