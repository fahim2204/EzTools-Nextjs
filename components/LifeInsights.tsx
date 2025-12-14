"use client";

import { Card, CardBody as CardContent, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { LifeInsights as LifeInsightsType } from "@/lib/ageCalculations";
import { formatNumber } from "@/lib/formatters";

interface LifeInsightsProps {
  insights: LifeInsightsType;
}

export default function LifeInsights({ insights }: LifeInsightsProps) {
  const { waterLiters, oxygenLiters, co2Liters, populationPercentage } = insights;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-6xl mx-auto mt-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-3">
          Your Life in Fascinating Numbers
        </h2>
        <p className="text-gray-400 text-lg">
          Based on average human needs, here's what you may have consumed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Water Consumption */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">💧</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-cyan-300">Water Consumed</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    ~{formatNumber(waterLiters)} liters
                  </div>
                  <p className="text-sm text-gray-400">
                    That's about {formatNumber(Math.round(waterLiters / 500))} standard water bottles!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Oxygen Inhaled */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border border-green-500/30 hover:border-green-500/60 transition-all duration-300 bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">🌬️</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-green-300">Oxygen Inhaled</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    ~{formatNumber(oxygenLiters)} liters
                  </div>
                  <p className="text-sm text-gray-400">
                    Every breath counts! You've taken millions of them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CO2 Exhaled */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">💨</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-orange-300">CO₂ Exhaled</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    ~{formatNumber(co2Liters)} liters
                  </div>
                  <p className="text-sm text-gray-400">
                    Plants love you! This helps them grow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Population Percentage */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">🌍</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-purple-300">World Population</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    ~{populationPercentage}%
                  </div>
                  <p className="text-sm text-gray-400">
                    You're younger than approximately {populationPercentage}% of the world!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="glass-strong border border-gray-700/50 bg-transparent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div className="flex-1">
                <Chip variant="bordered" className="mb-2 text-gray-400 border-gray-500">
                  Disclaimer
                </Chip>
                <p className="text-sm text-gray-400">
                  These life insights are based on average human consumption estimates and are provided for 
                  informational and entertainment purposes only. Actual values vary significantly based on 
                  individual factors such as activity level, health, environment, and lifestyle. This is not 
                  medical or scientific advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
