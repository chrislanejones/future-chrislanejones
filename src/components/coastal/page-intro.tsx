"use client";

import Link from "next/link";
import { BeachBanner } from "./beach-banner";
import { StreetViewBanner } from "./street-view-banner";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader, type PageHeaderData } from "@/lib/page-headers";
import styles from "./coastal.module.css";

export function PageIntro({ header, streetView = false }: { header: PageHeaderData; streetView?: boolean }) {
  const copy = <>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <Link href="/">Home</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{header.breadcrumbPage}</span>
    </nav>
    <h1>{header.title}</h1>
    <p>{header.description.replace(/[–—]/g, "-")}</p>
  </>;
  return (
    <header className={styles.pageIntro}>
      {streetView ? <StreetViewBanner>{copy}</StreetViewBanner> : <BeachBanner>{copy}</BeachBanner>}
    </header>
  );
}

export function CoastalPageIntro({ path }: { path: string }) {
  const header = useQuery(api.pageHeaders.getPageHeaderByPath, { path });
  return <PageIntro header={header ?? getPageHeader(path)} streetView={path === "/about"} />;
}
