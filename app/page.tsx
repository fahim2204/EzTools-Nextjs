"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CalculatorCard {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  gradient: string;
}

const calculators: CalculatorCard[] = [
  {
    title: "Age Calculator",
    description: "Calculate your exact age in years, months, and days. Discover life insights and famous birthdays.",
    icon: "🎂",
    href: "/age-calculator",
    color: "purple",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index and understand your health status with detailed insights.",
    icon: "💪",
    href: "/bmi-calculator",
    color: "blue",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    title: "Gold Price Calculator",
    description: "Calculate gold prices, convert between different units, and track precious metal values.",
    icon: "🥇",
    href: "/gold-price-calculator",
    color: "yellow",
    gradient: "from-yellow-600 to-orange-600",
  },
  {
    title: "Land Calculator",
    description: "Calculate land area, convert between different units, and measure property dimensions.",
    icon: "🏞️",
    href: "/land-calculator",
    color: "green",
    gradient: "from-green-600 to-emerald-600",
  },
  {
    title: "Loan Calculator",
    description: "Calculate loan payments, interest rates, and amortization schedules for any loan type.",
    icon: "💰",
    href: "/loan-calculator",
    color: "indigo",
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    title: "Mortgage Calculator",
    description: "Calculate monthly mortgage payments, total interest, and plan your home purchase.",
    icon: "🏠",
    href: "/mortgage-calculator",
    color: "pink",
    gradient: "from-pink-600 to-rose-600",
  },
  {
    title: "Percentage Calculator",
    description: "Calculate percentages, percentage increase/decrease, and solve percentage problems.",
    icon: "📊",
    href: "/percentage-calculator",
    color: "teal",
    gradient: "from-teal-600 to-cyan-600",
  },
  {
    title: "Tip Calculator",
    description: "Calculate tips, split bills, and determine fair gratuity amounts for any service.",
    icon: "🍽️",
    href: "/tip-calculator",
    color: "orange",
    gradient: "from-orange-600 to-red-600",
  },
];

export default function Home() {
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
            EZCalc
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">
            Free Online Calculators for Every Need
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Calculate, convert, and compute with our comprehensive collection of free online calculators.
            Fast, accurate, and easy to use.
          </p>
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {calculators.map((calculator, index) => (
            <motion.div
              key={calculator.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={calculator.href}>
                <Card className="glass-strong border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 h-full cursor-pointer group hover:scale-105">
                  <CardBody className="p-6">
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
                      <div className={`mt-4 inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${calculator.gradient} text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        Calculate →
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
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
              Welcome to EZCalc – your one-stop destination for free, accurate, and easy-to-use online calculators.
              Whether you need to calculate your age, determine your BMI, convert units, or solve complex financial
              equations, we have the perfect calculator for you.
            </p>
            <h3 className="text-xl font-semibold text-purple-300 mt-6">Our Calculator Collection:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li><strong>Age Calculator</strong> – Calculate your exact age with life insights and famous birthdays</li>
              <li><strong>BMI Calculator</strong> – Determine your Body Mass Index and health status</li>
              <li><strong>Gold Price Calculator</strong> – Track and convert gold prices in real-time</li>
              <li><strong>Land Calculator</strong> – Calculate land area and convert between measurement units</li>
              <li><strong>Loan Calculator</strong> – Calculate loan payments, interest, and amortization</li>
              <li><strong>Mortgage Calculator</strong> – Plan your home purchase with detailed mortgage calculations</li>
              <li><strong>Percentage Calculator</strong> – Solve percentage problems and conversions</li>
              <li><strong>Tip Calculator</strong> – Calculate tips and split bills easily</li>
            </ul>
            <p className="mt-6">
              All our calculators are completely free to use, require no registration, and provide instant, accurate results.
              We're constantly adding new calculators to help you with your everyday calculations and complex computations.
            </p>
            <p className="mt-4">
              EZCalc is designed with user experience in mind – fast loading times, beautiful interfaces, and mobile-friendly
              designs ensure you can calculate anything, anywhere, anytime.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm pb-8">
          <p>© 2025 EZCalc. All rights reserved.</p>
          <p className="mt-2">
            Free online calculators for age, BMI, gold prices, land area, loans, and more
          </p>
        </footer>
      </div>
    </main>
  );
}
