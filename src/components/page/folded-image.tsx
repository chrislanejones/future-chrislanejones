// src/components/page/folded-image.tsx
import Image from "next/image";
import type { ComponentProps } from "react";

interface FoldedImageProps extends ComponentProps<typeof Image> {
  badge?: string;
  showHorizontalFold?: boolean;
}

export function FoldedImage({
  badge,
  showHorizontalFold = false,
  className,
  ...imageProps
}: FoldedImageProps) {
  return (
    <div className="relative w-full h-full folded-map-effect">
      <Image {...imageProps} className={`${className || ""} object-cover`} />
      <div className="fold-overlay" aria-hidden="true" />

      {/* Horizontal fold line */}
      {showHorizontalFold && (
        <div
          className="absolute top-1/2 left-0 w-full h-[3px] pointer-events-none z-[2] -translate-y-1/2"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)'
          }}
          aria-hidden="true"
        />
      )}

      {/* Badge */}
      {badge && (
        <div className="folded-card-badge">
          {badge}
        </div>
      )}
    </div>
  );
}
