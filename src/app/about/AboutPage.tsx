"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { HalfWidthLayout, FullWidthLayout } from "@/components/page/layout";

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="About Me"
        breadcrumbPage="About"
        description="Life on the trails and the web, building modern React applications and leading the local WordPress community."
      />

      <FullWidthLayout>
        {/* Main Story Section */}
        <Card size="page-full" delay={0.1}>
          <h2 className="text-2xl font-bold mb-6">
            From Video Production to Web Development
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              I am passionate about design and development on React platforms;
              Next.js and Astro. I also work on WordPress websites. I'm big on
              learning new things in a rapid-paced, ever-changing tech
              industry – never a dull moment in JavaScript, PHP, and their
              frameworks.
            </p>
            <p>
              In 2013, I graduated after three communications internships at
              the University of North Florida. I started my career in video
              editing but after spending hours working and designing my
              website, I decided to switch careers to build websites. I work
              with React Frameworks like Next.js and WordPress websites.
            </p>
          </div>
        </Card>

        {/* Office Setup Section */}
        <Card size="page-full" delay={0.2} padding="none" className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-80">
              <Image
                src="/gallery/Standing-Desk-Setup.webp"
                alt="Adjustable Standing Desk with Two Displays and Laptop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-4">My Home Office Setup</h3>
              <p className="text-muted leading-relaxed">
                Working remotely from Louisa, Virginia with a dual-monitor
                standing desk setup that keeps me productive and healthy
                during long development sessions.
              </p>
            </div>
          </div>
        </Card>

        {/* Community Leadership Section */}
        <Card size="page-full" delay={0.3} padding="none" className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 flex flex-col justify-center order-2 md:order-1">
              <h3 className="text-xl font-bold mb-4">Community Leadership</h3>
              <p className="text-muted leading-relaxed mb-4">
                I lead Richmond's local WordPress meetup and host monthly
                meetups since January 2022. We discuss WordPress topics,
                general web knowledge, and provide support for developers in
                the Glen Allen area.
              </p>
              <p className="text-muted leading-relaxed">
                Previously served as Digital Director for The JOMM
                (Jacksonville Online Marketing Meetup), where I increased
                monthly attendance and website engagement.
              </p>
            </div>
            <div className="relative h-64 md:h-80 order-1 md:order-2">
              <Image
                src="/gallery/Richmond-WordPress-Meetup.webp"
                alt="Richmond WordPress Meetup"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </Card>

        {/* Mountain Life Section */}
        <Card size="page-full" delay={0.4}>
          <h2 className="text-2xl font-bold mb-6">
            Living in the Shenandoah Mountains
          </h2>
          <div className="space-y-6">
            <p className="text-muted leading-relaxed">
              Our dreams came true five years ago when I moved to
              Harrisonburg, Virginia. I later moved closer to Richmond, VA and
              now work remotely in the small town of Louisa, Virginia. My wife
              runs a local equine-assisted private practice counseling service
              – Heaven's Rays Ministries. In Louisa, I am close to several
              cities and the Shenandoah mountains.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src="/gallery/Me-on-a-Bike-Trail.webp"
                  alt="Riding on Bike Trails by Piney River Trailhead"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 bg-base/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                  Bike Trails by Piney River
                </div>
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src="/gallery/Becky-and-I-at-Glacier-National-Park.webp"
                  alt="Becky and I at Glacier National Park"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 bg-base/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                  Glacier National Park
                </div>
              </div>
            </div>

            <p className="text-muted leading-relaxed">
              I love adventure and traveling. In 2016 my wife (Becky) and I
              traveled to the mountains in Washington and Oregon. The trails
              of Cannon Beach and the cliffs were the trip's highlights. After
              this trip, we started looking for work in the towns adjacent to
              the Appalachian Mountains.
            </p>
          </div>
        </Card>
      </FullWidthLayout>
    </main>
  );
}
