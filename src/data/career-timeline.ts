// src/data/career-timeline.ts
import React from "react";
import {
  GraduationCap,
  Video,
  Star,
  Lightbulb,
  Mountain,
  Home,
  Users,
  Code2,
} from "lucide-react";

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  location?: string;
  icon: React.ReactNode;
};

export const timelineEvents: TimelineEvent[] = [
  {
    year: "2013",
    title: "I Am a First-Generation College Graduate",
    description:
      "Graduated from University of North Florida with Bachelor of Arts with a concentration in Multimedia Journalism & Production",
    location: "Jacksonville, FL",
    icon: React.createElement(GraduationCap, { className: "w-6 h-6" }),
  },
  {
    year: "2013-2016",
    title: "Lights, Camera, Action",
    description: "I Started a Career in Video Editing and Production",
    location: "Jacksonville, FL",
    icon: React.createElement(Video, { className: "w-6 h-6" }),
  },
  {
    year: "2016",
    title: "I Enjoyed Coding My Personal Website So Much I Switched Careers",
    description:
      "Decided to switch from video production to web design after designing personal website",
    location: "Jacksonville, FL",
    icon: React.createElement(Star, { className: "w-6 h-6" }),
  },
  {
    year: "2017",
    title: "Front-End Web Development (jQuery Days)",
    description:
      "Began working with WordPress Theme and Plugin Development, JavaScript, jQuery, and the MERN Stack",
    location: "Jacksonville, FL",
    icon: React.createElement(Lightbulb, { className: "w-6 h-6" }),
  },
  {
    year: "2018",
    title: "We Moved to the Mountains, Because Why Not?",
    description:
      "Relocated to Harrisonburg, Virginia in the Shenandoah Mountains",
    location: "Harrisonburg, VA",
    icon: React.createElement(Mountain, { className: "w-6 h-6" }),
  },
  {
    year: "2019",
    title: "Moved Once Again — Moving Companies Love Us",
    description:
      "Picked Living Among the Cows to Be Near the Mountains and Richmond, VA.",
    location: "Louisa, VA",
    icon: React.createElement(Home, { className: "w-6 h-6" }),
  },
  {
    year: "2023",
    title: "WordPress Meetup Host",
    description:
      "Started leading Richmond's local WordPress meetup with monthly sessions.",
    location: "Louisa, VA",
    icon: React.createElement(Users, { className: "w-6 h-6" }),
  },
  {
    year: "2024",
    title: "React Developer That Also Does WordPress",
    description:
      "Shifted More to React After Seeing the Animations (I Still Do WordPress Too)",
    location: "Louisa, VA",
    icon: React.createElement(Code2, { className: "w-6 h-6" }),
  },
];
