import type { GalleryPhoto } from "@/components/coastal/gallery-panel";

// Match the event AND year in the existing photo captions. In particular,
// the Kevin Powell photo is labelled 2025, so it is not assigned to THAT 2024.
export const conferencePhotos: Record<string, GalleryPhoto[]> = {
  "echo-conference-2013": [
    {
      src: "/gallery/conferences/Chris-Camera-Echo-2013.webp",
      alt: "Chris Lane Jones holding a video camera at Echo Conference 2013",
      description: "Me holding a camera at Echo Conference 2013.",
    },
  ],
  "epic-web-conf-2025": [
    {
      src: "/gallery/fan-gallery/Jason-Lengstorf-and-I.webp",
      alt: "Jason Lengstorf and Chris at Epic Web Conf 2025",
      description: "Jason Lengstorf and I at Epic Web Conf 2025.",
    },
    {
      src: "/gallery/Kent-C-Dodds-Friends-and-I-at-Epic-Web.webp",
      alt: "Chris with Kent C. Dodds and friends at Epic Web",
      description: "Kent C. Dodds, friends, and I at Epic Web.",
    },
  ],
  "all-things-open-2024": [
    {
      src: "/gallery/fan-gallery/ChrisSev-Avindra-and-I-ATO-2024.webp",
      alt: "Chris with Chris Sev and Avindra Fernando at All Things Open 2024",
      description: "Chris Sev, Avindra Fernando, and I at All Things Open 2024.",
    },
  ],
  "renderatl-2024": [
    {
      src: "/gallery/fan-gallery/Theo-and-I-at-RenderATL.webp",
      alt: "Theo Browne and Chris at RenderATL 2024",
      description: "Theo Browne and I at RenderATL 2024.",
    },
  ],
  "that-conference-wi-2024": [
    {
      src: "/gallery/fan-gallery/Group-Photo-With-Kent-C-Dodds-at-THAT-Conf.webp",
      alt: "Chris with Kent C. Dodds and friends at THAT Conference Wisconsin 2024",
      description: "A group photo with Kent C. Dodds at THAT Conference Wisconsin 2024.",
    },
  ],
};
