"use client";

import Card from "../page/card";
import IconSlider, { SliderItem } from "../page/icon-slider";
import { clients } from "@/data/clients"; // ← new import

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
      height="medium"
    >
      <IconSlider
        items={clientItems}
        title="Past and Present Clients"
        showNavigation={true}
        showPagination={true}
        variant="large-block"
      />
    </Card>
  );
}
