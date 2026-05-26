import { useState, useContext, useEffect } from "react";
import {
  Github,
  Mail,
  Phone,
  Send,
  X,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

function Contact() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Controlled form state tracking
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;
  const isDark = mode === "dark";

  // FIX: Correctly handle the auto-dismiss popup timer within an effect lifestyle cleanup pattern
  useEffect(() => {
    if (!showPopup) return;

    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // FIX: Wrapped logic inside a proper try/catch/finally block to ensure states reset safely on network failures
    try {
      // Simulate API pipeline delay 
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowPopup(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to route contact payload data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col items-center justify-center py-12 px-4 transition-colors duration-300 overflow-x-hidden ${
        isDark ? "bg-[#090d16] text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Neo-Grid Background Overlay */}
      <div className="absolute inset-0 opacity-25 dark:opacity-[0.15] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Smooth Dynamic Radial Glow Aura */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[140px] opacity-20 pointer-events-none transition-all duration-700 ${
          focusedField === "message" 
            ? "bg-indigo-500 scale-110" 
            : focusedField === "email" 
            ? "bg-blue-500 scale-105" 
            : "bg-purple-500"
        }`} 
      />

      {/* Main Structural Container */}
      <div className="relative z-10 w-full max-w-4xl space-y-8">
        
        {/* Exterior Main Page Context Heading Block */}
        <div className="text-center space-y-2">
          <h2 className={`text-xs uppercase font-bold tracking-widest ${isDark ? "text-purple-400" : "text-purple-600"}`}>
            Contact Hub
          </h2>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
            Get in touch with us
          </h1>
          <p className={`text-sm sm:text-base max-w-lg mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Have an open-source sync idea, tracking request, or ran into a system error? We are listening.
          </p>
        </div>

        {/* Central Core Glassmorphism Canvas Card */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Left Interactive Meta Sidebar */}
          <div className={`lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r ${
            isDark ? "border-slate-800/60 bg-slate-950/20" : "border-slate-200/60 bg-slate-50/50"
          }`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                  isDark ? "bg-slate-900 border-slate-800" : "bg-white border-purple-100"
                }`}>
                  <img src="/crl-icon.png" alt="GitHub Tracker Logo" className="w-6 h-6 object-contain" />
                </div>
                <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  GitHub Tracker
                </h3>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="text-2xl font-extrabold tracking-tight">Connect with Core Devs</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Have complex pipeline issues or open source integration tracking ideas? Let's build a unified roadmap together.
                </p>
              </div>
            </div>

            {/* FIX: Swapped out empty <div> wrapper formats for functional semantic anchor link maps */}
            <div className="space-y-3 pt-8 lg:pt-0">
              {[
                { label: "Direct Support", detail: "support@githubtracker.com", href: "mailto:support@githubtracker.com", target: "_self", Icon: Mail },
                { label: "Community Hotline", detail: "(123) 456-7890", href: "tel:+11234567890", target: "_self", Icon: Phone },
                { label: "Open-Source Hub", detail: "github.com/yourorg/track", href: "https://github.com/yourorg/track", target: "_blank", Icon: Github },
              ].map(({ label, detail, href, target, Icon }) => (
                <a 
                  key={label} 
                  href={href}
                  target={target}
                  rel={target === "_blank" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded-xl p-1"
                >
                  <div className={`p-2 rounded-lg border transition-colors ${
                    isDark ? "bg-slate-900/50 border-slate-800 text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/30" : "bg-white border-slate-200 text-slate-500 group-hover:text-purple-600 group-hover:border-purple-200"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                    <p className={`text-xs font-semibold truncate transition-colors ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-950"}`}>{detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Form Console */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 sm:p-10 space-y-5 flex flex-col justify-center">
            
            {/* Unified Form Inputs Grid Wrapper */}
            <div className="grid grid-cols-1 gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name field */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    className={`w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all duration-200 ${
                      isDark 
                        ? "bg-[#0c101d] border-slate-800 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10" 
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5"
                    }`}
                  />
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={`w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all duration-200 ${
                      isDark 
                        ? "bg-[#0c101d] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
                    }`}
                  />
                </div>
              </div>

              {/* Subject Dropdown Field */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Subject Topic</label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-11 pl-4 pr-10 rounded-xl text-sm border outline-none transition-all duration-200 appearance-none cursor-pointer ${
                      isDark 
                        ? "bg-[#0c101d] border-slate-800 text-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10" 
                        : "bg-slate-50 border-slate-200 text-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5"
                    }`}
                  >
                    <option value="" disabled className="text-slate-500">Select inquiry reason</option>
                    <option value="general" className={isDark ? "bg-slate-900" : ""}>General Platform Inquiry</option>
                    <option value="bug" className={isDark ? "bg-slate-900" : ""}>Bug Performance Report</option>
                    <option value="feature" className={isDark ? "bg-slate-900" : ""}>New Feature Blueprint Request</option>
                    <option value="other" className={isDark ? "bg-slate-900" : ""}>Other</option>
                  </select>
                  <ChevronDown className={`w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                </div>
              </div>

              {/* Message Content Area */}
              <div className="space-y-1.5">
                <label htmlFor="message" className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Message Payload</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Provide a detailed log or description of your issue..."
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none transition-all duration-200 ${
                    isDark 
                      ? "bg-[#0c101d] border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" 
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
                  }`}
                />
              </div>

            </div>

            {/* Modern Dashboard Styled Submission Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <span className={`text-[11px] font-medium hidden sm:inline-block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Secure end-to-end event transfer pipeline active.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white shadow-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 ${
                  isSubmitting ? "cursor-wait" : "shadow-indigo-500/10 hover:shadow-indigo-500/20"
                }`}
              >
                <span>{isSubmitting ? "Dispatching..." : "Dispatch Message"}</span>
                {!isSubmitting && <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Success Alert Toast */}
      {showPopup && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[calc(100%-32px)] sm:w-full sm:max-w-md p-4 rounded-2xl border shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            isDark
              ? "bg-[#0b101b] border-emerald-500/20 text-emerald-400"
              : "bg-white border-emerald-100 text-emerald-900 shadow-slate-200"
          }`}
        >
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-sm font-bold tracking-wide text-slate-900 dark:text-white">Dispatch Successful</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Your parameters have been logged. The tracking team will review your payload data and connect within 24 hours.
            </p>
          </div>

          <button
            onClick={() => setShowPopup(false)}
            className="p-1 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Contact;