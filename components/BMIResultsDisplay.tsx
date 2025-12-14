"use client";

import { Card, CardBody as CardContent } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BMIResult, UnitSystem } from "@/lib/bmiCalculations";

interface BMIResultsDisplayProps {
  result: BMIResult;
  system: UnitSystem;
}

export default function BMIResultsDisplay({ result, system }: BMIResultsDisplayProps) {
  const { bmi, classification, healthyWeightMin, healthyWeightMax } = result;

  // Determine color based on classification
  const getColor = (classification: string) => {
    switch (classification) {
      case "Underweight": return "text-blue-400";
      case "Normal weight": return "text-green-400";
      case "Overweight": return "text-yellow-400";
      default: return "text-red-400"; // Obesity classes
    }
  };

  const getProgressColor = (classification: string) => {
    switch (classification) {
      case "Underweight": return "bg-blue-500";
      case "Normal weight": return "bg-green-500";
      case "Overweight": return "bg-yellow-500";
      default: return "bg-red-500";
    }
  };
  
  // Calculate percentage for gauge (15 to 40 BMI range for display)
  const minBMI = 15;
  const maxBMI = 40;
  const percentage = Math.min(100, Math.max(0, ((bmi - minBMI) / (maxBMI - minBMI)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Result Card */}
        <Card className="glass border border-purple-500/30 bg-transparent h-full">
          <CardContent className="p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl font-bold text-gray-300 mb-4">Your BMI</h3>
            
            <div className={`text-6xl font-bold mb-2 ${getColor(classification)}`}>
              {bmi}
            </div>
            
            <div className={`text-xl font-semibold mb-6 ${getColor(classification)} px-4 py-1 rounded-full bg-white/5`}>
              {classification}
            </div>

            {/* Simple Gauge */}
            <div className="w-full h-4 bg-gray-700 rounded-full relative overflow-hidden mb-2">
              <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-blue-500/50" />
              <div className="absolute top-0 bottom-0 left-1/4 w-1/4 bg-green-500/50" />
              <div className="absolute top-0 bottom-0 left-2/4 w-1/6 bg-yellow-500/50" />
              <div className="absolute top-0 bottom-0 right-0 w-1/3 bg-red-500/50" />
              
              <motion.div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                initial={{ left: "0%" }}
                animate={{ left: `${percentage}%` }}
                transition={{ duration: 1, type: "spring" }}
              />
            </div>
             <div className="flex justify-between text-xs text-gray-500 w-full px-1">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass border border-blue-500/30 bg-transparent h-full">
          <CardContent className="p-8 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-blue-300 mb-6">Healthy Weight Range</h3>
            
            <p className="text-gray-300 mb-2">
              For your height, a normal weight would be between:
            </p>
            
            <div className="text-3xl font-bold text-white mb-6">
              {healthyWeightMin} - {healthyWeightMax} {system === "metric" ? "kg" : "lbs"}
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-200">
                Maintaining a healthy weight may reduce the risk of chronic diseases associated with overweight and obesity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
           { label: "Underweight", range: "< 18.5", color: "text-blue-400", border: "border-blue-500/30" },
           { label: "Normal", range: "18.5 - 25", color: "text-green-400", border: "border-green-500/30" },
           { label: "Overweight", range: "25 - 30", color: "text-yellow-400", border: "border-yellow-500/30" },
           { label: "Obese", range: "> 30", color: "text-red-400", border: "border-red-500/30" },
        ].map((item) => (
          <div key={item.label} className={`p-4 rounded-lg glass border ${item.border} text-center ${item.label === classification || (classification.includes("Obesity") && item.label === "Obese") ? "bg-white/10 ring-1 ring-white/20" : ""}`}>
             <div className={`font-bold ${item.color}`}>{item.label}</div>
             <div className="text-sm text-gray-400">{item.range}</div>
          </div>
        ))}
       </div>
    </motion.div>
  );
}
