"use client";

import Link from "next/link";
import { BeachBanner } from "./beach-banner";
import { SceneBanner, BANNER_SCENES } from "./scene-banner";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader, type PageHeaderData } from "@/lib/page-headers";
import styles from "./coastal.module.css";

export function PageIntro({ header, path }: { header: PageHeaderData; path?: string }) {
  const scene = path ? BANNER_SCENES[path] : undefined;
  const copy = <>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <Link href="/">Home</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{header.breadcrumbPage}</span>
    </nav>
    <h1>{header.title}</h1>
    <p>{header.description.replace(/[\u2013\u2014]/g, "-")}</p>
  </>;
  return (
    <header className={styles.pageIntro}>
      {scene ? <SceneBanner scene={scene}>{copy}</SceneBanner> : <BeachBanner>{copy}</BeachBanner>}
    </header>
  );
}

export function CoastalPageIntro({ path }: { path: string }) {
  const header = useQuery(api.pageHeaders.getPageHeaderByPath, { path });
  return <PageIntro header={header ?? getPageHeader(path)} path={path} />;
}
