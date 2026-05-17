import { useState } from "react";
import { Github, Mail, Phone, Send, CheckCircle, X } from "lucide-react";

const contactItems = [
  {
    title: "Phone Support",
    detail: "(123) 456-7890",
    sub: "Mon–Fri, 9AM–6PM EST",
    Icon: Phone,
  },
  {
    title: "Email Us",
    detail: "support@githubtracker.com",
    sub: "We'll respond within 24 hours",
    Icon: Mail,
  },
  {
    title: "GitHub Issues",
    detail: "github.com/GitMetricsLab/github_tracker",
    sub: "Report bugs & feature requests",
    Icon: Github,
  },
];

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen w-full transition-theme" style={{ backgroundColor: "var(--color-bg)" }}>

      {/* Header */}
      <section
        className="transition-theme"
        style={{ borderBottom: "1px solid var(--color-border)", padding: "80px 24px 64px", backgroundColor: "var(--color-bg-2)" }}
      >
        <div className="gt-container">
          <p className="gt-label mb-4">Contact</p>
          <h1 style={{ color: "var(--color-text)", marginBottom: "16px" }}>Get in touch</h1>
          <p style={{ fontSize: "17px", color: "var(--color-text-2)", maxWidth: "480px" }}>
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="gt-section">
        <div className="gt-container">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Info */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "20px",
                  color: "var(--color-text)", marginBottom: "32px",
                }}
              >
                Contact information
              </h2>

              <div
                className="divide-y transition-theme"
                style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
              >
                {contactItems.map(({ title, detail, sub, Icon }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 py-6 transition-theme"
                  >
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded shrink-0"
                      style={{ backgroundColor: "var(--color-bg-3)", color: "var(--color-text)" }}
                    >
                      <Icon size={16} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "15px",
                          color: "var(--color-text)", marginBottom: "2px",
                        }}
                      >
                        {title}
                      </p>
                      <p style={{ fontSize: "14px", color: "var(--color-text-2)" }}>{detail}</p>
                      <p style={{ fontSize: "13px", color: "var(--color-text-3)" }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "20px",
                  color: "var(--color-text)", marginBottom: "32px",
                }}
              >
                Send a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}
                    >
                      Full name
                    </label>
                    <input
                      id="name" type="text" name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="gt-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="c-email"
                      style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}
                    >
                      Email address
                    </label>
                    <input
                      id="c-email" type="email" name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="gt-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}
                  >
                    Subject
                  </label>
                  <select
                    id="subject" name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="gt-input"
                    style={{ cursor: "pointer" }}
                  >
                    <option value="" disabled>Select a subject</option>
                    <option>General Inquiry</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: "6px" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message" name="message"
                    rows={5}
                    placeholder="Type your message here…"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="gt-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gt-btn gt-btn-primary flex items-center gap-2"
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Sending…" : (
                    <><Send size={15} /> Send message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success toast */}
      {showSuccess && (
        <div
          role="alert"
          style={{
            position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)",
            zIndex: 100, display: "flex", alignItems: "center", gap: "12px",
            backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-xl)", borderRadius: "var(--radius-md)",
            padding: "14px 20px", minWidth: "280px",
          }}
        >
          <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0 }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-text)", flex: 1 }}>
            Message sent! We'll be in touch soon.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            style={{ color: "var(--color-text-3)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Contact;