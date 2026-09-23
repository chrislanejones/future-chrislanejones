// src/lib/structured-data.ts
// One source for who Chris is, used by page metadata, JSON-LD, and llms.txt.
// Change the title here and every page, schema, and AI file follows.

export const SITE_URL = "https://www.chrislanejones.com";

export const PERSON = {
  name: "Chris Lane Jones",
  jobTitle: "Senior Web Engineer",
  headline:
    "Senior Web Engineer | React, TypeScript & Rust/WebAssembly | AI Automation | Enterprise CMS & WCAG Accessibility",
  description:
    "Senior web engineer in Jacksonville, FL. React, TypeScript, Rust/WebAssembly, AI automation, enterprise CMS and WCAG accessibility for business and government.",
  image: `${SITE_URL}/Professional-Photo-of-Chris-Lane-Jones.webp`,
  location: { city: "Jacksonville", region: "FL", country: "US" },
  sameAs: [
    "https://github.com/chrislanejones",
    "https://codeberg.org/chrislanejones",
    "https://www.linkedin.com/in/chrislanejones",
    "https://x.com/cljwebdev",
    "https://bsky.app/profile/chrislanejones.com",
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "Rust",
    "WebAssembly",
    "AI automation",
    "WordPress",
    "Enterprise CMS",
    "WCAG accessibility",
    "Convex",
  ],
} as const;

const PERSON_ID = `${SITE_URL}/#person`;

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: PERSON.name,
        url: SITE_URL,
        image: PERSON.image,
        jobTitle: PERSON.jobTitle,
        description: PERSON.description,
        knowsAbout: PERSON.knowsAbout,
        sameAs: PERSON.sameAs,
        address: {
          "@type": "PostalAddress",
          addressLocality: PERSON.location.city,
          addressRegion: PERSON.location.region,
          addressCountry: PERSON.location.country,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: PERSON.name,
        description: PERSON.description,
        inLanguage: "en-US",
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}

// JSON.stringify doesn't escape "<", so a value containing "</script>" would
// close the tag early. Escape it for any JSON-LD rendered into a <script>.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
