import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoastalPageShell } from "@/components/coastal/page-shell";
import coastal from "@/components/coastal/coastal.module.css";
import styles from "@/components/coastal/interior.module.css";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <CoastalPageShell>
      <header className={coastal.pageIntro}>
        <h1>404 Music Lounge</h1>
        <p>
          This page could not be found, but you can still play Japanese
          Breakfast.
        </p>
      </header>
      <div className={styles.content}>
        <section className={styles.panel}>
          <h2>Japanese Breakfast, live on SNL</h2>
          <p>“Be Sweet” and “Paprika”</p>
          <div className="relative aspect-video my-6 overflow-hidden rounded-xl">
            <iframe
              src="https://fast.wistia.com/embed/iframe/wnod0xd4m4"
              title="Japanese Breakfast live on SNL: Be Sweet and Paprika"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <div className={styles.actions}>
            <Button asChild variant="pill">
              <Link href="/">
                Back home <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Link className={styles.textLink} href="/site-map">
              Explore the site <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </CoastalPageShell>
  );
}
