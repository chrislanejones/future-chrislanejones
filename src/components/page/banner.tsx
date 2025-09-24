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
  children 
}: BannerProps) {
  return (
    <motion.div
      className="mb-16"
      
      
      
    >
      <div className="flex items-start justify-between mb-16 gap-6">
        <div className="text-left flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {title}
          </h1>

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

          {children}
        </div>

        {description && (
          <p className="text-[color:var(--color-ink)] text-lg max-w-md text-right">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}