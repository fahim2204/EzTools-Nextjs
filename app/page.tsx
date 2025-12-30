"use client";

import { Card, CardBody as CardContent } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface ToolCard {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  gradient: string;
  status: "available" | "coming-soon";
  tags: string[];
}

const tools: ToolCard[] = [
  {
    title: "Remove Background",
    description: "Automatically remove image backgrounds using AI directly in your browser.",
    icon: "✨",
    href: "/tools/remove-background",
    color: "cyan",
    gradient: "from-blue-600 to-cyan-600",
    status: "available",
    tags: ["image", "background", "remove", "ai", "transparent"],
  },
  {
    title: "Resize Image",
    description: "Resize images to any dimension while maintaining quality. Perfect for social media, websites, and apps.",
    icon: "📐",
    href: "/tools/resize-image",
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
    status: "coming-soon",
    tags: ["image", "resize", "dimensions", "scale"],
  },
  {
    title: "Crop Image",
    description: "Crop images to specific dimensions or aspect ratios. Simple and precise cropping tool.",
    icon: "✂️",
    href: "/tools/crop-image",
    color: "green",
    gradient: "from-green-600 to-emerald-600",
    status: "coming-soon",
    tags: ["image", "crop", "cut", "trim"],
  },
  {
    title: "Convert Image Format",
    description: "Convert images between PNG, JPG, WebP, and other formats instantly.",
    icon: "🔄",
    href: "/tools/convert-image",
    color: "purple",
    gradient: "from-purple-600 to-pink-600",
    status: "available",
    tags: ["image", "convert", "format", "png", "jpg", "webp"],
  },
  {
    title: "Square Image (App Icon)",
    description: "Create perfect square images for app icons, profile pictures, and thumbnails.",
    icon: "⬜",
    href: "/tools/square-image",
    color: "orange",
    gradient: "from-orange-600 to-red-600",
    status: "coming-soon",
    tags: ["image", "square", "app icon", "profile"],
  },
  {
    title: "Remove White Padding",
    description: "Automatically remove white or transparent padding from images.",
    icon: "🎯",
    href: "/tools/remove-padding",
    color: "indigo",
    gradient: "from-indigo-600 to-purple-600",
    status: "coming-soon",
    tags: ["image", "padding", "trim", "whitespace"],
  },
  {
    title: "Compress Image",
    description: "Reduce image file size without losing quality. Optimize for web and mobile.",
    icon: "📦",
    href: "/tools/compress-image",
    color: "teal",
    gradient: "from-teal-600 to-cyan-600",
    status: "coming-soon",
    tags: ["image", "compress", "optimize", "reduce size"],
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search query
  const filteredTools = tools.filter((tool) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4 gradient-text">
            ImagePix
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">
            Fast tools for images, PDFs, and audio
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Simple tools. No installation. No confusion. Process files directly in your browser.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, description, or tags..."
              className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border-2 border-blue-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-400 text-center">
              Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {/* Tool Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            🖼 Image Tools
          </h2>
          
          {/* Tool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {tool.status === "available" ? (
                    <Link href={tool.href}>
                      <Card className="glass-strong border-2 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 h-full group hover:scale-105 bg-transparent cursor-pointer">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                              {tool.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                              {tool.description}
                            </p>
                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">
                              Available Now
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="glass-strong border-2 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 h-full group hover:scale-105 bg-transparent">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {tool.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                            {tool.description}
                          </p>
                          <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No tools found</h3>
                <p className="text-gray-400 mb-6">
                  Try searching with different keywords or tags
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Coming Soon Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-strong border-2 border-purple-500/20 bg-transparent">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-white mb-2">PDF Tools</h3>
                <p className="text-gray-400 mb-4">
                  Merge, split, compress, and convert PDFs
                </p>
                <span className="inline-block px-4 py-2 text-sm font-semibold bg-purple-500/20 text-purple-300 rounded-full">
                  Coming Soon
                </span>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass-strong border-2 border-pink-500/20 bg-transparent">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🔊</div>
                <h3 className="text-2xl font-bold text-white mb-2">Audio Tools</h3>
                <p className="text-gray-400 mb-4">
                  Convert, trim, and compress audio files
                </p>
                <span className="inline-block px-4 py-2 text-sm font-semibold bg-pink-500/20 text-pink-300 rounded-full">
                  Coming Soon
                </span>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Why ImagePix Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto glass-strong rounded-2xl p-8 border border-blue-500/20 mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
            Why ImagePix?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Fast & Lightweight</h3>
                <p className="text-gray-400 text-sm">Process files instantly without waiting</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔐</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Privacy-Friendly</h3>
                <p className="text-gray-400 text-sm">Files processed locally in your browser</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Works on Mobile</h3>
                <p className="text-gray-400 text-sm">Fully responsive on all devices</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🧩</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Simple UI</h3>
                <p className="text-gray-400 text-sm">No clutter, just what you need</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm pb-8">
          <div className="flex justify-center flex-wrap gap-6 mb-8 text-base">
            <Link href="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p>© 2025 ImagePix. All rights reserved.</p>
          <p className="mt-2">
            Fast tools for images, PDFs, and audio - No installation required
          </p>
        </footer>
      </div>
    </main>
  );
}
