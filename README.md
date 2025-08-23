# Next.js Portfolio with Supabase

A modern portfolio built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## Features

- 🎨 Beautiful bento grid layout
- ✨ Smooth animations with Framer Motion
- 🗄️ Supabase integration ready
- 📱 Fully responsive design
- 🚀 Built with Next.js 14 and TypeScript

## Getting Started

1. Copy `.env.example` to `.env.local` and add your Supabase credentials
2. Install dependencies: `bun install`
3. Run development server: `bun dev`

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the dashboard
3. Add them to your `.env.local` file

## Deployment

Deploy easily to Vercel:

```bash
bunx vercel --prod
```
