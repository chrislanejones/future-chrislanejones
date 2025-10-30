"use client";

import Card from "../page/card";
import IconSlider, { SliderItem } from "../page/icon-slider";

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

const clientItems: SliderItem[] = clients.map((client) => ({
  name: client.name,
  logo: client.logo,
  url: client.url,
}));

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

export default function Clientsliderbox({
  size = "large",
  delay = 0.3,
}: ClientsliderboxProps) {
  return (
    <Card
      size={size}
      padding="medium"
      shadow="soft"
      border="thin"
      delay={delay}
    >
      <IconSlider
        items={clientItems}
        itemsPerGroup={6}
        gridCols={3}
        gridRows={2}
        title="Past and Present Clients"
        showNavigation={true}
        showPagination={true}
        variant="large-block"
      />
    </Card>
  );
}
