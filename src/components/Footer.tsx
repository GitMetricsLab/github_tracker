import React from 'react';
import { Github, Mail, Info } from 'lucide-react';

function Footer() {
  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 mb-12 items-start">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="group">
              <a
                href="https://github.com/GitMetricsLab/github_tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <Github className="h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GitHub Tracker
                </span>
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Track, analyze, and optimize your GitHub repositories with powerful insights and metrics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wide text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { href: '/about', icon: Info, text: 'About Us' },
                { href: '/contact', icon: Mail, text: 'Contact' },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1"
                >
                  <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="relative">
                    {link.text}
                    <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></div>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wide text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/GitMetricsLab"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                <Github className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            <span className="inline-block animate-bounce mr-1">©</span>
            {new Date().getFullYear()}{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GitHub Tracker
            </span>
            . All rights reserved.
          </p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-400/30 animate-ping"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-purple-400/40 animate-pulse"></div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
    </footer>
  );
}

export default Footer;
