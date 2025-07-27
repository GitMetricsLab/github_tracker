import { useState } from 'react';
import { Github, Mail, Phone, Send, X, CheckCircle } from 'lucide-react';
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import type { ThemeContextType } from "../../ThemeContext";

function Contact() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const themeContext = useContext(ThemeContext) as ThemeContextType;
const { mode } = themeContext;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
    className={`h-screen w-screen relative overflow-hidden ${
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

    <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl h-full flex flex-col">
      {/* Header Section */}
      <div className="text-center mb-8 flex-shrink-0">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 shadow-2xl transition-transform transform hover:scale-105 overflow-hidden rounded-3xl ${
            mode === "dark" ? "bg-white" : "bg-purple-200"
          }`}>
            <img
              src="/crl-icon.png"
              alt="Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            GitHub Tracker
          </h1>
        </div>
        <p
          className={`text-lg max-w-2xl mx-auto leading-relaxed ${
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Get in touch with us to discuss your project tracking needs or report
          any issues
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start flex-1 min-h-0">
        {/* Contact Info Cards */}
        <div className="space-y-6 h-full flex flex-col">
          <div className="text-center lg:text-left flex-shrink-0">
            <h2
              className={`text-2xl font-bold mb-3 ${
                mode === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Let's Connect
            </h2>
            <p
              className={`text-base ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We're here to help you track and manage your GitHub repositories
              more effectively
            </p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
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
              const {
                title,
                iconBg,
                detail,
                sub,
                Icon,
              } = contactTypes[index];
              return (
                <div
                  key={title}
                  className={`group p-5 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105 ${
                    mode === "dark"
                      ? "bg-white/10 border border-white/20 hover:bg-white/20"
                      : "bg-white border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-full transition-transform duration-300 group-hover:scale-110 bg-gradient-to-r ${iconBg}`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          mode === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-base font-semibold ${
                          mode === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {title}
                      </h3>
                      <p
                        className={`text-sm ${
                          mode === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {detail}
                      </p>
                      <p
                        className={`text-xs ${
                          mode === "dark" ? "text-gray-400" : "text-gray-500"
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
  className={`p-6 rounded-3xl shadow-2xl h-full flex flex-col backdrop-blur-lg ${
    mode === "dark"
      ? "bg-white/10 border border-white/20"
      : "bg-white border border-gray-300"
  }`}
>
  <h2
    className={`text-xl font-bold mb-4 text-center flex-shrink-0 ${
      mode === "dark" ? "text-white" : "text-gray-800"
    }`}
  >
    Send us a Message
  </h2>

  <div className="space-y-4 flex-1 flex flex-col">
    <div className="space-y-3 flex-1">
      {/* Full Name */}
      <div>
        <label
          className={`block text-xs font-medium mb-1 ${
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          required
          className={`w-full p-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Email Address
        </label>
        <input
          type="email"
          placeholder="your.email@example.com"
          required
          className={`w-full p-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Subject
        </label>
        <select
          className={`w-full p-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            mode === "dark"
              ? "bg-white/5 border border-white/20 text-white"
              : "bg-gray-50 border border-gray-300 text-gray-800"
          }`}
        >
          <option value="" className={mode === "dark" ? "bg-slate-800" : "bg-white"}>
            Select a topic
          </option>
          <option value="bug" className={mode === "dark" ? "bg-slate-800" : "bg-white"}>Bug Report</option>
          <option value="feature" className={mode === "dark" ? "bg-slate-800" : "bg-white"}>Feature Request</option>
          <option value="support" className={mode === "dark" ? "bg-slate-800" : "bg-white"}>Technical Support</option>
          <option value="general" className={mode === "dark" ? "bg-slate-800" : "bg-white"}>General Inquiry</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex-1">
        <label
          className={`block text-xs font-medium mb-1 ${
            mode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Message
        </label>
        <textarea
          required
          placeholder="Tell us about your GitHub tracking needs or describe your issue..."
          className={`w-full h-full min-h-[120px] resize-none p-3 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            mode === "dark"
              ? "bg-white/5 border border-white/20 text-white placeholder-gray-400"
              : "bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500"
          }`}
        ></textarea>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
    >
      {isSubmitting ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Sending...
        </>
      ) : (
        <>
          <Send className="w-5 h-5" />
          Send Message
        </>
      )}
    </button>
  </div>
</div>
          {/* last*/ }
        </div>
      </div>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 w-full max-w-md transform animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Thank you for reaching out to GitHub Tracker. We've received your message and will get back to you within 24 hours.
              </p>
              
              <button
                onClick={handleClosePopup}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
