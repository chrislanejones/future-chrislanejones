"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Images, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShoreStrip } from "./beach-banner";
import styles from "./coastal.module.css";
import { Button } from "@/components/ui/button";

export type GalleryPhoto = {
  src: string;
  alt: string;
  description: string;
  width?: number;
  height?: number;
};

// The site's one photo gallery: a bottom drawer with the banner's shoreline
// along its top, a large photo, captions, arrows and thumbnails.
export function GalleryPanel({
  photos,
  title,
  description,
  label = "Open photo gallery",
}: {
  photos: GalleryPhoto[];
  title: string;
  description?: string;
  /** Accessible name for the round trigger button. */
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const current = photos[index % photos.length];
  if (!current) return null;
  const next = () => setIndex((value) => (value + 1) % photos.length);
  const previous = () =>
    setIndex((value) => (value - 1 + photos.length) % photos.length);

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="circle" size="sm" aria-label={label}>
          <Images size={20} aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={styles.photoPanel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            previous();
          }
        }}
      >
        <ShoreStrip className={styles.photoPanelShore} />
        <div className={styles.photoPanelHeader}>
          <DrawerTitle className={styles.photoPanelTitle}>{title}</DrawerTitle>
          {description && (
            <DrawerDescription className={styles.photoPanelDescription}>
              {description}
            </DrawerDescription>
          )}
          <DrawerClose asChild>
            <button
              type="button"
              className={styles.photoPanelClose}
              aria-label="Close photo gallery"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </DrawerClose>
        </div>
        <div className={styles.photoPanelInner}>
          <div className={styles.photoPanelBody}>
            <div>
              <figure className={styles.photoPanelImage}>
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 767px) 92vw, 780px"
                />
              </figure>
              <div className={styles.photoPanelFooter}>
                <div aria-live="polite">
                  <p>{current.description}</p>
                  <span>
                    {(index % photos.length) + 1} / {photos.length}
                  </span>
                </div>
                <div className={styles.photoPanelControls}>
                  <button
                    type="button"
                    onClick={previous}
                    aria-label="Previous photo"
                  >
                    <ArrowLeft size={19} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={next} aria-label="Next photo">
                    <ArrowRight size={19} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={styles.photoPanelThumbs}
              aria-label="Choose a photo"
              data-vaul-no-drag
            >
              {photos.map((photo, photoIndex) => (
                <button
                  type="button"
                  key={`${photo.src}-${photoIndex}`}
                  aria-label={`Show ${photo.description}`}
                  aria-pressed={index % photos.length === photoIndex}
                  onClick={() => setIndex(photoIndex)}
                >
                  <Image src={photo.src} alt="" fill sizes="110px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
