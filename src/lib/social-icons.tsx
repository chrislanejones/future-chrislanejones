// src/lib/social-icons.tsx
// Icons cannot be stored in Convex — a React component is not a Convex value —
// so a social link row stores a stable `iconKey` string and this registry maps
// that key to the component. Adding a platform means adding one entry here; the
// admin panel's icon picker is generated from this same list, so the two can
// never drift.
import { createElement } from "react";
import type { IconType } from "react-icons/lib";
import {
  FaAtom,
  FaChrome,
  FaCodepen,
  FaDev,
  FaDiscord,
  FaEnvelope,
  FaFileLines,
  FaGithub,
  FaHouse,
  FaInstagram,
  FaLinkedin,
  FaMastodon,
  FaRss,
  FaStackOverflow,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaWordpress,
  FaXTwitter,
  FaYoutube,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import {
  SiBluesky,
  SiBuymeacoffee,
  SiCodeberg,
  SiGitlab,
  SiSubstack,
} from "react-icons/si";

export type SocialIconKey =
  | "x-twitter"
  | "bluesky"
  | "github"
  | "codeberg"
  | "gitlab"
  | "linkedin"
  | "codepen"
  | "youtube"
  | "tiktok"
  | "twitch"
  | "instagram"
  | "threads"
  | "mastodon"
  | "discord"
  | "devto"
  | "substack"
  | "stackoverflow"
  | "buymeacoffee"
  | "wordpress"
  | "react"
  | "chrome"
  | "home"
  | "rss"
  | "resume"
  | "email"
  | "link";

// Ordered so the admin picker groups sensibly: profiles first, then the
// non-platform icons the "extra links" set uses.
export const SOCIAL_ICONS: ReadonlyArray<{
  key: SocialIconKey;
  label: string;
  Icon: IconType;
}> = [
  { key: "x-twitter", label: "X / Twitter", Icon: FaXTwitter },
  { key: "bluesky", label: "BlueSky", Icon: SiBluesky },
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "codeberg", label: "Codeberg", Icon: SiCodeberg },
  { key: "gitlab", label: "GitLab", Icon: SiGitlab },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "codepen", label: "CodePen", Icon: FaCodepen },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "tiktok", label: "TikTok", Icon: FaTiktok },
  { key: "twitch", label: "Twitch", Icon: FaTwitch },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "threads", label: "Threads", Icon: FaThreads },
  { key: "mastodon", label: "Mastodon", Icon: FaMastodon },
  { key: "discord", label: "Discord", Icon: FaDiscord },
  { key: "devto", label: "Dev.to", Icon: FaDev },
  { key: "substack", label: "Substack", Icon: SiSubstack },
  { key: "stackoverflow", label: "Stack Overflow", Icon: FaStackOverflow },
  { key: "buymeacoffee", label: "Buy Me a Coffee", Icon: SiBuymeacoffee },
  { key: "wordpress", label: "WordPress", Icon: FaWordpress },
  { key: "react", label: "React", Icon: FaAtom },
  { key: "chrome", label: "Chrome", Icon: FaChrome },
  { key: "home", label: "Home", Icon: FaHouse },
  { key: "rss", label: "Blog / RSS", Icon: FaRss },
  { key: "resume", label: "Resume", Icon: FaFileLines },
  { key: "email", label: "Email", Icon: FaEnvelope },
  { key: "link", label: "Generic link", Icon: FaArrowUpRightFromSquare },
];

const ICON_BY_KEY = new Map(SOCIAL_ICONS.map((entry) => [entry.key, entry]));

/** Falls back to the generic link icon so an unknown key never renders blank. */
export function socialIconComponent(key: string): IconType {
  return ICON_BY_KEY.get(key as SocialIconKey)?.Icon ?? FaArrowUpRightFromSquare;
}

/**
 * Renders the icon for a stored key. `size` matches react-icons' own prop.
 *
 * createElement rather than `<Icon />`: every component here is a module-level
 * constant looked up from a frozen map, but rendering through a capitalized
 * local reads to the linter as declaring a component mid-render.
 */
export function SocialIcon({
  iconKey,
  size = 18,
}: {
  iconKey: string;
  size?: number;
}) {
  return createElement(socialIconComponent(iconKey), { size });
}

export function socialIconLabel(key: string): string {
  return ICON_BY_KEY.get(key as SocialIconKey)?.label ?? "Generic link";
}
