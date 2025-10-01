"use client";

import { AnimatePresence, motion, wrap } from "framer-motion";
import Card from "../page/card";
import { useState, SVGProps, forwardRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { conferences } from "@/data/conferences";
import IconSlider, { SliderItem } from "../page/icon-slider";

// Transform conferences data to match SliderItem format
const conferenceItems: SliderItem[] = conferences.map((conf) => ({
  name: conf.name,
  logo: conf.coverImage || "",
  url: `/conferences/${conf.year}/${conf.slug}`,
  year: conf.year.toString(),
  location: conf.city,
}));

// Component props interface
interface ConferenceSliderBoxProps {
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

export default function ConferenceSliderBox({
  size = "large",
  delay = 0.3,
}: ConferenceSliderBoxProps) {
  return (
    <Card size={size} delay={delay} padding="medium">
      <IconSlider
        items={conferenceItems}
        itemsPerGroup={6}
        gridCols={3}
        gridRows={2}
        title="Tech Conferences Attended"
        showNavigation={true}
        showPagination={true}
        variant="no-filter"
      />
    </Card>
  );
}
