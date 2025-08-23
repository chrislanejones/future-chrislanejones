"use client";

import { AnimatePresence, motion, wrap } from "framer-motion";
import { useState, SVGProps } from "react";
import Image from "next/image";

const clients = [
  { name: "Allianz Travel", logo: "/client-icons/Allianz-Travel-Logo.webp", url: "https://www.allianztravelinsurance.com/" },
  { name: "BlueTriangle", logo: "/client-icons/BlueTriangle-Logo-1.webp", url: "https://bluetriangle.com/" },
  { name: "Virginia IT Agency VITA", logo: "/client-icons/Virginia-IT-Agency-VITA-Logo.webp", url: "https://www.vita.virginia.gov/" },
  { name: "Adecco", logo: "/client-icons/Adecco-Logo.webp", url: "https://www.adeccousa.com/" },
  { name: "RS&H", logo: "/client-icons/RSandH-Logo.webp", url: "https://www.rsandh.com/" },
  { name: "American Airlines", logo: "/client-icons/American-Airlines-Logo.webp", url: "https://www.aa.com/" },
  { name: "Asponte", logo: "/client-icons/Asponte-Logo.webp", url: "https://asponte.com/" },
  { name: "FDOT", logo: "/client-icons/FDOT-Logo.webp", url: "https://www.fdot.gov/" },
  { name: "AIS Network", logo: "/client-icons/AIS-Network-Logo-V2.webp", url: "https://aisn.net/" },
  { name: "Amtrak", logo: "/client-icons/Amtrak-Logo.webp", url: "https://www.amtrak.com/home" },
  { name: "USDOT", logo: "/client-icons/USDOT-Logo.webp", url: "https://transportation.gov/" },
  { name: "Stubhub", logo: "/client-icons/Stubhub-Logo.webp", url: "https://www.stubhub.com/" },
  { name: "Governor of Virginia", logo: "/client-icons/Governor-of-Virginia-Logo.webp", url: "https://www.governor.virginia.gov/" },
  { name: "Elvacomm", logo: "/client-icons/Elvacomm-Logo.webp", url: "https://elvacomm.com/" },
  { name: "Engage Marketing", logo: "/client-icons/Engage-Marketing.webp", url: "https://engagemarketing.biz/" },
  { name: "Fisher Design", logo: "/client-icons/Fisher-Design-Logo.webp", url: "https://www.fisherdesignandadvertising.com/" },
  { name: "WorldStrides", logo: "/client-icons/WorldStrides-Logo-1.webp", url: "https://worldstrides.com/" },
  { name: "Azzly", logo: "/client-icons/Azzly-Logo.webp", url: "https://azzly.com/" },
];

// Group clients into pages of 4
const clientGroups = [];
for (let i = 0; i < clients.length; i += 4) {
  clientGroups.push(clients.slice(i, i + 4));
}

export default function ClientSlider() {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  function setSlide(newDirection: 1 | -1) {
    const nextGroup = wrap(0, clientGroups.length, selectedGroup + newDirection);
    setSelectedGroup(nextGroup);
    setDirection(newDirection);
  }

  return (
    <motion.article
      className="md:col-span-6 md:row-span-1 card rounded-3xl glass p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h2 className="text-center font-semibold text-lg mb-4">Past and Present Clients</h2>
      <div className="flex items-center justify-between gap-4">
        <motion.button
          initial={false}
          aria-label="Previous"
          className="w-10 h-10 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
          onClick={() => setSlide(-1)}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft />
        </motion.button>
        
        <div className="flex-1 relative h-20 overflow-hidden">
          <AnimatePresence
            custom={direction}
            initial={false}
            mode="popLayout"
          >
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
          className="w-10 h-10 rounded-full bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors"
          onClick={() => setSlide(1)}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight />
        </motion.button>
      </div>
    </motion.article>
  );
}

function ClientGroup({ clients, direction }: { clients: typeof clientGroups[0], direction: number }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-around gap-4"
      initial={{ opacity: 0, x: direction * 50 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      }}
      exit={{ opacity: 0, x: direction * -50 }}
    >
      {clients.map((client) => (
        <motion.a
          key={client.name}
          href={client.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-[200px] h-[80px] relative brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300 opacity-80 hover:opacity-100"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={client.logo}
            alt={`${client.name} logo`}
            fill
            className="object-contain"
            sizes="200px"
          />
        </motion.a>
      ))}
    </motion.div>
  );
}

// Icons
const iconsProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
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