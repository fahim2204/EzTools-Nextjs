"use client";

import { Card, CardBody as CardContent } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  gramsToTraditional,
  traditionalToGrams,
  validateGrams,
  validateTraditionalUnits,
  type TraditionalUnits,
} from "@/lib/goldWeightConversions";

type ConversionMode = "toGrams" | "toTraditional";

export default function GoldWeightConverter() {
  const [mode, setMode] = useState<ConversionMode>("toGrams");

  // Traditional units state
  const [vori, setVori] = useState<string>("");
  const [ana, setAna] = useState<string>("");
  const [roti, setRoti] = useState<string>("");
  const [point, setPoint] = useState<string>("");
  const [gramsResult, setGramsResult] = useState<number | null>(null);

  // Grams state
  const [grams, setGrams] = useState<string>("");
  const [traditionalResult, setTraditionalResult] =
    useState<TraditionalUnits | null>(null);

  const [error, setError] = useState<string>("");

  const handleTraditionalToGrams = () => {
    setError("");
    const units: TraditionalUnits = {
      vori: parseFloat(vori) || 0,
      ana: parseFloat(ana) || 0,
      roti: parseFloat(roti) || 0,
      point: parseFloat(point) || 0,
    };

    const validation = validateTraditionalUnits(units);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    const result = traditionalToGrams(units);
    setGramsResult(result);
  };

  const handleGramsToTraditional = () => {
    setError("");
    const gramsValue = parseFloat(grams);

    const validation = validateGrams(gramsValue);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    const result = gramsToTraditional(gramsValue);
    setTraditionalResult(result);
  };

  const clearTraditional = () => {
    setVori("");
    setAna("");
    setRoti("");
    setPoint("");
    setGramsResult(null);
    setError("");
  };

  const clearGrams = () => {
    setGrams("");
    setTraditionalResult(null);
    setError("");
  };

  const toggleMode = () => {
    setMode(mode === "toGrams" ? "toTraditional" : "toGrams");
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-gray-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            ⚖️ Gold Weight Converter
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Convert between traditional gold units (Vori, Ana, Roti, Point) and
            grams
          </p>
        </motion.div>

        {/* Toggle Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm">Select conversion direction:</p>
            <button
              onClick={toggleMode}
              className="group relative px-10 py-5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className={`transition-opacity ${mode === "toGrams" ? "opacity-100" : "opacity-50"}`}>
                    Traditional Units
                  </span>
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={mode === "toGrams" ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M11 17l-5-5m0 0l5-5m-5 5h12"}
                    />
                  </svg>
                  <span className={`transition-opacity ${mode === "toTraditional" ? "opacity-100" : "opacity-50"}`}>
                    Grams
                  </span>
                </span>
              </span>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                Click to switch direction
              </div>
            </button>
          </div>
        </motion.div>

        {/* Converter Cards */}
        <div className="max-w-4xl mx-auto">
          {mode === "toGrams" ? (
            <motion.div
              key="toGrams"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-strong border-2 border-amber-500/30 bg-transparent">
                <CardContent className="p-8">
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-center mb-6 text-amber-300">
                      Traditional Units → Grams
                    </h2>
                    <div className="absolute top-0 right-0 group/tooltip">
                      <svg
                        className="w-5 h-5 text-amber-400 cursor-help"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 border border-amber-500/50 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-10">
                        <p className="text-xs text-gray-300">
                          Enter values in traditional units (Vori, Ana, Roti, Point) to convert to grams. You can enter values in any combination.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Vori */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vori
                      </label>
                      <input
                        type="number"
                        value={vori}
                        onChange={(e) => setVori(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      />
                    </div>

                    {/* Ana */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ana (0-15)
                      </label>
                      <input
                        type="number"
                        value={ana}
                        onChange={(e) => setAna(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="15"
                        step="1"
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      />
                    </div>

                    {/* Roti */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Roti (0-5)
                      </label>
                      <input
                        type="number"
                        value={roti}
                        onChange={(e) => setRoti(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="5"
                        step="1"
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      />
                    </div>

                    {/* Point */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Point (0-9)
                      </label>
                      <input
                        type="number"
                        value={point}
                        onChange={(e) => setPoint(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="9"
                        step="1"
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Convert Button */}
                  <button
                    onClick={handleTraditionalToGrams}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-[1.02] mb-4"
                  >
                    CONVERT TO GRAMS
                  </button>

                  {/* Result */}
                  {gramsResult !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 rounded-xl mb-4"
                    >
                      <p className="text-sm text-gray-400 mb-2 text-center">
                        Result:
                      </p>
                      <p className="text-4xl font-bold text-center text-amber-300">
                        {gramsResult}
                      </p>
                      <p className="text-lg text-gray-300 text-center mt-1">
                        Grams
                      </p>
                    </motion.div>
                  )}

                  {/* Clear Button */}
                  <button
                    onClick={clearTraditional}
                    className="w-full py-3 bg-gray-700/50 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all duration-300"
                  >
                    CLEAR
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="toTraditional"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-strong border-2 border-amber-500/30 bg-transparent">
                <CardContent className="p-8">
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-center mb-6 text-amber-300">
                      Grams → Traditional Units
                    </h2>
                    <div className="absolute top-0 right-0 group/tooltip">
                      <svg
                        className="w-5 h-5 text-amber-400 cursor-help"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="absolute right-0 top-8 w-64 p-3 bg-gray-800 border border-amber-500/50 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-10">
                        <p className="text-xs text-gray-300">
                          Enter weight in grams to convert to traditional units (Vori, Ana, Roti, Point).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grams Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight in Grams
                    </label>
                    <input
                      type="number"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.001"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Convert Button */}
                  <button
                    onClick={handleGramsToTraditional}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] mb-4"
                  >
                    CONVERT TO TRADITIONAL UNITS
                  </button>

                  {/* Result */}
                  {traditionalResult !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 rounded-xl mb-4"
                    >
                      <p className="text-sm text-gray-400 mb-4 text-center">
                        Result:
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-1">Vori</p>
                          <p className="text-2xl font-bold text-amber-300">
                            {traditionalResult.vori}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-1">Ana</p>
                          <p className="text-2xl font-bold text-amber-300">
                            {traditionalResult.ana}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-1">Roti</p>
                          <p className="text-2xl font-bold text-amber-300">
                            {traditionalResult.roti}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-1">Point</p>
                          <p className="text-2xl font-bold text-amber-300">
                            {traditionalResult.point}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Clear Button */}
                  <button
                    onClick={clearGrams}
                    className="w-full py-3 bg-gray-700/50 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all duration-300"
                  >
                    CLEAR
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Information Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-12 mb-8"
        >
          <Card className="glass-strong border border-amber-500/30 bg-transparent">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-amber-300 mb-3">
                📊 Gold Weight Conversion Reference
              </h3>
              <div className="text-gray-300 space-y-1 text-sm">
                <p>1 Vori = 11.664 Gram</p>
                <p>1 Vori = 16 Ana = 96 Roti = 960 Point</p>
                <p>1 Ana = 6 Roti = 60 Point</p>
                <p>1 Roti = 10 Point</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <Card className="glass-strong border border-amber-500/20 bg-transparent">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                Understanding Traditional Gold Measurements
              </h2>

              <div className="text-gray-300 space-y-4">
                <p>
                  Traditional gold weight measurements have been used for
                  centuries in jewelry making and gold trading. Understanding
                  these units is essential for anyone dealing with precious
                  metals in regions where these measurements are still commonly
                  used.
                </p>

                <h3 className="text-xl font-semibold text-amber-300 mt-6">
                  Traditional Gold Units Explained:
                </h3>

                <div className="space-y-3">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-amber-500/20">
                    <h4 className="font-semibold text-amber-300 mb-2">
                      Vori (ভরি)
                    </h4>
                    <p className="text-sm text-gray-400">
                      The largest traditional unit, 1 Vori equals 11.664 grams.
                      This is the primary unit used in gold trading and jewelry
                      purchases.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-lg border border-amber-500/20">
                    <h4 className="font-semibold text-amber-300 mb-2">
                      Ana (আনা)
                    </h4>
                    <p className="text-sm text-gray-400">
                      A subdivision of Vori, where 16 Ana equals 1 Vori.
                      Commonly used for smaller gold items and precise
                      measurements.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-lg border border-amber-500/20">
                    <h4 className="font-semibold text-amber-300 mb-2">
                      Roti (রতি)
                    </h4>
                    <p className="text-sm text-gray-400">
                      An even smaller unit, where 6 Roti equals 1 Ana. Used for
                      very precise gold measurements in fine jewelry.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-lg border border-amber-500/20">
                    <h4 className="font-semibold text-amber-300 mb-2">
                      Point (পয়েন্ট)
                    </h4>
                    <p className="text-sm text-gray-400">
                      The smallest traditional unit, where 10 Point equals 1
                      Roti. Essential for extremely precise gold weight
                      calculations.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-amber-300 mt-6">
                  Why Use This Converter?
                </h3>

                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>
                    <strong className="text-gray-300">Accurate Conversions:</strong>{" "}
                    Instantly convert between traditional units and modern gram
                    measurements
                  </li>
                  <li>
                    <strong className="text-gray-300">Bidirectional:</strong>{" "}
                    Convert from traditional to grams or vice versa with a
                    single click
                  </li>
                  <li>
                    <strong className="text-gray-300">Jewelry Shopping:</strong>{" "}
                    Understand exact weights when buying or selling gold
                    jewelry
                  </li>
                  <li>
                    <strong className="text-gray-300">Gold Trading:</strong>{" "}
                    Essential tool for gold traders and jewelers
                  </li>
                  <li>
                    <strong className="text-gray-300">Free & Easy:</strong> No
                    registration required, instant results
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong className="text-amber-300">Pro Tip:</strong> When
                    buying gold jewelry, always verify the weight in both
                    traditional units and grams to ensure accuracy and fair
                    pricing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
