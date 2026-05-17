import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GitBranch } from "lucide-react";

function Footer() {
  return (
    <footer
      className="transition-theme"
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        boxShadow: "0 -2px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="gt-container px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center w-7 h-7 rounded"
              style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}
            >
              <GitBranch size={14} strokeWidth={2.5} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "15px",
                color: "var(--color-text)",
              }}
            >
              GitHub<span style={{ color: "var(--color-primary)" }}>Tracker</span>
            </span>
          </div>

          {/* Links */}
          <nav
            className="flex flex-wrap justify-center gap-6"
            aria-label="Footer navigation"
          >
            {[
              { to: "/", label: "Home" },
              { to: "/track", label: "Tracker" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium transition-theme"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* GitHub */}
          <a
            href="https://github.com/GitMetricsLab/github_tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-theme"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-3)", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
            aria-label="View on GitHub"
          >
            <FaGithub size={16} />
            <span>View on GitHub</span>
          </a>
        </div>

        <div
          className="py-4 text-center"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-3)" }}
          >
            © {new Date().getFullYear()} GitHub Tracker. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;