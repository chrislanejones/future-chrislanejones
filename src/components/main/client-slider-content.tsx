"use client";

import React, { Component, type ReactNode } from "react";
import IconSlider, { SliderItem } from "@/components/page/icon-slider";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { clients as staticClients } from "@/data/clients";

const staticItems: SliderItem[] = staticClients.map((c) => ({
  name: c.name,
  logo: c.logo,
  url: c.url,
}));

/* Fallback to static data if Convex clients table isn't deployed yet */
class ClientSliderBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <IconSlider
          items={staticItems}
          title="Past and Present Clients"
          showNavigation={true}
          showPagination={true}
          variant="large-block"
        />
      );
    }
    return this.props.children;
  }
}

function ClientSliderInner() {
  const dbClients = useQuery(api.clients.getAll);

  const items: SliderItem[] =
    dbClients && dbClients.length > 0
      ? dbClients.map((c) => ({ name: c.name, logo: c.logo, url: c.url, alt: c.logoAlt ?? `${c.name} logo` }))
      : staticItems;

  return (
    <IconSlider
      items={items}
      title="Past and Present Clients"
      showNavigation={true}
      showPagination={true}
      variant="large-block"
    />
  );
}

export default function ClientSliderContent() {
  return (
    <ClientSliderBoundary>
      <ClientSliderInner />
    </ClientSliderBoundary>
  );
}
