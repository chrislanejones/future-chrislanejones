// src/components/page/folded-image.tsx
import Image from "next/image";
import type { ComponentProps } from "react";

interface FoldedImageProps extends ComponentProps<typeof Image> {
  badge?: string;
  showHorizontalFold?: boolean;
  showTears?: boolean;
}

export function FoldedImage({
  badge,
  showHorizontalFold = false,
  showTears = true,
  className,
  ...imageProps
}: FoldedImageProps) {
  return (
    <div className="relative w-full h-full folded-map-effect">
      <Image {...imageProps} className={`${className || ""} object-cover`} />
      <div className="fold-overlay" aria-hidden="true" />

      {/* Paper holes - worn spots in the paper */}
      {showTears && (
        <>
          {/* Top left hole */}
          <div
            className="paper-hole absolute top-[8%] left-[12%] w-6 h-6 pointer-events-none z-[4]"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(101,67,33,0.2) 40%, transparent 70%)',
              borderRadius: '47% 53% 48% 52% / 43% 49% 51% 57%',
              boxShadow: 'inset 0 1px 3px rgba(101, 67, 33, 0.4), 0 0 2px rgba(101, 67, 33, 0.2)',
            }}
            aria-hidden="true"
          />

          {/* Top right small hole */}
          <div
            className="paper-hole absolute top-[15%] right-[18%] w-4 h-4 pointer-events-none z-[4]"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.25) 0%, rgba(101,67,33,0.15) 45%, transparent 75%)',
              borderRadius: '43% 57% 52% 48% / 48% 45% 55% 52%',
              boxShadow: 'inset 0 1px 2px rgba(101, 67, 33, 0.35), 0 0 1px rgba(101, 67, 33, 0.2)',
            }}
            aria-hidden="true"
          />

          {/* Middle center irregular hole */}
          <div
            className="paper-hole absolute top-[45%] left-[65%] w-5 h-5 pointer-events-none z-[4]"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, rgba(101,67,33,0.18) 42%, transparent 72%)',
              borderRadius: '38% 62% 55% 45% / 52% 41% 59% 48%',
              boxShadow: 'inset 0 1px 3px rgba(101, 67, 33, 0.4), 0 0 2px rgba(101, 67, 33, 0.15)',
            }}
            aria-hidden="true"
          />

          {/* Bottom left corner hole */}
          <div
            className="paper-hole absolute bottom-[12%] left-[8%] w-7 h-7 pointer-events-none z-[4]"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.32) 0%, rgba(101,67,33,0.22) 38%, transparent 68%)',
              borderRadius: '51% 49% 46% 54% / 44% 53% 47% 56%',
              boxShadow: 'inset 0 1px 4px rgba(101, 67, 33, 0.45), 0 0 2px rgba(101, 67, 33, 0.25)',
            }}
            aria-hidden="true"
          />

          {/* Bottom right tiny hole */}
          <div
            className="paper-hole absolute bottom-[20%] right-[25%] w-3 h-3 pointer-events-none z-[4]"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.22) 0%, rgba(101,67,33,0.12) 50%, transparent 80%)',
              borderRadius: '45% 55% 49% 51% / 53% 48% 52% 47%',
              boxShadow: 'inset 0 1px 2px rgba(101, 67, 33, 0.3), 0 0 1px rgba(101, 67, 33, 0.15)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Horizontal fold line with sepia tones */}
      {showHorizontalFold && (
        <div
          className="absolute top-1/2 left-0 w-full h-[3px] pointer-events-none z-[2] -translate-y-1/2"
          style={{
            background: 'linear-gradient(to bottom, rgba(244, 232, 216, 0.5) 0%, transparent 50%, rgba(101, 67, 33, 0.35) 100%)',
            boxShadow: '0 3px 10px rgba(101, 67, 33, 0.25)'
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
