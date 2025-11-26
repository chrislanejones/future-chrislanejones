"use client";

import IconSlider, { SliderItem } from "@/components/page/icon-slider";
import { clients } from "@/data/clients";

const clientItems: SliderItem[] = clients.map((client) => ({
  name: client.name,
  logo: client.logo,
  url: client.url,
}));

export default function ClientSliderContent() {
  return (
    <IconSlider
      items={clientItems}
      title="Past and Present Clients"
      showNavigation={true}
      showPagination={true}
      variant="large-block"
    />
  );
}
