import { Lightbulb, Users, Settings, Search } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Simple Issue Tracking",
    description: "Track your GitHub issues seamlessly with intuitive filters and search options.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Collaborate with your team, manage issues and pull requests effectively.",
  },
  {
    icon: Settings,
    title: "Customizable Settings",
    description: "Customize your issue tracking workflow to match your team's needs.",
  },
];

const About = () => (
  <div className="min-h-screen w-full transition-theme" style={{ backgroundColor: "var(--color-bg)" }}>

    {/* Hero */}
    <section
      className="transition-theme"
      style={{
        borderBottom: "1px solid var(--color-border)",
        padding: "80px 24px",
        backgroundColor: "var(--color-bg-2)",
      }}
    >
      <div className="gt-container">
        <p className="gt-label mb-4">About</p>
        <h1 style={{ color: "var(--color-text)", maxWidth: "600px", marginBottom: "20px" }}>
          Built to simplify GitHub activity tracking
        </h1>
        <p style={{ fontSize: "17px", color: "var(--color-text-2)", maxWidth: "520px", lineHeight: 1.7 }}>
          Welcome to <strong style={{ color: "var(--color-text)" }}>GitHub Tracker</strong> — your smart solution to monitor GitHub issues and pull requests without chaos.
        </p>
      </div>
    </section>

    {/* Mission */}
    <section className="gt-section transition-theme" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="gt-container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="gt-label mb-4">Our Mission</p>
            <h2 style={{ color: "var(--color-text)", marginBottom: "20px" }}>
              Focus on the work, not the tool
            </h2>
            <p style={{ fontSize: "16px", color: "var(--color-text-2)", lineHeight: 1.75 }}>
              We aim to provide an efficient and user-friendly way to track GitHub issues and pull requests.
              Our goal is to make it easy for developers to stay organized and focused on their projects
              without getting bogged down by the details.
            </p>
          </div>
          <div
            className="flex items-center justify-center rounded p-16"
            style={{ backgroundColor: "var(--color-bg-2)", border: "1px solid var(--color-border)" }}
          >
            <Lightbulb size={64} style={{ color: "var(--color-text-3)", strokeWidth: 1 }} />
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section
      className="gt-section transition-theme"
      style={{ backgroundColor: "var(--color-bg-2)", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="gt-container">
        <div className="mb-12">
          <p className="gt-label mb-3">What we do</p>
          <h2 style={{ color: "var(--color-text)" }}>Core capabilities</h2>
        </div>

        <div
          className="grid md:grid-cols-3 gap-px"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="transition-theme"
                style={{
                  backgroundColor: "var(--color-surface)",
                  padding: "40px 32px",
                  boxShadow: "var(--shadow-sm)",
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
                    fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "17px",
                    color: "var(--color-text)", marginBottom: "10px",
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
  </div>
);

export default About;