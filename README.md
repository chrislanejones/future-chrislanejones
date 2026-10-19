# Chris Lane Jones — Beach Portfolio

A coastal home for my work, writing, and life beyond the browser. Built with Next.js, React, and Convex, with 3D beach scenes in React Three Fiber.

After eight years in Virginia, we traded mountains for beaches and returned to Florida in 2026. This redesign brings that move into the site: a 3D model of the St. Augustine Beach coast, seashells, browser windows on sand, a sandcastle you can build, and a little radio for the coding soundtrack.

[Portfolio](https://www.chrislanejones.com) · [GitHub](https://github.com/chrislanejones) · [Local setup](#run-locally)

![Beach portfolio homepage in light mode, with a 3D model of the St. Augustine Beach coast and client logos.](docs/images/beach-home-light.webp)

<details>
<summary>View dark mode</summary>

![Beach portfolio homepage in dark mode.](docs/images/beach-home-dark.webp)

</details>

This repository is the live site. Vercel deploys [chrislanejones.com](https://www.chrislanejones.com) from `main`.

## Around the site

- **3D coast hero:** a model of St. Augustine Beach with houses, hotels, dunes, a pier, and moving surf. It loads in stages so it never slows the page (see [How the hero loads](#how-the-hero-loads)).
- **Selected work:** browser-style project previews on sand. Every card links to the project's own page.
- **Beyond the browser:** a short radio-style music player, rotating ramblings, and conference photos, side by side.
- **Latest writing:** the two newest posts as cards, the same card the blog uses.
- **Sandcastle builder:** a 9 by 7 beach you can reshape. Pile sand into dunes, dig moats that carve real trenches and fill with water, then build towers, bucket castles, and walls on top. A shovel does the digging. Supports mouse, touch, keyboard placement, undo, and clearing the sand.
- **Conference archive:** event and year pages, transparent WebP logos, photo galleries, and notes from the conference trail.
- **More pages:** career history, downloadable résumé, useful browser tabs, site history, contact, and React and WordPress maintenance services.
- **Light and dark themes:** responsive layouts, keyboard-accessible controls, and reduced-motion support. Beach animation pauses when its scene or browser tab is hidden.
- **Lighter on phones:** phones and Data Saver skip three.js on the home page. They get the hero still with a moving sea, and plain sand behind Beyond the browser.

## How the hero loads

| Stage | What shows | When |
| --- | --- | --- |
| 1 | A still of the 3D scene, light or dark | With the page |
| 2 | A small WebGL layer that moves only the sea, no three.js | Right after the page loads |
| 3 | The full 3D town, faded in over 1.2 seconds | After the load event and an idle moment |

The sea layer and the 3D share one ocean clock, so the waves don't jump when the town fades in. Add `?hero=lite` to the URL to hold the page at stage 2. The stills in [public/hero/](public/hero/) are screenshots of the 3D; recapture them when the scene's look or camera changes.

## Stack

| Layer | Tools |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS Modules, locally hosted fonts |
| Motion and 3D | Framer Motion, React Three Fiber, Three.js |
| Content and backend | Convex queries, mutations, storage metadata, and HTTP endpoints |
| Blog HTML | Marked for Markdown, sanitize-html for every post body ([ADR-008](docs/adr/008-sanitize-blog-html-with-sanitize-html.md)) |
| Tests | Vitest and convex-test |
| Authentication | Clerk, with an owner allowlist for admin access |
| Media uploads | UploadThing |
| Interface primitives | Radix UI, shadcn/ui, Vaul, Lucide |
| Analytics | PostHog and Google Analytics |
| Package management | pnpm |

Exact dependency versions live in [package.json](package.json) and [pnpm-lock.yaml](pnpm-lock.yaml).

## Run locally

Use Node.js **22 (22.13 or newer) or 24+**, pnpm, and your own Convex and Clerk projects. UploadThing supports admin media uploads; PostHog supports analytics.

### 1. Install dependencies

```bash
git clone https://github.com/chrislanejones/future-chrislanejones-beach.git
cd future-chrislanejones-beach
pnpm install --frozen-lockfile
```

### 2. Connect Convex

```bash
pnpm exec convex dev
```

Follow the CLI prompts to select or create a development project. It writes deployment configuration to `.env.local` and syncs the functions in `convex/`. Keep this process running while developing.

### 3. Configure the frontend

Add your own values to `.env.local`, preserving the deployment values written by Convex:

```dotenv
# Convex deployment and public endpoints
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment-name.convex.site

# Clerk application keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk user IDs allowed to upload media through the Next.js API
ADMIN_USER_IDS=user_your_clerk_user_id

# UploadThing v7 token for admin uploads
UPLOADTHING_TOKEN=your_uploadthing_token

# PostHog project key and ingestion host
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

`.env.local` is ignored by Git. The current app initializes Clerk, Convex, and PostHog in its root providers; configure those integrations or adjust the corresponding providers when adapting the site.

### 4. Configure backend authentication

In Clerk, create a JWT template named `convex` using the Convex template. Set these variables on your **Convex development deployment**, using the dashboard or CLI:

```bash
pnpm exec convex env set CLERK_JWT_ISSUER_DOMAIN https://your-clerk-frontend-api-domain
pnpm exec convex env set ADMIN_USER_IDS user_your_clerk_user_id
```

Use the Clerk issuer URL for the same application as your frontend keys. Set `ADMIN_USER_IDS` in both environments: Convex uses it for content administration, and Next.js uses it for upload authorization. Without an override, the code defaults to the original portfolio owner's allowlist.

See [convex/auth.config.ts](convex/auth.config.ts), [convex/authz.ts](convex/authz.ts), and the [upload endpoint](src/app/api/uploadthing/core.ts).

### 5. Start the website

In a second terminal:

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000). To use Webpack explicitly:

```bash
pnpm dev --webpack
```

Sign in at `/admin` with an allowed Clerk account. The Settings → Data Management panel provides seed controls for supported content sections. Content records live in the connected Convex deployment; cloning this repository does not copy the existing database.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the Next.js development server |
| `pnpm dev --webpack` | Run development with Webpack |
| `pnpm exec convex dev` | Sync and watch the development backend |
| `pnpm exec tsc --noEmit` | Check TypeScript |
| `pnpm lint` | Run ESLint on `src/` and `convex/` |
| `pnpm test` | Run the Vitest suites (backend rules, blog sanitizer, sandcastle model) |
| `pnpm exec next build --webpack` | Build the production frontend with Webpack |
| `pnpm start` | Serve an existing production build |

The production build needs valid environment variables and a reachable Convex deployment because several pages load content during rendering.

## Content and customization

Convex manages projects, blog posts, conferences, career entries, clients, links, gallery content, page headers, navigation, and SEO. The admin dashboard also includes contact messages, media management, and redirects.

Some homepage sections subscribe to live Convex queries and use local fallbacks. Conference and blog routes fetch data on the server and use revalidation, so edits to those pages may take a short time to appear.

| What to change | Where to start |
| --- | --- |
| Homepage structure and copy | [src/app/page.tsx](src/app/page.tsx) |
| Shared coastal colors and layouts | [src/components/coastal/coastal.module.css](src/components/coastal/coastal.module.css) |
| Hero loading, stills, and sea layer | [hero-photo.tsx](src/components/coastal/hero-photo.tsx), [hero-ocean-lite.tsx](src/components/coastal/hero-ocean-lite.tsx), [public/hero/](public/hero/) |
| The 3D coast model | [hero-coast-scene.tsx](src/components/coastal/hero-coast-scene.tsx) and the `hero-coast-model.ts` generators |
| Beach animation and visibility handling | [src/components/coastal/coast-floor.tsx](src/components/coastal/coast-floor.tsx) |
| Sandcastle rules, scene, and tool art | [sandcastle-model.ts](src/components/coastal/sandcastle-model.ts), [sandcastle-scene.tsx](src/components/coastal/sandcastle-scene.tsx), [sandcastle-tool-art.tsx](src/components/coastal/sandcastle-tool-art.tsx) |
| What blog HTML may contain | [src/lib/blog-content.ts](src/lib/blog-content.ts) |
| Project presentation and fallback content | [src/data/project-presentation.ts](src/data/project-presentation.ts), [src/data/projects-data.ts](src/data/projects-data.ts) |
| Conference photos and captions | [src/data/conference-photos.ts](src/data/conference-photos.ts) |
| Conference slider fallback entries | [src/data/conferences.ts](src/data/conferences.ts) |
| Logos, photography, and downloads | [public/](public/) |
| Person and site metadata | [src/lib/structured-data.ts](src/lib/structured-data.ts), [src/app/layout.tsx](src/app/layout.tsx) |

When adapting this project, update the personal content, domains, authentication configuration, and analytics settings. The Google Analytics ID is currently set directly in `src/app/layout.tsx`; a `NEXT_PUBLIC_GA_ID` environment variable does not control it.

## Routes

| Route | Content |
| --- | --- |
| `/` | Coastal homepage |
| `/about` | Background, interests, and conference slider |
| `/projects` | Project portfolio |
| `/blog` and `/blog/[slug]` | Writing and individual articles |
| `/conferences` | Conference archive |
| `/conferences/[year]` | Events for a year |
| `/conferences/[year]/[slug]` | Event details and available photos |
| `/career-and-resume` | Career timeline and résumé downloads |
| `/browser-tabs` | Curated developer resources |
| `/contact` | Contact form |
| `/link-page` | Social and portfolio links |
| `/logo-page` | Logo story |
| `/site-history` | Earlier versions of the site |
| `/react-maintenance` | React maintenance services |
| `/wordpress-maintenance` | WordPress maintenance services |
| `/site-map` | Page directory |
| `/admin-showcase` | Overview of the content management tools |
| `/admin` | Protected content management dashboard |

## Project layout

```text
src/
  app/                 Pages, route handlers, metadata, and admin routes
  components/coastal/  Beach design, 3D scenes, radio, galleries, and page shells
  components/blog/     Interactive article components
  components/ui/       Shared interface primitives
  data/                Local content, presentation settings, and fallbacks
  lib/                 SEO, structured data, formatting, and server helpers
  providers/           Convex/Clerk integration and PostHog
convex/                Database schema, backend functions, and generated bindings
public/                WebP assets, fonts, audio, and downloads
docs/images/           Screenshots used in this README
```

## Deployment

Vercel builds every pull request as a preview and deploys `main` to production. To run your own copy, connect this repository's `main` branch to a Vercel project and configure its frontend environment variables. Use matching Clerk and Convex production settings, including the Clerk `convex` JWT template and admin allowlist.

Deploy backend changes separately with `pnpm exec convex deploy` after selecting the intended production project. Publishing frontend code alone does not deploy Convex functions or transfer development content to production. Populate the destination deployment through the admin tools or a deliberate data import.

Each deployment carries the whole `public/` folder, about 45 MB, mostly the radio's audio. On the Hobby plan, a short preview retention policy keeps Deployment Storage in check.

Local session records, source-image drafts, environment files, and temporary browser output are excluded from Git.

## License and author

Code is available under the [MIT License](LICENSE). Third-party logos, photographs, fonts, and other media may have their own terms.

Built by [Chris Lane Jones](https://www.chrislanejones.com) · [GitHub](https://github.com/chrislanejones) · [LinkedIn](https://linkedin.com/in/chrislanejones)
