import { BarChart3, Users, Search, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Activity Analytics",
    description:
      "Comprehensive charts showing commit patterns, contribution streaks, and repository activity over time.",
  },
  {
    icon: Users,
    title: "Multi-User Tracking",
    description:
      "Monitor multiple GitHub users simultaneously and compare their activity levels and contribution patterns.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Quickly find and add users to your tracking list with intelligent search and auto-suggestions.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Get instant notifications and updates when tracked users make new contributions or repositories.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "All data is fetched from public GitHub APIs. We don't store personal information or require GitHub access.",
  },
  {
    icon: Globe,
    title: "Export & Share",
    description:
      "Export activity reports and share insights with your team through various formats and integrations.",
  },
];

const Features = () => (
  <section
    className="gt-section transition-theme"
    style={{ backgroundColor: "var(--color-bg-2)" }}
  >
    <div className="gt-container">
      {/* Header */}
      <div className="mb-16">
        <p className="gt-label mb-3">Features</p>
        <h2 style={{ color: "var(--color-text)", marginBottom: "12px" }}>Powerful, simple tools</h2>
        <p style={{ color: "var(--color-text-2)", maxWidth: "480px", fontSize: "17px" }}>
          Everything you need to track, analyze, and understand GitHub activity patterns.
        </p>
      </div>

      {/* Grid — shadow-separated sections, no card borders */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="transition-theme group"
              style={{
                backgroundColor: "var(--color-surface)",
                padding: "36px 32px",
                boxShadow: "var(--shadow-sm)",
                transition: "box-shadow 200ms ease, background-color 200ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)";
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded mb-6"
                style={{ backgroundColor: "var(--color-bg-3)", color: "var(--color-text)" }}
              >
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "17px",
                  color: "var(--color-text)",
                  marginBottom: "10px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "15px", color: "var(--color-text-2)", lineHeight: 1.65 }}>
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;