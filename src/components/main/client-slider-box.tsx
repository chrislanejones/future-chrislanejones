"use client";

import { AnimatePresence, motion, wrap } from "framer-motion";
import Card from "../page/card";
import { useState, SVGProps, forwardRef } from "react";
import Image from "next/image";

type Client = { name: string; logo: string; url: string };

const clients: Client[] = [
  {
    name: "Allianz Travel",
    logo: "/client-icons/Allianz-Travel-Logo.webp",
    url: "https://www.allianztravelinsurance.com/",
  },
  {
    name: "BlueTriangle",
    logo: "/client-icons/BlueTriangle-Logo-1.webp",
    url: "https://bluetriangle.com/",
  },
  {
    name: "Virginia IT Agency VITA",
    logo: "/client-icons/Virginia-IT-Agency-VITA-Logo.webp",
    url: "https://www.vita.virginia.gov/",
  },
  // Add more clients...
];

const clientGroups: Client[][] = [];
for (let i = 0; i < clients.length; i += 6) {
  clientGroups.push(clients.slice(i, i + 6));
}

// Component props interface
interface ClientsliderboxProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

type ClientGroupProps = {
  clients: Client[];
  direction: number;
};

export default function Clientsliderbox({
  size = "large",
  delay = 0.3,
}: ClientsliderboxProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  function setSlide(newDirection: 1 | -1) {
    const nextGroup = wrap(
      0,
      clientGroups.length,
      selectedGroup + newDirection
    );
    setSelectedGroup(nextGroup);
    setDirection(newDirection);
  }

  return (
    <Card size={size} delay={delay} padding="medium">
      <h2 className="text-center font-semibold text-lg mb-4">
        Past and Present Clients
      </h2>
      <div className="flex items-center justify-between gap-4">
        <motion.button
          initial={false}
          aria-label="Previous"
          className="w-12 h-12 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
          onClick={() => setSlide(-1)}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft />
        </motion.button>

        <div className="flex-1 relative h-80 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <ClientGroup
              key={selectedGroup}
              clients={clientGroups[selectedGroup]}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        <motion.button
          initial={false}
          aria-label="Next"
          className="w-12 h-12 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
          onClick={() => setSlide(1)}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight />
        </motion.button>
      </div>
    </Card>
  );
}

const ClientGroup = forwardRef<HTMLDivElement, ClientGroupProps>(
  ({ clients, direction }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-8 p-6"
        initial={{ opacity: 0, x: direction * 50 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            delay: 0.1,
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
        exit={{
          opacity: 0,
          x: direction * -50,
          transition: { duration: 0.3 },
        }}
      >
        {clients.map((client: Client) => (
          <motion.a
            key={client.name}
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center relative brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300 opacity-80 hover:opacity-100 bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={client.logo}
              alt={`${client.name} logo`}
              width={220}
              height={80}
              className="object-contain w-full h-full"
              sizes="220px"
            />
          </motion.a>
        ))}
      </motion.div>
    );
  }
);

ClientGroup.displayName = "ClientGroup";

// Icons
const iconsProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "28",
  height: "28",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function ArrowLeft() {
  return (
    <svg {...iconsProps}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg {...iconsProps}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
