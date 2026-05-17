import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => (
  <section
    className="transition-theme"
    style={{
      backgroundColor: "var(--color-bg)",
      borderBottom: "1px solid var(--color-border)",
      padding: "96px 24px",
    }}
  >
    <div className="gt-container">
      <div className="max-w-3xl">
        {/* Label */}
        <p className="gt-label mb-6">Open Source · GitHub Analytics</p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: "var(--color-text)",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          Track GitHub Activity{" "}
          <span style={{ color: "var(--color-primary)" }}>Like Never Before</span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "18px",
            color: "var(--color-text-2)",
            maxWidth: "560px",
            lineHeight: 1.7,
            marginBottom: "48px",
            fontFamily: "var(--font-body)",
          }}
        >
          Monitor commits, pull requests, and issues across repositories.
          Built for developers and project managers who care about contribution patterns.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link to="/track" className="gt-btn gt-btn-primary flex items-center gap-2">
            <Search size={16} />
            Start Tracking
          </Link>
          <Link to="/about" className="gt-btn gt-btn-outline flex items-center gap-2">
            Learn more
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="flex flex-wrap gap-8 mt-16 pt-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {[
            { value: "100%", label: "Open source" },
            { value: "Public API", label: "No data stored" },
            { value: "Real-time", label: "GitHub data" },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--color-text)",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  color: "var(--color-text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;