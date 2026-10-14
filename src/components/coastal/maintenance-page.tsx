import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Code2,
  ShieldCheck,
  Wrench,
  Gauge,
  ChartNoAxesCombined,
  MapPin,
} from "lucide-react";
import ContactForm from "@/components/page/contact-form";
import ClientSliderContent from "@/components/main/client-slider-content";
import styles from "./interior.module.css";
import { Button } from "@/components/ui/button";

type Service = { title: string; description: string; details: string };
const icons = [Code2, ShieldCheck, Wrench, Gauge, ChartNoAxesCombined, MapPin];

export function MaintenancePage({
  kind,
  plus,
  image,
  title,
  services,
  basicFeatures,
  plusFeatures,
}: {
  kind: "React" | "WordPress";
  plus: "Performance" | "SEO";
  image: string;
  title: string;
  services: Service[];
  basicFeatures: string[];
  plusFeatures: string[];
}) {
  return (
    <>
      <section className={styles.serviceHero}>
        <div>
          <Image
            src={image}
            alt={`${kind} website planning`}
            fill
            sizes="(max-width: 767px) 90vw, 50vw"
            priority
          />
        </div>
        <div className={styles.serviceHeroCopy}>
          <h2>{title}</h2>
          <p>
            Regular updates, security checks, performance improvements, and
            technical support for your{" "}
            {kind === "React" ? "application" : "website"}.
          </p>
          <div className={styles.actions}>
            <Button asChild variant="pill">
              <a href="#plans">
                Explore the plans <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>What maintenance covers</h2>
        <div className={styles.serviceGrid}>
          {services.map((service, i) => {
            const Icon = icons[i];
            return (
              <div className={styles.serviceItem} key={service.title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p>{service.details}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className={styles.section} id="plans">
        <h2>Choose your plan</h2>
        <div className={styles.priceGrid}>
          {[
            { title: "The Action Plan", price: 200, features: basicFeatures },
            {
              title: `Action Plan Plus · ${plus}`,
              price: 250,
              features: plusFeatures,
            },
          ].map((plan) => (
            <div className={styles.priceCard} key={plan.title}>
              <h3>{plan.title}</h3>
              <div className={styles.price}>
                ${plan.price}
                <small> / month</small>
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="pill">
                <a href="#contact">
                  Discuss a plan <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <section
        className={`${styles.panel} ${styles.section}`}
        aria-label="Clients"
      >
        <ClientSliderContent />
      </section>
      <section className={styles.serviceContact} id="contact">
        <h2>Let’s talk about your {kind === "React" ? "app" : "website"}.</h2>
        <ContactForm
          variant="maintenance"
          serviceType={kind}
          plusPlanLabel={plus}
        />
      </section>
    </>
  );
}
