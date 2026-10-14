"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Menu, Waves } from "lucide-react";
import type { HeaderNavItem } from "@/components/page/links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import styles from "./mobile-navigation.module.css";

function matchesPath(pathname: string, href?: string) {
  return Boolean(href && (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))));
}

export function MobileNavigation({ items, pathname }: { items: HeaderNavItem[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const contact = items.find((item) => !item.children?.length && item.href === "/contact");

  useEffect(() => {
    const desktop = matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const link = (item: HeaderNavItem) => (
    <Link
      key={item.href}
      href={item.href!}
      className={styles.link}
      aria-current={matchesPath(pathname, item.href) ? "page" : undefined}
      onClick={() => setOpen(false)}
      target={item.isExternal ? "_blank" : undefined}
      rel={item.isExternal ? "noopener noreferrer" : undefined}
    >
      <span>{item.label}</span>
      {matchesPath(pathname, item.href) ? <Check size={18} aria-hidden="true" /> : item.isExternal ? <ArrowUpRight size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
    </Link>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={styles.trigger} aria-label="Open navigation">
        <Menu size={22} aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="top" data-coastal-theme className={styles.menu} closeButtonClassName={styles.close}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand} onClick={() => setOpen(false)}><Waves size={34} aria-hidden="true" /><span>Chris Lane Jones<small>Senior web engineer</small></span></Link>
          <SheetTitle className="sr-only">Site menu</SheetTitle>
          <SheetDescription className="sr-only">Pages on chrislanejones.com</SheetDescription>
        </header>
        <nav aria-label="Mobile navigation" className={styles.navigation}>
          {items.filter((item) => !item.children?.length && item !== contact).map(link)}
          {items.filter((item) => item.children?.length).map((item) => (
            <section className={styles.group} key={item.label} aria-label={item.label}>
              <h2 className={styles.groupLabel}>{item.label}</h2>
              {item.children!.map(link)}
            </section>
          ))}
        </nav>
        <footer className={styles.footer}>
          <p>Have something in mind?</p>
          {contact && <Button asChild variant="primary" className={styles.contact}><Link href={contact.href!} onClick={() => setOpen(false)} aria-current={pathname === contact.href ? "page" : undefined}>{contact.label}<ArrowUpRight size={20} aria-hidden="true" /></Link></Button>}
          <Link href="/color-guide" onClick={() => setOpen(false)} className={styles.guide}>View the color & type guide <ArrowRight size={16} aria-hidden="true" /></Link>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
