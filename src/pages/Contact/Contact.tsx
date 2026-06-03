import { useState, useContext } from "react";
import {
  Github,
  Mail,
  Phone,
  Send,
  X,
  CheckCircle,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import type { ThemeContextType } from "../../context/ThemeContext";

function Contact() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const themeContext = useContext(ThemeContext) as ThemeContextType;
  const { mode } = themeContext;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowPopup(true);

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
      className={`min-h-screen w-screen relative overflow-y-auto ${
        mode === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-100"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl flex flex-col pb-20">
        {/* Header Section */}
        <div className="text-center mb-8 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mb-4">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 shadow-2xl transition-transform transform hover:scale-105 overflow-hidden rounded-2xl sm:rounded-3xl ${
                mode === "dark" ? "bg-white" : "bg-purple-200"
              }`}
            >
              <img
                src="/crl-icon.png"
                alt="Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
              />
            </div>
            <h1
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
                         bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              GitHub Tracker
            </h1>
          </div>
          <p
            className={`text-sm sm:text-lg max-w-xl md:max-w-2xl mx-auto leading-relaxed ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Get in touch with us to discuss your project tracking needs or
            report any issues
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start flex-1 min-h-0">
          {/* Contact Info Cards */}
          <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
            <div className="text-center lg:text-left flex-shrink-0">
              <h2
                className={`text-lg sm:text-2xl font-bold mb-2 sm:mb-3 ${
                  mode === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Let's Connect
              </h2>
              <p
                className={`text-xs sm:text-base ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                We're here to help you track and manage your GitHub
                repositories more effectively
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
              {[...Array(3)].map((_, index) => {
                const contactTypes = [
                  {
                    title: "Phone Support",
                    iconBg: "from-blue-500 to-cyan-500",
                    detail: "(123) 456-7890",
                    sub: "Mon-Fri, 9AM-6PM EST",
                    Icon: Phone,
                  },
                  {
                    title: "Email Us",
                    iconBg: "from-purple-500 to-pink-500",
                    detail: "support@githubtracker.com",
                    sub: "We'll respond within 24 hours",
                    Icon: Mail,
                  },
                  {
                    title: "GitHub Issues",
                    iconBg: "from-green-500 to-teal-500",
                    detail: "github.com/yourorg/githubtracker",
                    sub: "Report bugs & feature requests",
                    Icon: Github,
                  },
                ];
                const { title, iconBg, detail, sub, Icon } =
                  contactTypes[index];
                return (
                  <div
                    key={title}
                    className={`group p-3 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105 ${
                      mode === "dark"
                        ? "bg-white/10 border border-white/20 hover:bg-white/20"
                        : "bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`p-2 sm:p-2.5 rounded-full transition-transform duration-300 group-hover:scale-110 bg-gradient-to-r ${iconBg}`}
                      >
                        <Icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            mode === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-sm sm:text-base font-semibold ${
                            mode === "dark"
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm ${
                            mode === "dark"
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          {detail}
                        </p>
                        <p
                          className={`text-xs ${
                            mode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {sub}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`p-4 sm:p-6 rounded-xl sm:rounded-3xl shadow-2xl h-full flex flex-col backdrop-blur-lg ${
              mode === "dark"
                ? "bg-white/10 border border-white/20"
                : "bg-white border border-gray-300"
            }`}
          >
            <h2
              className={`text-base sm:text-xl font-bold mb-4 text-center flex-shrink-0 ${
                mode === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Send us a Message
            </h2>

            <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {/* Full Name */}
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      mode === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                    className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      mode === "dark"
                        ? "bg-white/5 border border-white/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      mode === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      mode === "dark"
                        ? "bg-white/5 border border-white/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      mode === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Subject
                  </label>
                  <select
                    className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      mode === "dark"
                        ? "bg-white/5 border border-white/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option>General Inquiry</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      mode === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message here..."
                    required
                    rows={4}
                    className={`w-full p-2 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      mode === "dark"
                        ? "bg-white/5 border border-white/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                  ></textarea>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isSubmitting
                        ? "bg-purple-400 cursor-wait text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div
          className={`fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-sm sm:max-w-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-3 sm:gap-4 ${
            mode === "dark"
              ? "bg-green-900 border border-green-700 text-green-100"
              : "bg-green-100 border border-green-400 text-green-900"
          }`}
        >
          <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          <div className="flex-1 text-xs sm:text-sm font-semibold">
            Thank you for contacting us! We will get back to you shortly.
          </div>
          <button
            onClick={handleClosePopup}
            className="text-lg sm:text-xl px-2 sm:px-3 py-1 rounded-xl hover:bg-green-200/40 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Close notification"
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
}

export default Contact;
