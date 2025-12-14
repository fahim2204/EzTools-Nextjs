"use client";

import { useEffect, useState } from "react";
import { Card, CardBody as CardContent } from "@nextui-org/react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { AgeResult, NextBirthday } from "@/lib/ageCalculations";
import { formatNumber, formatDuration } from "@/lib/formatters";

interface ResultsDisplayProps {
  ageResult: AgeResult;
  nextBirthday: NextBirthday;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return (
    <span className="count-up">
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}

export default function ResultsDisplay({ ageResult, nextBirthday }: ResultsDisplayProps) {
  const { years, months, days, totalDays, totalHours, totalMinutes } = ageResult;
  const { daysUntil, hoursUntil, minutesUntil } = nextBirthday;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-6xl mx-auto mt-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-3">
          Here's What Your Life Looks Like in Numbers
        </h2>
        <p className="text-gray-400 text-lg">
          You've been alive for {formatDuration(years, months, days)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Exact Age */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 bg-transparent">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🎂</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Exact Age</h3>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={years} /> years
                </div>
                <div className="text-lg text-gray-400">
                  <AnimatedCounter value={months} /> months, <AnimatedCounter value={days} /> days
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Days */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 hover:scale-105 bg-transparent">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-3">📅</div>
                <h3 className="text-xl font-semibold mb-2 text-pink-300">Total Days</h3>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={totalDays} />
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  days you've experienced
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Hours */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:scale-105 bg-transparent">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-3">⏰</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-300">Total Hours</h3>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={totalHours} />
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  hours of life
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Minutes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105 bg-transparent">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-3">⏱️</div>
                <h3 className="text-xl font-semibold mb-2 text-green-300">Total Minutes</h3>
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={totalMinutes} />
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  minutes and counting
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Birthday Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-2"
        >
          <Card className="glass border border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105 bg-transparent">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">Next Birthday Countdown</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  <AnimatedCounter value={daysUntil} /> days
                </div>
                <div className="text-lg text-gray-400">
                  <AnimatedCounter value={hoursUntil} /> hours, <AnimatedCounter value={minutesUntil} /> minutes
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  until you turn {years + 1}!
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
