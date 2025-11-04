"use client";

import Card from "../page/card";
import { conferences } from "@/data/conferences";
import IconSlider, { SliderItem } from "../page/icon-slider";

const conferenceItems: SliderItem[] = conferences.map((conf) => ({
  name: conf.name,
  logo: conf.coverImage || "",
  url: `/conferences/${conf.year}/${conf.slug}`,
  year: conf.year.toString(),
  location: conf.city,
}));

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
    <Card
      size={size}
      padding="medium"
      shadow="soft"
      border="thin"
      delay={delay}
    >
      <IconSlider
        items={conferenceItems}
        title="Tech Conferences Attended"
        showNavigation={true}
        showPagination={true}
        variant="no-filter"
      />
    </Card>
  );
}
