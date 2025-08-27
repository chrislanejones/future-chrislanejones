# Chris Lane Jones - Developer Portfolio

A modern, interactive portfolio website built with Next.js 14, featuring a bento grid layout, working music player, photo gallery, and project showcase.

## Features

### Interactive Bento Grid Layout

- **Hero Section**: Introduction with animated background elements
- **Quote Generator**: Rotating inspirational quotes with refresh functionality
- **Music Player**: Fully functional audio player with volume controls and track navigation
- **Tech Stack Display**: Current technologies and future learning goals
- **Photo Gallery**: Polaroid-style hiking photos with click-to-front interactions
- **Project Showcase**: Navigable project cards with live demo links
- **Client Slider**: Animated carousel of past and present clients

### Key Functionality

- **Working Audio Player**: Play/pause, volume control, track switching
- **Interactive Photo Gallery**: Drawer-based gallery with polaroid effects
- **Project Navigation**: Arrow navigation through featured projects
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Dark/Light Theme**: Automatic theme switching based on user preference

## Tech Stack

### Core Technologies

- **Next.js 14** - App Router with TypeScript
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Icon system

### Additional Libraries

- **vaul** - Drawer component for mobile-friendly interactions
- **simple-icons** - Technology icons for skill display
- **class-variance-authority** - Type-safe component variants

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles and CSS variables
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Homepage
│   └── projects/
│       └── page.tsx          # Projects page
├── components/
│   ├── BentoGrid.tsx         # Main grid layout
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Site footer
│   ├── ProjectGrid.tsx       # Projects page layout
│   ├── main/
│   │   ├── client-slider-box.tsx      # Client carousel
│   │   ├── image-gallery-box.tsx      # Photo gallery
│   │   ├── music-player-box.tsx       # Audio player
│   │   ├── projects-box.tsx           # Project showcase
│   │   ├── quote-generator-card.tsx   # Quote rotator
│   │   └── tech-stack-box.tsx         # Skills display
│   └── ui/
│       ├── button.tsx        # Reusable button component
│       └── drawer.tsx        # Modal drawer component
└── lib/
    └── utils.ts              # Utility functions
```

## Design System

### Color Palette

- **Light Theme**: Sunlit scrub with evergreen accents
- **Dark Theme**: Night trail with hi-viz green highlights
- **Accent Color**: Forest green (#2f7d32 light, #8de36b dark)

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Handwriting**: Comic Sans MS for polaroid descriptions

### Components

- **Cards**: Rounded corners with subtle borders and glass effects
- **Buttons**: Multiple variants with focus states and animations
- **Interactive Elements**: Hover states and tap feedback

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/chrislanejones/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
bun install
```

3. Set up media files:

```bash
# Create directories for media
mkdir -p public/music/audio public/music/art public/gallery public/client-icons

# Add your audio files to public/music/audio/
# Add album art to public/music/art/
# Add hiking photos to public/gallery/
# Add client logos to public/client-icons/
```

4. Start the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Media Setup

### Audio Files

Place audio files in `public/music/audio/`:

- `after-the-earthquake.mp3`
- Additional tracks as needed

### Album Art

Place album artwork in `public/music/art/`:

- `Alvvays-Blue-Rev-Album-Art.webp`

### Photo Gallery

Place hiking photos in `public/gallery/`:

- `Hiking-1.webp`, `Hiking-2.webp`, etc.

### Client Logos

Place client logos in `public/client-icons/`:

- Various client logo files in WebP format

## Customization

### Adding Projects

Update the projects array in `src/components/main/projects-box.tsx`:

```typescript
const projects: Project[] = [
  {
    title: "Your Project",
    description: "Project description",
    features: ["Feature 1", "Feature 2"],
    image: "/project-image.webp",
    githubUrl: "https://github.com/username/repo",
    vercelUrl: "https://project.vercel.app",
  },
];
```

### Adding Music Tracks

Update the playlist in `src/components/main/music-player-box.tsx`:

```typescript
const playlist = [
  {
    title: "Song Title",
    artist: "Artist Name",
    album: "Album Name",
    albumArt: "/music/art/album.webp",
    audioSrc: "/music/audio/song.mp3",
  },
];
```

### Updating Quotes

Modify the quotes array in `src/components/main/quote-generator-card.tsx`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Manual Build

```bash
bun run build
bun start
```

## Performance Features

- **Static Site Generation** for optimal loading
- **Image Optimization** with Next.js Image component
- **Code Splitting** with dynamic imports
- **Lazy Loading** for media content
- **Responsive Images** with appropriate sizing

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with modern JavaScript support

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Chris Lane Jones - [hello@chrislanejones.com](mailto:hello@chrislanejones.com)

Project Link: [https://github.com/chrislanejones/portfolio](https://github.com/chrislanejones/portfolio)
