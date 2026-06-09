import { useState, useContext } from "react";
import { Github, Mail, Phone, Send, X, CheckCircle } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

function Contact() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject) newErrors.subject = "Please select a subject";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowPopup(true);

    // Reset form
    setFormData({ fullName: "", email: "", subject: "", message: "" });
    setErrors({});

    // Auto-close popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-y-auto ${
        mode === "dark"
          ? "bg-[#0A0A0F] bg-[radial-gradient(#1F2937_0.5px,transparent_1px)] bg-[length:4px_4px]"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 shadow-xl overflow-hidden rounded-2xl ${
                mode === "dark"
                  ? "bg-zinc-900"
                  : "bg-white border border-slate-200"
              }`}
            >
              <img
                src="/crl-icon.png"
                alt="GitHub Tracker Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Get In Touch
            </h1>
          </div>
          <p className="max-w-xl mx-auto text-lg text-slate-400">
            Have questions about GitHub Tracker? Need help with your dashboard,
            or want to suggest new features? Our team is here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Support Channels
              </h2>
              <p className="text-slate-400">
                Choose the best way to reach us based on your needs
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <div
                className={`group p-6 rounded-3xl backdrop-blur-xl border transition-all hover:border-slate-700 ${
                  mode === "dark"
                    ? "bg-zinc-900/70 border-slate-800 hover:bg-zinc-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Phone className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      Phone Support
                    </h3>
                    <p className="text-slate-400">(555) 123-4567</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mon–Fri, 9AM–5PM PST
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                className={`group p-6 rounded-3xl backdrop-blur-xl border transition-all hover:border-slate-700 ${
                  mode === "dark"
                    ? "bg-zinc-900/70 border-slate-800 hover:bg-zinc-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      Email Support
                    </h3>
                    <a
                      href="mailto:support@githubtracker.dev"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      support@githubtracker.dev
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      Responses within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* GitHub */}
              <div
                className={`group p-6 rounded-3xl backdrop-blur-xl border transition-all hover:border-slate-700 ${
                  mode === "dark"
                    ? "bg-zinc-900/70 border-slate-800 hover:bg-zinc-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      GitHub Issues
                    </h3>
                    <a
                      href="https://github.com/yourorg/githubtracker/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      github.com/yourorg/githubtracker
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      Report bugs • Request features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className={`p-8 md:p-10 rounded-3xl shadow-2xl border backdrop-blur-xl ${
                mode === "dark"
                  ? "bg-zinc-900/80 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <h2 className="text-2xl font-semibold text-white mb-8">
                Send a Message
              </h2>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Alex Rivera"
                    className={`w-full px-4 py-3.5 rounded-2xl text-base bg-zinc-950 border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      errors.fullName
                        ? "border-red-500"
                        : "border-slate-700 focus:border-purple-500"
                    } text-white placeholder:text-slate-500`}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm mt-1.5">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@company.com"
                    className={`w-full px-4 py-3.5 rounded-2xl text-base bg-zinc-950 border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      errors.email
                        ? "border-red-500"
                        : "border-slate-700 focus:border-purple-500"
                    } text-white placeholder:text-slate-500`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1.5">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 rounded-2xl text-base bg-zinc-950 border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      errors.subject
                        ? "border-red-500"
                        : "border-slate-700 focus:border-purple-500"
                    } text-white`}
                  >
                    <option value="" disabled>
                      Select a topic...
                    </option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Billing">Billing / Account</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1.5">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Tell us more about your question or feedback..."
                    className={`w-full px-4 py-3.5 rounded-3xl text-base resize-y min-h-[140px] bg-zinc-950 border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      errors.message
                        ? "border-red-500"
                        : "border-slate-700 focus:border-purple-500"
                    } text-white placeholder:text-slate-500`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1.5">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.985] ${
                    isSubmitting
                      ? "bg-purple-600/70 cursor-wait"
                      : "bg-purple-600 hover:bg-purple-500"
                  } text-white shadow-lg shadow-purple-500/30`}
                >
                  {isSubmitting ? (
                    <>
                      Sending
                      <span className="animate-pulse">...</span>
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] max-w-md bg-emerald-900/95 border border-emerald-700 text-emerald-100 rounded-2xl p-6 shadow-2xl flex gap-4 items-start`}
        >
          <CheckCircle className="w-7 h-7 mt-0.5 flex-shrink-0 text-emerald-400" />
          <div className="flex-1">
            <div className="font-semibold">Message Sent Successfully</div>
            <p className="text-emerald-100/80 text-sm mt-1">
              Thank you! We'll get back to you within 24 hours.
            </p>
          </div>
          <button
            onClick={handleClosePopup}
            className="text-emerald-300 hover:text-white text-xl leading-none p-1 -mt-1 -mr-1"
            aria-label="Close"
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
}

export default Contact;
