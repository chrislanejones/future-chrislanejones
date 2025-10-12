# Chris Lane Jones Portfolio

Modern portfolio website built with Next.js 14, React, TypeScript, and Tailwind CSS. Features a bento grid layout, dark mode, Framer Motion animations, and an admin dashboard for content management.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Convex (real-time backend)
- **Authentication:** Clerk
- **Analytics:** PostHog (product analytics & session recording)
- **Email:** Resend (transactional emails)
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
- 📊 PostHog analytics with session recording
- 📧 Contact form with email notifications
- 🎵 Interactive music player
- 🖼️ Photo gallery with Polaroid-style drawer
- 📊 Project showcase with carousel
- 🎤 Conference attendance tracker
- 🔗 Curated resource links (browser tabs)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Clerk account
- Convex account
- PostHog account (for analytics)
- Resend account (for email)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/chrislanejones/your-repo.git
cd your-repo
```

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

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend Email
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
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

## 📊 Analytics & Monitoring

### PostHog Integration

The site uses PostHog for:

- **Product Analytics:** Track page views, button clicks, and user behavior
- **Session Recording:** Visual playback of user sessions
- **Feature Flags:** A/B testing and feature rollouts
- **User Identification:** Track authenticated users via Clerk integration

#### Testing PostHog:

1. Open browser console and type `posthog` to verify initialization
2. Check Network tab for requests to `app.posthog.com`
3. View events in PostHog dashboard within 1-2 minutes
4. Use the debug component (in development mode) to test events

#### Custom Event Tracking:

```typescript
import { usePostHog } from "posthog-js/react";

const posthog = usePostHog();
posthog.capture("button_clicked", {
  button_name: "Download Resume",
  location: "career_page",
});
```

## 📧 Contact Form

The contact form uses Resend for email delivery with:

- Server-side validation
- Rate limiting
- Email templates with React Email
- Success/error notifications
- Form state management

### Setting up Resend:

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their sandbox for testing)
3. Get your API key from the dashboard
4. Add `RESEND_API_KEY` to `.env.local`

### Contact Form Features:

- Client-side validation
- Server action for secure submission
- Automatic email notifications
- Spam protection with rate limiting
- Responsive design with accessible forms

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
  "lucide-react": "^0.541.0",
  "posthog-js": "latest",
  "resend": "latest"
}
```

## 🎨 Design System

### Colors

```css
/* Light Mode */
--color-base: #f9fafb;
--color-panel: #ffffff;
--color-ink: #111827;
--color-accent: #22c55e;

/* Dark Mode */
--color-base: #0b0d10;
--color-panel: #111418;
--color-ink: #f3f4f6;
--color-accent: #4ade80;
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
- `/contact` - Contact form with email integration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_production_convex_url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_live_key
CLERK_SECRET_KEY=your_clerk_live_secret

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_live_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend
RESEND_API_KEY=your_resend_live_key
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com
```

## 📝 SEO Optimization

All pages include:

- Optimized meta titles (50-60 characters)
- Meta descriptions (150-160 characters)
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap generation

## 🔒 Privacy & Security

- PostHog data is anonymized by default
- Contact form includes rate limiting
- Admin routes protected by Clerk authentication
- Environment variables for sensitive data
- CORS policies configured
- No localStorage usage in artifacts (Claude.ai compatible)

## 🧪 Testing

### PostHog Testing:

```bash
# In browser console
posthog.capture('test_event', { test: true })
```

### Email Testing:

Use Resend sandbox domain for development testing before verifying your domain.

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
- [PostHog](https://posthog.com/) - Product analytics
- [Resend](https://resend.com/) - Email delivery
- [Vercel](https://vercel.com/) - Hosting platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

Built with ❤️ and ☕ from a Florida boy living in Virginia
