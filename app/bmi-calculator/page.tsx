"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input, Tab, Tabs } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBMI, BMIResult, UnitSystem } from "@/lib/bmiCalculations";
import BMIResultsDisplay from "@/components/BMIResultsDisplay";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const bmiFAQs = [
  {
    question: "What is BMI?",
    answer: "Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight, and obesity in adults. It is defined as a person's weight in kilograms divided by the square of his height in meters (kg/m²)."
  },
  {
    question: "Is BMI accurate for everyone?",
    answer: "BMI is a useful screening tool but has limitations. It doesn't distinguish between muscle mass and fat mass. Athletes with high muscle mass might be classified as overweight despite having low body fat. It also doesn't account for age, sex, ethnicity, or fat distribution."
  },
  {
    question: "What is a healthy BMI range?",
    answer: "For most adults, a BMI between 18.5 and 24.9 is considered healthy. A BMI below 18.5 is considered underweight, between 25 and 29.9 is overweight, and 30 or higher is considered obese."
  },
  {
    question: "How often should I check my BMI?",
    answer: "Checking your BMI once a month is generally sufficient to track trends. However, focusing on overall healthy habits like diet and exercise is more important than obsessing over the number."
  }
];

export default function BMICalculator() {
  const [system, setSystem] = useState<UnitSystem>("metric");
  
  // Metric State
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  // Imperial State
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    let weight = 0;
    let height = 0;

    if (system === "metric") {
      if (!heightCm || !weightKg) {
        setError("Please enter both height and weight");
        return;
      }
      height = parseFloat(heightCm);
      weight = parseFloat(weightKg);
    } else {
      if (!heightFt || !heightIn || !weightLbs) {
        setError("Please enter height (ft & in) and weight");
        return;
      }
      height = parseFloat(heightFt) * 12 + parseFloat(heightIn);
      weight = parseFloat(weightLbs);
    }

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      setError("Please enter valid positive numbers");
      return;
    }

    const bmiResult = calculateBMI(weight, height, system);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculate', {
        event_category: 'calculator',
        event_label: 'BMI Calculator',
        value: bmiResult.bmi
      });
    }

    setResult(bmiResult);
  };

  const reset = () => {
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              BMI Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Calculate your Body Mass Index (BMI) to understand your health status and find your ideal weight range.
            </p>
          </motion.div>

          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <Card className="glass-strong border-2 border-purple-500/20 shadow-2xl shadow-purple-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                <Tabs 
                  selectedKey={system} 
                  onSelectionChange={(key) => {
                    setSystem(key as UnitSystem);
                    reset();
                  }}
                  color="secondary"
                  variant="bordered"
                  classNames={{
                    tabList: "bg-black/20 border-purple-500/20",
                    cursor: "bg-purple-500/20",
                    tabContent: "text-white group-data-[selected=true]:text-purple-300"
                  }}
                >
                  <Tab key="metric" title="Metric (kg/cm)" />
                  <Tab key="imperial" title="Imperial (lbs/ft)" />
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4">
                  {system === "metric" ? (
                    <>
                      <Input
                        type="number"
                        label="Height"
                        placeholder="175"
                        endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">cm</span></div>}
                        value={heightCm}
                        onValueChange={setHeightCm}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                          label: "text-gray-300",
                          input: "text-white",
                        }}
                      />
                      <Input
                        type="number"
                        label="Weight"
                        placeholder="70"
                        endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">kg</span></div>}
                        value={weightKg}
                        onValueChange={setWeightKg}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                          label: "text-gray-300",
                          input: "text-white",
                        }}
                      />
                    </>
                  ) : (
                    <>
                       <div className="flex gap-2">
                        <Input
                          type="number"
                          label="Height (Ft)"
                          placeholder="5"
                          value={heightFt}
                          onValueChange={setHeightFt}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                         <Input
                          type="number"
                          label="(In)"
                          placeholder="10"
                          value={heightIn}
                          onValueChange={setHeightIn}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                      </div>
                      <Input
                        type="number"
                        label="Weight"
                        placeholder="160"
                        endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">lbs</span></div>}
                        value={weightLbs}
                        onValueChange={setWeightLbs}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                          label: "text-gray-300",
                          input: "text-white",
                        }}
                      />
                    </>
                  )}
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button 
                  onPress={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25 text-white border-0"
                >
                  Calculate BMI
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 space-y-12"
          >
            <AdPlaceholder position="top" />

            <div id="results">
              <BMIResultsDisplay result={result} system={system} />
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={bmiFAQs} />
    </div>
  );
}
