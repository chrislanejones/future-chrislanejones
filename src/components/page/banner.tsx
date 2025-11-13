"use client";

import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ReactNode } from "react";
import WireframeTerrain from "./wireframe-terrain";

interface BannerProps {
  title: string;
  breadcrumbPage: string;
  description?: string;
  children?: ReactNode;
}

export default function Banner({
  title,
  breadcrumbPage,
  description,
  children,
}: BannerProps) {
  return (
    <motion.div className="relative py-1 lg:py-12">
      <WireframeTerrain variant="right" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:justify-between gap-6 px-3">
        <div className="text-left flex-1">
          <h1 className="h1 tracking-tight text-ink pb-4">{title}</h1>

          {description && (
            <p className="p text-ink max-w-md text-left lg:hidden pb-6">
              {description}
            </p>
          )}

          <div className="lg:hidden pb-6">{children}</div>

          <Breadcrumb className="pb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="hidden lg:block">{children}</div>
        </div>

        {description && (
          <p className="p text-ink max-w-md text-right hidden lg:block">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
