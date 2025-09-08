"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Banner from "@/components/page/banner";

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-12">
      <Banner
        title="About Me"
        breadcrumbPage="About"
        description="Life on the trails and the web, building modern React applications and leading the local WordPress community."
      />

      {/* Content Grid */}
      <div className="grid md:grid-cols-6 gap-8">
        {/* Main Content - Left Side */}
        <div className="md:col-span-4 grid gap-8">
          {/* Main Story Section */}
          <motion.section
            className="card rounded-3xl bg-panel p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
          </motion.section>

          {/* Office Setup Section */}
          <motion.section
            className="card rounded-3xl bg-panel overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
          </motion.section>

          {/* Community Leadership Section */}
          <motion.section
            className="card rounded-3xl bg-panel overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
          </motion.section>

          {/* Clients Section */}
          <motion.section
            className="card rounded-3xl bg-panel p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Client Experience</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Public Sector</h3>
                <ul className="space-y-2 text-muted">
                  <li>• VITA (Virginia IT Agency)</li>
                  <li>• FDOT (Florida Department of Transportation)</li>
                  <li>• USDOT (U.S. Department of Transportation)</li>
                  <li>• AIS Network (Public Sector Intermediary)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Private Sector</h3>
                <ul className="space-y-2 text-muted">
                  <li>• WorldStrides</li>
                  <li>• AZZLY Rize</li>
                  <li>• Fisher Design & Advertising</li>
                  <li>• Engage Marketing</li>
                  <li>• Yellowstone Landscape</li>
                  <li>• Elvacomm Marketing</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Mountain Life Section */}
          <motion.section
            className="card rounded-3xl bg-panel p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
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
          </motion.section>
        </div>

        {/* Sidebar - Right Side */}
        <div className="md:col-span-2">
          <motion.aside
            className="card rounded-3xl bg-panel p-6 sticky top-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="font-bold text-lg mb-6">Conferences Attended</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/All-Things-Open-2024-Smaller.png"
                    alt="All Things Open 2024"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  All Things Open 2024
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/Tech-Coast-Conference-2024.webp"
                    alt="Tech Coast Conference 2024"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  Tech Coast 2024
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/That-Conference-Logo-LowRes.png"
                    alt="THAT Conference WI 2024"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  THAT Conf WI 2024
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/RenderATL-2024-Logo-Green.png"
                    alt="RenderATL 2024"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  RenderATL 2024
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/WordCamp-US-2023.webp"
                    alt="WordCamp US 2023"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  WordCamp US 2023
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/RVAJS-Conf-Richmond-2023.webp"
                    alt="RVAJS 2023"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  RVAJS 2023
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/Tech-Coast-Conference-2020.webp"
                    alt="Tech Coast Conference 2020"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  Tech Coast 2020
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/Jacksonville-WordCamp-2018-1.webp"
                    alt="Jacksonville WordCamp 2018"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  Jacksonville WC 2018
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/Tech-Coast-Conference-2018.webp"
                    alt="Tech Coast Conference 2018"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  Tech Coast 2018
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/WordCamp-Asheville-2017.webp"
                    alt="WordCamp Asheville 2017"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  WC Asheville 2017
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/WordCamp-Jackonville-2017.webp"
                    alt="Jacksonville WordCamp 2017"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  Jacksonville WC 2017
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base/60 hover:shadow-soft transition group cursor-pointer">
                <div className="rounded-lg bg-ink/10 hover:bg-ink/20 flex items-center justify-center transition-colors">
                  <Image
                    src="/conferences/Echohub-Media-Conference-Dallas-2013.webp"
                    alt="Echo Conference 2013"
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-medium text-xs">
                  Echo Conf 2013
                </span>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
