import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaCodepen,
  FaDev,
  FaWordpress,
  FaHome,
  FaTools,
  FaHeart,
  FaChrome,
} from "react-icons/fa";
import { SiBluesky, SiBuymeacoffee } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function LinkGrid() {
  return (
    <div className="space-y-6">
      {/* Card 1: Main Avatar and Info */}
      <div className="card glass shadow-passive p-8">
        <div className="grid grid-cols-[80px_1fr] gap-4 items-center mb-6">
          <img
            alt="Chris Lane Jones"
            loading="lazy"
            width="80"
            height="80"
            decoding="async"
            className="h-20 w-20 rounded-2xl ring-2 ring-white/5 object-cover"
            style={{ color: "transparent" }}
            srcSet="/_next/image?url=%2FProfessional-Photo-of-Chris-Lane-Jones.webp&w=96&q=75 1x, /_next/image?url=%2FProfessional-Photo-of-Chris-Lane-Jones.webp&w=256&q=75 2x"
            src="/_next/image?url=%2FProfessional-Photo-of-Chris-Lane-Jones.webp&w=256&q=75"
          />
          <div className="flex flex-col justify-center">
            <div className="font-bold text-xl text-white">Chris Lane Jones</div>
            <div className="text-md text-white/70">
              UX/UI Web Design and Development
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-xl md:text-xl font-bold leading-tight text-white">
            I Consult, Design, and Develop Web Interfaces for Businesses and
            Government Agencies.
          </h2>
          <p className="text-regular max-w-prose mx-auto text-white/70">
            I Build with React and WordPress — then escape to the Mountains. 🏔️
          </p>
        </div>
      </div>

      {/* Card 2: Social Links */}
      <div className="card glass shadow-passive p-6">
        <h3 className="text-xl font-bold mb-6 text-center text-white">
          Connect With Me
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://chrislanejones.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaHome className="w-4 h-4 mr-2" />
              Home
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://x.com/cljwebdev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-4 h-4 mr-2" />
              𝕏
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://bsky.app/profile/chrislanejones.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiBluesky className="w-4 h-4 mr-2" />
              BlueSky
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://github.com/chrislanejones"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://www.linkedin.com/in/chrislanejones/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://www.youtube.com/@chrislanejones"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="w-4 h-4 mr-2" />
              YouTube
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://www.tiktok.com/@cljwebdev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="w-4 h-4 mr-2" />
              TikTok
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://codepen.io/chrislanejones"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaCodepen className="w-4 h-4 mr-2" />
              CodePen
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://dev.to/chrislanejones"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDev className="w-4 h-4 mr-2" />
              Dev.to
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://buymeacoffee.com/chrislanejones"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiBuymeacoffee className="w-4 h-4 mr-2" />
              Coffee
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://chrislanejones.com/wordpress-site-maintenance/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTools className="w-4 h-4 mr-2" />
              WP Service
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-center h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors text-white"
            asChild
          >
            <a
              href="https://chrislanejones.com/category/blog-post/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWordpress className="w-4 h-4 mr-2" />
              Blog
            </a>
          </Button>
        </div>
      </div>

      {/* Card 3: Current Chrome Tabs */}
      <div className="card glass shadow-passive p-6">
        <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center space-x-2 text-white">
          <FaChrome className="w-6 h-6" />
          <span>Chrome Tabs I Left Open...</span>
        </h3>
        <div className="space-y-3">
          <Button
            variant="base"
            className="justify-between h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors w-full"
            asChild
          >
            <a
              href="https://effect.website/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span className="text-white">Effect - TypeScript Library</span>
              <span className="text-white/50 text-sm">effect.website</span>
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-between h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors w-full"
            asChild
          >
            <a
              href="https://github.com/aulianza/aulianza.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span className="text-white">aulianza.id</span>
              <span className="text-white/50 text-sm">
                https://github.com/aulianza/aulianza.id
              </span>
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-between h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors w-full"
            asChild
          >
            <a
              href="https://www.fffuel.co/ooorganize/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span className="text-white">
                ooorganize SVG grid pattern gen
              </span>
              <span className="text-white/50 text-sm">
                https://www.fffuel.co/ooorganize/
              </span>
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-between h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors w-full"
            asChild
          >
            <a
              href="https://tweakcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span className="text-white">Tweakcn</span>
              <span className="text-white/50 text-sm">https://tweakcn.com</span>
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-between h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors w-full"
            asChild
          >
            <a
              href="https://pro.aceternity.com/products/navbars"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span className="text-white">Aceternity UI</span>
              <span className="text-white/50 text-sm">aceternity.com</span>
            </a>
          </Button>

          <Button
            variant="base"
            className="justify-between h-auto p-3 rounded-xl bg-base/60 hover:bg-base/80 transition-colors w-full"
            asChild
          >
            <a
              href="https://learnxinyminutes.com/zig/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
            >
              <span className="text-white">Learn X in Y minutes</span>
              <span className="text-white/50 text-sm">
                https://learnxinyminutes.com/zig/
              </span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
