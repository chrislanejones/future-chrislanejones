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
  {
    name: "Adecco",
    logo: "/client-icons/Adecco-Logo.webp",
    url: "https://www.adeccousa.com/",
  },
  {
    name: "RS&H",
    logo: "/client-icons/RSandH-Logo.webp",
    url: "https://www.rsandh.com/",
  },
  {
    name: "American Airlines",
    logo: "/client-icons/American-Airlines-Logo.webp",
    url: "https://www.aa.com/",
  },
  {
    name: "Asponte",
    logo: "/client-icons/Asponte-Logo.webp",
    url: "https://asponte.com/",
  },
  {
    name: "FDOT",
    logo: "/client-icons/FDOT-Logo.webp",
    url: "https://www.fdot.gov/",
  },
  {
    name: "AIS Network",
    logo: "/client-icons/AIS-Network-Logo-V2.webp",
    url: "https://aisn.net/",
  },
  {
    name: "Amtrak",
    logo: "/client-icons/Amtrak-Logo.webp",
    url: "https://www.amtrak.com/home",
  },
  {
    name: "USDOT",
    logo: "/client-icons/USDOT-Logo.webp",
    url: "https://transportation.gov/",
  },
  {
    name: "Stubhub",
    logo: "/client-icons/Stubhub-Logo.webp",
    url: "https://www.stubhub.com/",
  },
  {
    name: "Governor of Virginia",
    logo: "/client-icons/Governor-of-Virginia-Logo.webp",
    url: "https://www.governor.virginia.gov/",
  },
  {
    name: "Elvacomm",
    logo: "/client-icons/Elvacomm-Logo.webp",
    url: "https://elvacomm.com/",
  },
  {
    name: "Engage Marketing",
    logo: "/client-icons/Engage-Marketing.webp",
    url: "https://engagemarketing.biz/",
  },
  {
    name: "Fisher Design",
    logo: "/client-icons/Fisher-Design-Logo.webp",
    url: "https://www.fisherdesignandadvertising.com/",
  },
  {
    name: "WorldStrides",
    logo: "/client-icons/WorldStrides-Logo-1.webp",
    url: "https://worldstrides.com/",
  },
  {
    name: "Azzly",
    logo: "/client-icons/Azzly-Logo.webp",
    url: "https://azzly.com/",
  },
];

// Create groups of 6 clients each (3x2 grid)
const clientGroups: Client[][] = [];
for (let i = 0; i < clients.length; i += 6) {
  const group = clients.slice(i, i + 6);
  // Pad group with empty slots if needed to maintain grid structure
  while (group.length < 6) {
    group.push({
      name: "",
      logo: "",
      url: "#",
    });
  }
  clientGroups.push(group);
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

  // Only show arrows if there are multiple groups
  const showNavigation = clientGroups.length > 1;
  const currentClients = clientGroups[selectedGroup] || clients.slice(0, 6);

  return (
    <Card size={size} delay={delay} padding="medium">
      <h2 className="text-center font-semibold text-lg mb-4">
        Past and Present Clients
      </h2>

      <div className="flex items-center justify-between gap-4">
        {/* Left Arrow - only show if there are multiple groups */}
        {showNavigation ? (
          <motion.button
            initial={false}
            aria-label="Previous"
            className="w-12 h-12 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
            onClick={() => setSlide(-1)}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft />
          </motion.button>
        ) : (
          <div className="w-12" /> // Spacer to maintain layout
        )}

        <div className="flex-1 relative h-80 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <ClientGroup
              key={selectedGroup}
              clients={currentClients}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow - only show if there are multiple groups */}
        {showNavigation ? (
          <motion.button
            initial={false}
            aria-label="Next"
            className="w-12 h-12 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
            onClick={() => setSlide(1)}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight />
          </motion.button>
        ) : (
          <div className="w-12" /> // Spacer to maintain layout
        )}
      </div>

      {/* Pagination dots - only show if there are multiple groups */}
      {showNavigation && (
        <div className="flex justify-center gap-2 mt-4">
          {clientGroups.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > selectedGroup ? 1 : -1);
                setSelectedGroup(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedGroup
                  ? "bg-accent"
                  : "bg-ink/20 hover:bg-ink/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

const ClientGroup = forwardRef<HTMLDivElement, ClientGroupProps>(
  ({ clients, direction }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-6 p-4"
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
        {clients.map((client: Client, index: number) => {
          // Skip empty slots
          if (!client.name || !client.logo) {
            return (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-center"
              />
            );
          }

          return (
            <motion.a
              key={`${client.name}-${index}`}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center relative brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300 opacity-80 hover:opacity-100 bg-white/5 rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                transition: {
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
            >
              <Image
                src={client.logo}
                alt={`${client.name} logo`}
                width={180}
                height={126}
                className="object-contain w-full h-full max-w-[180px] max-h-[126px]"
                sizes="160px"
              />
            </motion.a>
          );
        })}
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
