"use client";

import Image from "next/image";
import Card from "@/components/page/card";
import { logoVariants, type LogoVariant } from "@/data/logo-variants";

const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

function LogoCard({ variant, index }: { variant: LogoVariant; index: number }) {
  return (
    <Card
      size="page-half"
      className="overflow-hidden"
      delay={0.1 + index * 0.1}
    >
      <div className="flex flex-col h-full">
        {/* Logo Display Area */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-[200px] max-h-[200px]">
            <Image
              src={variant.image}
              alt={variant.imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="mb-3">{variant.title}</h3>
          <p className="text-muted leading-relaxed">{variant.description}</p>
        </div>
      </div>
    </Card>
  );
}

const LogoPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {logoVariants.map((variant, index) => (
        <LogoCard key={variant.title} variant={variant} index={index} />
      ))}
    </div>
  );
};

export default LogoPage;
