export interface SiteHistoryLink {
  label: string;
  url: string;
}

export interface SiteHistorySection {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  links?: SiteHistoryLink[];
}

export const siteHistorySections: SiteHistorySection[] = [
  {
    title: "2007-2009 Pre-chrislanejones.com",
    description:
      "My first professional website was built on WordPress 2.1, released in January 2007. I modified the iconic Kubrick theme by Michael Heilemann—the default WordPress theme that defined an era of blogging.\n\nThe Kubrick theme was elegant in its simplicity: a clean white background, blue header, customizable header image, and that distinctive rounded sidebar. The domain was inspirationalexperiences.org.",
    image: "/site-history/WordPress-2.1-January-2007.webp",
    imageAlt: "WordPress 2.1 interface with Kubrick theme from January 2007",
    imagePosition: "left",
    links: [
      {
        label: "The Secret History of Kubrick Theme",
        url: "https://wordpress.org/documentation/article/kubrick/",
      },
      {
        label: "A Journey Through WordPress Interface",
        url: "https://wordpress.org/news/2007/01/wordpress-21/",
      },
    ],
  },
  {
    title: "2012-2016 - Chrislanejones.com: The Video Production Years",
    description:
      "In 2013, I graduated with a Bachelor of Arts in Television Production after three video production communications internships at the University of North Florida.\n\nI started my career in video editing working at a local church in Jacksonville, FL—First Baptist Church of Jacksonville. When I worked at the church, I spent hours designing my website and I decided to switch careers to building websites.\n\nThis video production website portfolio helped me land my first job in tech, even though it referenced me being a video editor and web designer.\n\nI used a responsive theme to build my website, which was still a new concept in 2014. My first job in tech was at Web.com, and the majority of the websites were not responsive when I started.\n\nThis site was built with the CyberChimps Responsive WordPress theme—one of the early champions of mobile-first design in the WordPress ecosystem.",
    image: "/site-history/Original-Video-Production-Website.webp",
    imageAlt: "Original video production portfolio website",
    imagePosition: "right",
    links: [
      {
        label: "CyberChimps Responsive Theme Review",
        url: "https://www.cyberchimps.com/",
      },
    ],
  },
  {
    title: "2017-2024 - WordPress Bootstrap Resume: The Ugly Years",
    description:
      "I built my own WordPress website from scratch using Bootstrap, and honestly... it was ugly. I can't believe it was up for so long.\n\nThis website was live during my move to Virginia, a period of major life and career transition. Looking back, it's a humbling reminder that not every design decision ages well. The Bootstrap grid was there, the functionality worked, but the aesthetic? Let's just say it was more 'functional' than 'beautiful.'\n\nDespite its appearance, this site served its purpose—it got me through contract work, networking events, and eventually led to better opportunities. It's proof that perfect is the enemy of done, and sometimes you just need to ship it and iterate later.",
    image: "/site-history/My-Resume-Website.webp",
    imageAlt: "WordPress Bootstrap resume website from 2017-2024",
    imagePosition: "left",
  },
  {
    title: "2024-2025 - The Short-Lived Post-COVID WordPress Site",
    description:
      "This site was built during my transition from WordPress to React—a bridge between two worlds. I was falling in love with React's component model and growing increasingly frustrated with WordPress's direction, particularly the controversies surrounding Matt Mullenweg and the platform's fractured ecosystem.\n\nThe block editor (Gutenberg) felt clunky compared to the elegance of React components. The WordPress drama was exhausting. And most importantly, I wanted the creative freedom that React offered—especially for animations and micro-interactions.\n\nReact with Framer Motion made it trivially easy to add smooth, performant animations that would have been painful in WordPress.\n\nThis site didn't last long. By mid-2025, I had fully transitioned to a modern React stack with Next.js, TypeScript, Tailwind CSS, and Framer Motion.",
    image: "/site-history/Post-Covid-WordPress-Website.webp",
    imageAlt: "Post-COVID WordPress website during transition to React",
    imagePosition: "right",
  },
  {
    title: "2025 - Future: Modern React & Framer Motion",
    description:
      "This is the site you're looking at right now—built with Next.js 14, React, TypeScript, Tailwind CSS, and Framer Motion.\n\nI finally had the creative freedom I'd been craving. Framer Motion made animations smooth and intuitive. The component-based architecture meant I could build reusable pieces and iterate quickly. TypeScript caught bugs before they reached production. Tailwind made styling fast and consistent.\n\nThe bento grid layout, the smooth page transitions, the interactive components, the dark mode—all of this would have been significantly harder in WordPress. React gave me the tools to build the portfolio site I'd always envisioned.\n\nLooking ahead, I'm excited to continuing to push what's possible with modern web technologies. The journey continues.",
    image: "/site-history/New-React-Website.webp",
    imageAlt: "Current Next.js and React website with modern animations",
    imagePosition: "left",
  },
];
