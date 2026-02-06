"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader } from "@/lib/page-headers";
import Banner from "./banner";

interface ConvexBannerProps {
  path: string;
}

export default function ConvexBanner({ path }: ConvexBannerProps) {
  const headerConvex = useQuery(api.pageHeaders.getPageHeaderByPath, { path });
  const header = headerConvex ?? getPageHeader(path);

  return (
    <Banner
      title={header.title}
      breadcrumbPage={header.breadcrumbPage}
      description={header.description}
    />
  );
}
