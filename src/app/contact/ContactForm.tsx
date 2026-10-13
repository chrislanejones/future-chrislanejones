"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/page/contact-form";
import { SocialIconRow } from "@/components/page/social-icon-row";
import styles from "@/components/coastal/interior.module.css";

export default function PageContactForm() {
  return (
    <div className={styles.contactLayout}>
      <aside className={styles.contactAside}>
        <div className={styles.contactPhoto}>
          <Image
            src="/gallery/Whiteboard-Notes.webp"
            alt="Planning web projects on a whiteboard"
            fill
            sizes="(max-width: 767px) 90vw, 40vw"
          />
        </div>
        <h2>What are you working on?</h2>
        <p>
          Tell me about your website, application, or the problem you need help
          solving.
        </p>
        <div className={styles.actions}>
          <SocialIconRow surface="footer" />
        </div>
        <div className={styles.actions}>
          <Link className={styles.textLink} href="/projects">
            Explore my projects <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </aside>
      <ContactForm variant="full" />
    </div>
  );
}
