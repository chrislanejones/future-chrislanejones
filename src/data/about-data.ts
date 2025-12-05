export interface AboutSection {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageDescription: string;
  imagePosition: "left" | "right";
}

export const aboutSections: AboutSection[] = [
  {
    title: "From Video Production to Web Development",
    description:
      "I am passionate about design and development on React platforms; Next.js and Astro. I also work on WordPress websites. I'm big on learning new things in a rapid-paced, ever-changing tech industry — never a dull moment in JavaScript, PHP, and their frameworks.\n\nIn 2013, I graduated after three communications internships at the University of North Florida. I started my career in video editing but after spending hours working and designing my website, I decided to switch careers to build websites. I work with React Frameworks like Next.js and WordPress websites.",
    image: "/gallery/Me-Recording-A-Video.webp",
    imageAlt: "Chris recording a video",
    imageDescription: "Recording a video in the field in 2013",
    imagePosition: "left",
  },
  {
    title: "Local Meetup Host & Community Leader",
    description:
      "I led Richmond's local WordPress meetup and hosted monthly meetups from January 2022 till January 2025. We discussed WordPress topics, general web knowledge, and provide support for developers in the Glen Allen area.\n\nPreviously served as Digital Director for The JOMM (Jacksonville Online Marketing Meetup), where I increased monthly attendance and website engagement.",
    image: "/gallery/Richmond-WordPress-Meetup.webp",
    imageAlt: "Richmond WordPress Meetup",
    imageDescription: "WPRVA Event Banner",
    imagePosition: "right",
  },
  {
    title: "Living in the Shenandoah Mountains",
    description:
      "Our dreams came true five years ago when I moved to Harrisonburg, Virginia. I later moved closer to Richmond, VA and now work remotely in the small town of Louisa, Virginia.\n\nMy wife runs a local equine-assisted private practice counseling service — [Heaven's Rays Ministries](https://heavensraysministries.com/). In Louisa, I am close to several cities and the Shenandoah mountains.",
    image: "/gallery/Me-on-a-Bike-Trail.webp",
    imageAlt: "Me on my bike at the Bike Trails by Piney River",
    imageDescription: "Exploring bike trails near the Piney River",
    imagePosition: "left",
  },
  {
    title: "Adventure & Travel",
    description:
      "I love adventure and traveling. In 2016 my wife (Becky) and I traveled to the mountains in Washington and Oregon. The trails of Cannon Beach and the cliffs were the trip's highlights.\n\nAfter this trip, we started looking for work in the towns adjacent to the Appalachian Mountains. We love hiking, biking, and exploring the outdoors. We ended up moving to Harrisonburg, Virginia in 2018 and then moved to Central Virginia in 2019.",
    image: "/gallery/Becky-and-I-at-Glacier-National-Park.webp",
    imageAlt: "Glacier National Park",
    imageDescription: "Adventures at Glacier National Park",
    imagePosition: "right",
  },
];
