import Image from "next/image";
import { Download } from "lucide-react";
import { logoVariants } from "@/data/logo-variants";
import styles from "@/components/coastal/interior.module.css";

export default function LogoPage() {
  return (
    <div className={styles.postGrid}>
      {logoVariants.map((variant) => (
        <article className={styles.post} key={variant.title}>
          <div className={styles.logoMedia}>
            <Image
              className={
                variant.title === "Tracing Mountain"
                  ? styles.lineArt
                  : undefined
              }
              src={variant.image}
              alt={variant.imageAlt}
              fill
              sizes="(max-width: 767px) 90vw, 50vw"
            />
          </div>
          <h2>{variant.title}</h2>
          <p>{variant.description}</p>
          <a className={styles.textLink} href={variant.image} download>
            Download image <Download size={17} aria-hidden="true" />
          </a>
        </article>
      ))}
    </div>
  );
}
