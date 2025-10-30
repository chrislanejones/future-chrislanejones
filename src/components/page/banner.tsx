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
    <motion.div className="mb-16">
      <div className="flex flex-col lg:flex-row items-start lg:justify-between mb-16 gap-6">
        <div className="text-left flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>

          {/* Mobile: Description comes after title, before breadcrumbs */}
          {description && (
            <p className="text-[color:var(--color-ink)] text-lg max-w-md text-left lg:hidden mb-6">
              {description}
            </p>
          )}

          {/* Mobile: Children (badges/pills) come after description, before breadcrumbs */}
          <div className="lg:hidden mb-6">{children}</div>

          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
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

          {/* Desktop: Children appear after breadcrumbs */}
          <div className="hidden lg:block">{children}</div>
        </div>

        {/* Desktop: Description on the right */}
        {description && (
          <p className="text-[color:var(--color-ink)] text-lg max-w-md text-right hidden lg:block">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
