"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input, Tab, Tabs } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBMI, BMIResult } from "@/lib/bmiCalculations";
import BMIResultsDisplay from "@/components/BMIResultsDisplay";
import FAQ from "@/components/FAQ";


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
  const [heightUnit, setHeightUnit] = useState<"metric" | "imperial">("metric");
  const [weightUnit, setWeightUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  
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
    let heightInCm = 0;
    let weightInKg = 0;

    // Convert height to cm
    if (heightUnit === "metric") {
      if (!heightCm) {
        setError("Please enter height");
        return;
      }
      heightInCm = parseFloat(heightCm);
    } else {
      if (!heightFt || !heightIn) {
        setError("Please enter height (ft & in)");
        return;
      }
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn);
      heightInCm = totalInches * 2.54; // Convert inches to cm
    }

    // Convert weight to kg
    if (weightUnit === "metric") {
      if (!weightKg) {
        setError("Please enter weight");
        return;
      }
      weightInKg = parseFloat(weightKg);
    } else {
      if (!weightLbs) {
        setError("Please enter weight");
        return;
      }
      weightInKg = parseFloat(weightLbs) * 0.453592; // Convert lbs to kg
    }

    if (isNaN(heightInCm) || isNaN(weightInKg) || heightInCm <= 0 || weightInKg <= 0) {
      setError("Please enter valid positive numbers");
      return;
    }

    // Calculate BMI using metric system
    const bmiResult = calculateBMI(weightInKg, heightInCm, "metric");
    
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

  useEffect(() => {
    if (result) {
      const resultsElement = document.getElementById("results");
      if (resultsElement) {
        setTimeout(() => {
          const elementPosition = resultsElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - 100; // 100px offset for navbar
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
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
              <CardHeader className="flex flex-col gap-4 pb-0">
                <h3 className="text-lg font-semibold text-gray-300">Select Gender</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender("male")}
                    className={`aspect-square p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                      gender === "male"
                        ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25"
                        : "border-purple-500/30 bg-black/20 hover:bg-black/30"
                    }`}
                  >
                    <div className="text-4xl mb-2">👨</div>
                    <div className="text-sm font-medium text-gray-300">Male</div>
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`aspect-square p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                      gender === "female"
                        ? "border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/25"
                        : "border-purple-500/30 bg-black/20 hover:bg-black/30"
                    }`}
                  >
                    <div className="text-4xl mb-2">👩</div>
                    <div className="text-sm font-medium text-gray-300">Female</div>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Height Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Height</label>
                    <Tabs 
                      selectedKey={heightUnit} 
                      onSelectionChange={(key) => setHeightUnit(key as "metric" | "imperial")}
                      size="sm"
                      color="secondary"
                      variant="bordered"
                      classNames={{
                        tabList: "bg-black/20 border-purple-500/20",
                        cursor: "bg-purple-500/20",
                        tabContent: "text-white group-data-[selected=true]:text-purple-300"
                      }}
                    >
                      <Tab key="metric" title="cm" />
                      <Tab key="imperial" title="ft/in" />
                    </Tabs>
                  </div>
                  {heightUnit === "metric" ? (
                    <Input
                      type="number"
                      placeholder="175"
                      endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">cm</span></div>}
                      value={heightCm}
                      onValueChange={setHeightCm}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                        input: "text-white placeholder:text-gray-700",
                      }}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="5"
                        endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">ft</span></div>}
                        value={heightFt}
                        onValueChange={setHeightFt}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                          input: "text-white placeholder:text-gray-700",
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="10"
                        endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">in</span></div>}
                        value={heightIn}
                        onValueChange={setHeightIn}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                          input: "text-white placeholder:text-gray-700",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Weight Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Weight</label>
                    <Tabs 
                      selectedKey={weightUnit} 
                      onSelectionChange={(key) => setWeightUnit(key as "metric" | "imperial")}
                      size="sm"
                      color="secondary"
                      variant="bordered"
                      classNames={{
                        tabList: "bg-black/20 border-purple-500/20",
                        cursor: "bg-purple-500/20",
                        tabContent: "text-white group-data-[selected=true]:text-purple-300"
                      }}
                    >
                      <Tab key="metric" title="kg" />
                      <Tab key="imperial" title="lbs" />
                    </Tabs>
                  </div>
                  {weightUnit === "metric" ? (
                    <Input
                      type="number"
                      placeholder="70"
                      endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">kg</span></div>}
                      value={weightKg}
                      onValueChange={setWeightKg}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                        input: "text-white placeholder:text-gray-700",
                      }}
                    />
                  ) : (
                    <Input
                      type="number"
                      placeholder="160"
                      endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">lbs</span></div>}
                      value={weightLbs}
                      onValueChange={setWeightLbs}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                        input: "text-white placeholder:text-gray-700",
                      }}
                    />
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


            <div id="results">
              <BMIResultsDisplay result={result} system="metric" />
            </div>


          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={bmiFAQs} />
    </div>
  );
}
