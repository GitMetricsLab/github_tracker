import React from 'react';
import { Github, Mail, Info } from 'lucide-react';

function Footer() {
  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 mb-6 items-start">

          {/* Brand Section */}
          <div className="space-y-3">
            <div className="group">
              <a
                href="https://github.com/GitMetricsLab/github_tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
              >
                <Github className="h-7 w-7" />
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
          <div className="space-y-3">
            <h3 className="font-semibold tracking-wide text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
              Quick Links
            </h3>
            <div className="space-y-1">
              {[
                { href: '/about', icon: Info, text: 'About Us' },
                { href: '/contact', icon: Mail, text: 'Contact' },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GitHub Tracker
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
    </footer>
  );
}

export default Footer;
