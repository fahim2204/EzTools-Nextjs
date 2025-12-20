"use client";

import { Card, CardBody as CardContent } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface CalculatorCard {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  gradient: string;
  tags: string[];
}

const calculators: CalculatorCard[] = [
  {
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days. Discover life insights and famous birthdays.",
    icon: "🎂",
    href: "/age-calculator",
    color: "purple",
    gradient: "from-purple-600 to-pink-600",
    tags: ["age", "birthday", "date", "time", "years"],
  },
  {
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index and understand your health status with detailed insights.",
    icon: "💪",
    href: "/bmi-calculator",
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
    tags: ["bmi", "health", "weight", "fitness", "body"],
  },
  {
    title: "Gold Price Calculator",
    description:
      "Calculate gold prices, convert between different units, and track precious metal values.",
    icon: "🥇",
    href: "/gold-price-calculator",
    color: "yellow",
    gradient: "from-yellow-600 to-orange-600",
    tags: ["gold", "price", "metal", "investment", "currency"],
  },
  {
    title: "Gold Weight Converter",
    description:
      "Convert between traditional gold units (Vori, Ana, Roti, Point) and grams instantly.",
    icon: "⚖️",
    href: "/gold-weight-converter",
    color: "amber",
    gradient: "from-amber-600 to-yellow-600",
    tags: ["gold", "converter", "vori", "ana", "weight", "traditional units"],
  },
  {
    title: "Land Calculator",
    description:
      "Calculate land area, convert between different units, and measure property dimensions.",
    icon: "🏞️",
    href: "/land-calculator",
    color: "green",
    gradient: "from-green-600 to-emerald-600",
    tags: ["land", "area", "property", "measurement", "real estate"],
  },
  {
    title: "Loan Calculator",
    description:
      "Calculate loan payments, interest rates, and amortization schedules for any loan type.",
    icon: "💰",
    href: "/loan-calculator",
    color: "indigo",
    gradient: "from-indigo-600 to-purple-600",
    tags: ["loan", "finance", "interest", "payment", "debt"],
  },
  {
    title: "Mortgage Calculator",
    description:
      "Calculate monthly mortgage payments, total interest, and plan your home purchase.",
    icon: "🏠",
    href: "/mortgage-calculator",
    color: "pink",
    gradient: "from-pink-600 to-rose-600",
    tags: ["mortgage", "home", "property", "finance", "payment"],
  },
  {
    title: "Percentage Calculator",
    description:
      "Calculate percentages, percentage increase/decrease, and solve percentage problems.",
    icon: "📊",
    href: "/percentage-calculator",
    color: "teal",
    gradient: "from-teal-600 to-cyan-600",
    tags: ["percentage", "math", "calculation", "ratio", "proportion"],
  },
  {
    title: "Tip Calculator",
    description:
      "Calculate tips, split bills, and determine fair gratuity amounts for any service.",
    icon: "🍽️",
    href: "/tip-calculator",
    color: "orange",
    gradient: "from-orange-600 to-red-600",
    tags: ["tip", "gratuity", "bill", "restaurant", "service"],
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calculators based on search query
  const filteredCalculators = calculators.filter((calculator) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      calculator.title.toLowerCase().includes(query) ||
      calculator.description.toLowerCase().includes(query) ||
      calculator.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
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
            EZCalc - Calulate Everything
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">
            Free Online Calculators for Every Need
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Calculate, convert, and compute with our comprehensive collection of
            free online calculators. Fast, accurate, and easy to use.
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
              placeholder="Search calculators by name, description, or tags..."
              className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
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
              Found {filteredCalculators.length} calculator{filteredCalculators.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredCalculators.length > 0 ? (
            filteredCalculators.map((calculator, index) => (
            <motion.div
              key={calculator.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={calculator.href}
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'tool_click', {
                      event_category: 'calculator',
                      event_label: calculator.title,
                      tool_name: calculator.title
                    });
                  }
                }}
              >
                <Card className="glass-strong border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 h-full cursor-pointer group hover:scale-105 bg-transparent">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {calculator.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                        {calculator.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {calculator.description}
                      </p>
                      <div
                        className={`mt-4 inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${calculator.gradient} text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        Calculate →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No calculators found</h3>
              <p className="text-gray-400 mb-6">
                Try searching with different keywords or tags
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </div>

        {/* SEO Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto glass-strong rounded-2xl p-8 border border-purple-500/20"
        >
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Free Online Calculators by EZCalc
          </h2>
          <div className="text-gray-300 space-y-4">
            <p>
              Welcome to EZCalc - your one-stop destination for free, accurate,
              and easy-to-use online calculators. Whether you need to calculate
              your age, determine your BMI, convert units, or solve complex
              financial equations, we have the perfect calculator for you.
            </p>
            <h3 className="text-xl font-semibold text-purple-300 mt-6">
              Our Calculator Collection:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong>Age Calculator</strong> - Calculate your exact age with
                life insights and famous birthdays
              </li>
              <li>
                <strong>BMI Calculator</strong> - Determine your Body Mass Index
                and health status
              </li>
              <li>
                <strong>Gold Price Calculator</strong> - Track and convert gold
                prices in real-time
              </li>
              <li>
                <strong>Land Calculator</strong> - Calculate land area and
                convert between measurement units
              </li>
              <li>
                <strong>Loan Calculator</strong> - Calculate loan payments,
                interest, and amortization
              </li>
              <li>
                <strong>Mortgage Calculator</strong> - Plan your home purchase
                with detailed mortgage calculations
              </li>
              <li>
                <strong>Percentage Calculator</strong> - Solve percentage
                problems and conversions
              </li>
              <li>
                <strong>Tip Calculator</strong> - Calculate tips and split bills
                easily
              </li>
            </ul>
            <p className="mt-6">
              All our calculators are completely free to use, require no
              registration, and provide instant, accurate results. We're
              constantly adding new calculators to help you with your everyday
              calculations and complex computations.
            </p>
            <p className="mt-4">
              EZCalc is designed with user experience in mind - fast loading
              times, beautiful interfaces, and mobile-friendly designs ensure
              you can calculate anything, anywhere, anytime.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm pb-8">
          <div className="flex justify-center flex-wrap gap-6 mb-8 text-base">
            <Link href="/about" className="hover:text-purple-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p>© 2025 EZCalc. All rights reserved.</p>
          <p className="mt-2">
            Free online calculators for age, BMI, gold prices, land area, loans,
            and more
          </p>
        </footer>
      </div>
    </main>
  );
}
