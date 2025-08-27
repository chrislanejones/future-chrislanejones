export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-5 py-12 border-t border-ink/10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-panel card grid place-content-center shadow-soft">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90"
            >
              <path
                d="M3 18l6-9 3 4 2-3 7 8H3z"
                stroke="#8de36b"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-medium">Chris Lane Jones</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/projects" className="nav-link">
            Projects
          </a>
          <a href="mailto:hello@chrislanejones.com" className="nav-link">
            Contact
          </a>
        </div>

        <p className="text-sm text-muted text-center md:text-right">
          © 2025 Chris Lane Jones. Building web apps and exploring trails.
        </p>
      </div>
    </footer>
  );
}
