"use client";
import { conferences } from "@/data/conferences";
import IconSlider, { SliderItem } from "../page/icon-slider";

const conferenceItems: SliderItem[] = conferences.map((conf) => ({
  name: conf.name,
  logo: conf.coverImage || "",
  url: `/conferences/${conf.year}/${conf.slug}`,
  year: conf.year.toString(),
  location: conf.city,
}));

export default function ConferenceSliderContent() {
  return (
    <IconSlider
      items={conferenceItems}
      title="Tech Conferences Attended"
      showNavigation={true}
      showPagination={true}
      variant="no-filter"
    />
  );
}
