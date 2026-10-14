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
import type { GalleryPhoto } from "@/components/page/gallery-drawer";
import styles from "./coastal.module.css";
import { Button } from "@/components/ui/button";

export function ConferencePanel({ photos, title = "Conference fan shots", description = "People I’ve met along the way." }: { photos: GalleryPhoto[]; title?: string; description?: string }) {
  const [index, setIndex] = useState(0);
  const current = photos[index % photos.length];
  if (!current) return null;
  const next = () => setIndex((value) => (value + 1) % photos.length);
  const previous = () =>
    setIndex((value) => (value - 1 + photos.length) % photos.length);

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          variant="circle"
          size="sm"
          aria-label="Open conference photo gallery"
        >
          <Images size={20} aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={styles.conferencePanel}
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
        <DrawerClose asChild>
          <button
            type="button"
            className={styles.conferenceClose}
            aria-label="Close photo gallery"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </DrawerClose>
        <div className={styles.conferencePanelHeader}>
          <div>
            <DrawerTitle className={styles.conferencePanelTitle}>
              {title}
            </DrawerTitle>
            <DrawerDescription className={styles.conferencePanelDescription}>
              {description}
            </DrawerDescription>
          </div>
        </div>
        <div className={styles.conferencePanelInner}>
          <div className={styles.conferencePanelBody}>
            <div>
              <figure className={styles.conferencePhoto}>
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 767px) 92vw, 780px"
                />
              </figure>
              <div className={styles.conferencePhotoFooter}>
                <div aria-live="polite">
                  <p>{current.description}</p>
                  <span>
                    {(index % photos.length) + 1} / {photos.length}
                  </span>
                </div>
                <div className={styles.conferencePhotoControls}>
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
              className={styles.conferenceThumbnails}
              aria-label="Choose a conference photo"
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
