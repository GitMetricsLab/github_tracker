const steps = [
  {
    number: "01",
    title: "Search Users",
    description:
      "Enter a GitHub username to load their public activity — issues, pull requests, and contribution data.",
  },
  {
    number: "02",
    title: "Monitor Activity",
    description:
      "View insights on commits, pull requests, issues, and other GitHub activities in a structured table.",
  },
  {
    number: "03",
    title: "Analyze Insights",
    description:
      "Filter by status, date, and repository. Export or share reports to understand development patterns.",
  },
];

const HowItWorks = () => (
  <section
    className="gt-section transition-theme"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div className="gt-container">
      {/* Header */}
      <div className="mb-16">
        <p className="gt-label mb-3">How it works</p>
        <h2 style={{ color: "var(--color-text)" }}>Simple three-step process</h2>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-0 relative">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative"
            style={{
              padding: "0 0 0 0",
            }}
          >
            {/* Connector line (desktop) */}
            {i < steps.length - 1 && (
              <div
                className="hidden md:block absolute top-8 right-0 w-px"
                style={{ height: "calc(100% - 4rem)", backgroundColor: "var(--color-border)" }}
              />
            )}

            <div style={{ paddingRight: i < steps.length - 1 ? "48px" : "0", paddingLeft: i > 0 ? "48px" : "0" }}>
              {/* Number */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  color: "var(--color-primary)",
                  marginBottom: "16px",
                }}
              >
                {step.number}
              </p>

              {/* Divider */}
              <div
                style={{
                  width: "32px",
                  height: "2px",
                  backgroundColor: "var(--color-accent)",
                  marginBottom: "20px",
                }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--color-text)",
                  marginBottom: "12px",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "15px", color: "var(--color-text-2)", lineHeight: 1.65 }}>
                {step.description}
              </p>
            </div>

            {/* Mobile separator */}
            {i < steps.length - 1 && (
              <div
                className="md:hidden my-10"
                style={{ height: "1px", backgroundColor: "var(--color-border)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;