// src/data/career-timeline.ts
import React from "react";

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  location?: string;
  icon: React.ReactNode;
};

// Timeline SVG icons as React components
const GradIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z",
    })
  );
const VideoIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z",
    })
  );
const StarIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    })
  );
const BulbIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z",
    })
  );
const MountainsIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z",
    })
  );
const HomeIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", { d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" })
  );
const MeetupIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63a1.5 1.5 0 00-1.43-1.07c-.8 0-1.54.46-1.92 1.17l-2.13 4.24c-.22.45-.32.95-.32 1.45V16h-1V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V16H8v-2.5c0-.83-.67-1.5-1.5-1.5S5 12.67 5 13.5V16H2v6h2v-4h2v4h2v-4h2v4h2v-4h2v4h4v-6z",
    })
  );
const ReactWPIcon = () =>
  React.createElement(
    "svg",
    { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" },
    React.createElement("path", {
      d: "M11.5,2C6.81,2 3,5.81 3,10.5S6.81,19 11.5,19C16.19,19 20,15.19 20,10.5S16.19,2 11.5,2M17.34,14.12C17.75,13.8 18.24,13.59 18.76,13.59C19.54,13.59 20.38,14.05 20.38,15.19C20.38,16.19 19.65,16.8 18.92,16.8C18.4,16.8 17.88,16.5 17.34,16.12C16.73,15.67 16.73,14.57 17.34,14.12M6.661,14.12C7.271,13.67 7.271,14.77 6.661,15.22C6.121,15.6 5.601,15.9 5.081,15.9C4.351,15.9 3.621,15.29 3.621,14.29C3.621,13.15 4.461,12.69 5.241,12.69C5.761,12.69 6.251,12.9 6.661,13.22V14.12Z",
    })
  );

export const timelineEvents: TimelineEvent[] = [
  {
    year: "2013",
    title: "I Am a First-Generation College Graduate",
    description:
      "Graduated from University of North Florida with Bachelor of Arts with a concentration in Multimedia Journalism & Production",
    location: "Jacksonville, FL",
    icon: GradIcon(),
  },
  {
    year: "2013-2016",
    title: "Lights, Camera, Action",
    description: "I Started a Career in Video Editing and Production",
    location: "Jacksonville, FL",
    icon: VideoIcon(),
  },
  {
    year: "2016",
    title: "I Enjoyed Coding My Personal Website So Much I Switched Careers",
    description:
      "Decided to switch from video production to web design after designing personal website",
    location: "Jacksonville, FL",
    icon: StarIcon(),
  },
  {
    year: "2017",
    title: "Front-End Web Development (jQuery Days)",
    description:
      "Began working with WordPress Theme and Plugin Development, JavaScript, jQuery, and the MERN Stack",
    location: "Jacksonville, FL",
    icon: BulbIcon(),
  },
  {
    year: "2018",
    title: "We Moved to the Mountains, Because Why Not?",
    description:
      "Relocated to Harrisonburg, Virginia in the Shenandoah Mountains",
    location: "Harrisonburg, VA",
    icon: MountainsIcon(),
  },
  {
    year: "2019",
    title: "Moved Once Again — Moving Companies Love Us",
    description:
      "Picked Living Among the Cows to Be Near the Mountains and Richmond, VA.",
    location: "Louisa, VA",
    icon: HomeIcon(),
  },
  {
    year: "2023",
    title: "WordPress Meetup Host",
    description:
      "Started leading Richmond's local WordPress meetup with monthly sessions.",
    location: "Louisa, VA",
    icon: MeetupIcon(),
  },
  {
    year: "2024",
    title: "React Developer That Also Does WordPress",
    description:
      "Shifted More to React After Seeing the Animations (I Still Do WordPress Too)",
    location: "Louisa, VA",
    icon: ReactWPIcon(),
  },
];
