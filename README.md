Here's an updated **README.md** for your project:

```markdown
# Chris Lane Jones Portfolio

Modern portfolio website built with Next.js 14, React, TypeScript, and Tailwind CSS. Features a bento grid layout, dark mode, Framer Motion animations, and an admin dashboard for content management.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Convex (real-time backend)
- **Authentication:** Clerk
- **UI Components:** Radix UI, shadcn/ui
- **Icons:** Lucide React, React Icons, Simple Icons
- **Package Manager:** Bun

## ✨ Features

- 🎨 Modern bento grid homepage layout
- 🌙 Dark mode with system preference detection
- 🎭 Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🔐 Admin dashboard with Clerk authentication
- 📝 SEO manager for metadata optimization
- 🎵 Interactive music player
- 🖼️ Photo gallery with Polaroid-style drawer
- 📊 Project showcase with carousel
- 🎤 Conference attendance tracker
- 🔗 Curated resource links (browser tabs)

## 🏗️ Project Structure
```

.
├── convex/ # Convex backend functions
│ ├── schema.ts # Database schema
│ └── seo.ts # SEO metadata functions
├── middleware.ts # Clerk authentication middleware
├── public/ # Static assets
│ ├── client-icons/
│ ├── conferences/
│ ├── gallery/
│ ├── music/
│ ├── projects/
│ └── fonts/
├── src/
│ ├── app/ # Next.js app directory
│ │ ├── about/
│ │ ├── admin/ # Admin dashboard
│ │ ├── browser-tabs/
│ │ ├── career/
│ │ ├── conferences/
│ │ ├── link-page/
│ │ ├── logo-page/
│ │ ├── projects/
│ │ ├── sign-in/ # Clerk sign-in page
│ │ └── site-history/
│ ├── components/
│ │ ├── layout/ # Header, Footer
│ │ ├── main/ # Homepage components
│ │ ├── page/ # Reusable page components
│ │ └── ui/ # shadcn/ui components
│ ├── data/
│ │ └── conferences.ts # Conference data
│ ├── lib/
│ │ └── utils.ts # Utility functions
│ └── providers/
│ └── ConvexClientProvider.tsx
└── package.json

````

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Clerk account
- Convex account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chrislanejones/your-repo.git
cd your-repo
````

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Initialize Convex:

```bash
npx convex dev
```

5. Seed the database:

```bash
npx convex run seo:seedSEOData
```

6. Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin` to manage:

- **SEO Metadata:** Edit page titles and descriptions with character count validation
- **Media Manager:** (Coming soon)
- **Settings:** (Coming soon)

### Admin Features:

- Real-time character counters for SEO optimization
- Google search preview
- Page search and filtering
- Add new pages
- Automatic save with success/error feedback

## 📦 Key Dependencies

```json
{
  "next": "14.0.4",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.17",
  "framer-motion": "^10.16.16",
  "convex": "latest",
  "@clerk/nextjs": "latest",
  "@radix-ui/react-*": "latest",
  "lucide-react": "^0.541.0"
}
```

## 🎨 Design System

### Colors

```css
/* Light Mode */
--color-base: #f9fafb --color-panel: #ffffff --color-ink: #111827
  --color-accent: #22c55e /* Dark Mode */ --color-base: #0b0d10
  --color-panel: #111418 --color-ink: #f3f4f6 --color-accent: #4ade80;
```

### Typography

- **Font:** TT Interphases Pro
- **Weights:** Regular (400), Bold (700), Black (900)

## 📄 Pages

- `/` - Homepage with bento grid layout
- `/about` - Personal journey and background
- `/projects` - Portfolio of web projects
- `/career` - Professional timeline and experience
- `/conferences` - Tech conferences attended
- `/browser-tabs` - Curated developer resources
- `/link-page` - Social media and contact links
- `/logo-page` - Brand identity and logo variations
- `/site-history` - Portfolio evolution over 18 years
- `/admin` - Content management dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```bash
NEXT_PUBLIC_CONVEX_URL=your_production_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_live_key
CLERK_SECRET_KEY=your_clerk_live_secret
```

## 📝 SEO Optimization

All pages include:

- Optimized meta titles (50-60 characters)
- Meta descriptions (150-160 characters)
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap generation

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome! Feel free to open an issue.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Chris Lane Jones**

- Website: [chrislanejones.com](https://chrislanejones.com)
- GitHub: [@chrislanejones](https://github.com/chrislanejones)
- LinkedIn: [/in/chrislanejones](https://linkedin.com/in/chrislanejones)
- Twitter: [@cljwebdev](https://twitter.com/cljwebdev)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Convex](https://convex.dev/) - Backend platform
- [Clerk](https://clerk.com/) - Authentication
- [Vercel](https://vercel.com/) - Hosting platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

Built with ❤️ and ☕ in Virginia

```

This updated README:

✅ **Removed all Supabase references**
✅ **Added Convex and Clerk setup**
✅ **Includes admin dashboard documentation**
✅ **Shows complete project structure**
✅ **Has deployment instructions**
✅ **Documents SEO features**
✅ **Includes design system details**
✅ **Lists all pages and features**

Ready to commit! 🚀
```
