"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getPageHeader, type PageHeaderData } from "@/lib/page-headers";
import styles from "./coastal.module.css";

export function PageIntro({ header }: { header: PageHeaderData }) {
  return (
    <header className={styles.pageIntro}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{header.breadcrumbPage}</span>
      </nav>
      <h1>{header.title}</h1>
      <p>{header.description.replace(/[\u2013\u2014]/g, "-")}</p>
    </header>
  );
}

export function CoastalPageIntro({ path }: { path: string }) {
  const header = useQuery(api.pageHeaders.getPageHeaderByPath, { path });
  return <PageIntro header={header ?? getPageHeader(path)} />;
}
