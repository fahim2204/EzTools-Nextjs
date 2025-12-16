"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input, Tab, Tabs } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const percentageFAQs = [
  {
    question: "How do I calculate a percentage of a number?",
    answer: "To calculate a percentage of a number, multiply the number by the percentage fraction. For example, to find 20% of 50, you calculate 50 * 0.20 = 10."
  },
  {
    question: "How do I calculate percentage increase?",
    answer: "Percentage increase is calculated by finding the difference between the two numbers, dividing it by the original number, and then multiplying by 100."
  },
  {
    question: "What is X as a percentage of Y?",
    answer: "To find what percentage X is of Y, divide X by Y and multiply by 100. For example, 5 is 50% of 10 because (5/10) * 100 = 50."
  }
];

type CalculationMode = "percentOf" | "whatPercent" | "increase";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<CalculationMode>("percentOf");
  
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);

    if (isNaN(v1) || isNaN(v2)) {
      setError("Please enter valid numbers");
      return;
    }

    let res = 0;

    if (mode === "percentOf") {
      // What is v1% of v2?
      res = (v1 / 100) * v2;
    } else if (mode === "whatPercent") {
      // v1 is what % of v2?
      if (v2 === 0) {
        setError("Cannot divide by zero");
        return;
      }
      res = (v1 / v2) * 100;
    } else if (mode === "increase") {
      // % change from v1 to v2
      if (v1 === 0) {
         setError("Initial value cannot be zero for percentage change");
         return;
      }
      res = ((v2 - v1) / v1) * 100;
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculate', {
        event_category: 'calculator',
        event_label: 'Percentage Calculator',
        calculator_mode: mode
      });
    }

    setResult(res);
  };

  const reset = () => {
    setResult(null);
    setError("");
    setVal1("");
    setVal2("");
  };

  const getResultText = () => {
    if (result === null) return "";
    if (mode === "percentOf") return `${val1}% of ${val2} is ${result}`;
    if (mode === "whatPercent") return `${val1} is ${result.toFixed(2)}% of ${val2}`;
    if (mode === "increase") {
        const type = result > 0 ? "Increase" : "Decrease";
        return `${type} of ${Math.abs(result).toFixed(2)}%`;
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Percentage Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Calculate percentages, percentage increase/decrease, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <Card className="glass-strong border-2 border-orange-500/20 shadow-2xl shadow-orange-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                 <Tabs 
                  selectedKey={mode} 
                  onSelectionChange={(key) => {
                    setMode(key as CalculationMode);
                    reset();
                  }}
                  color="warning"
                  variant="bordered"
                  classNames={{
                    tabList: "bg-black/20 border-orange-500/20",
                    cursor: "bg-orange-500/20",
                    tabContent: "text-white group-data-[selected=true]:text-orange-300"
                  }}
                >
                  <Tab key="percentOf" title="% Of" />
                  <Tab key="whatPercent" title="What %" />
                  <Tab key="increase" title="% Change" />
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4 items-center">
                  
                  {mode === "percentOf" && (
                    <div className="flex flex-col md:flex-row gap-4 items-center text-gray-300 text-lg">
                        <span>What is</span>
                        <Input
                          type="number"
                          placeholder="20"
                          value={val1}
                          onValueChange={setVal1}
                          endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">%</span></div>}
                          variant="bordered"
                            classNames={{
                                inputWrapper: "border-orange-500/30 bg-black/20 hover:bg-black/30 w-32",
                                input: "text-white text-center",
                            }}
                        />
                        <span>of</span>
                        <Input
                          type="number"
                          placeholder="50"
                          value={val2}
                          onValueChange={setVal2}
                          variant="bordered"
                            classNames={{
                                inputWrapper: "border-orange-500/30 bg-black/20 hover:bg-black/30 w-32",
                                input: "text-white text-center",
                            }}
                        />
                        <span>?</span>
                    </div>
                  )}

                   {mode === "whatPercent" && (
                    <div className="flex flex-col md:flex-row gap-4 items-center text-gray-300 text-lg">
                        <Input
                          type="number"
                          placeholder="25"
                          value={val1}
                          onValueChange={setVal1}
                          variant="bordered"
                            classNames={{
                                inputWrapper: "border-orange-500/30 bg-black/20 hover:bg-black/30 w-32",
                                input: "text-white text-center",
                            }}
                        />
                        <span>is what % of</span>
                         <Input
                          type="number"
                          placeholder="100"
                          value={val2}
                          onValueChange={setVal2}
                          variant="bordered"
                            classNames={{
                                inputWrapper: "border-orange-500/30 bg-black/20 hover:bg-black/30 w-32",
                                input: "text-white text-center",
                            }}
                        />
                         <span>?</span>
                    </div>
                  )}

                  {mode === "increase" && (
                    <div className="flex flex-col gap-4 text-gray-300 text-lg w-full">
                        <div className="flex items-center justify-between">
                            <span>From:</span>
                            <Input
                            type="number"
                            placeholder="Initial Value"
                            value={val1}
                            onValueChange={setVal1}
                            variant="bordered"
                                classNames={{
                                    inputWrapper: "border-orange-500/30 bg-black/20 hover:bg-black/30 w-48",
                                    input: "text-white text-right",
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>To:</span>
                             <Input
                            type="number"
                            placeholder="Final Value"
                            value={val2}
                            onValueChange={setVal2}
                            variant="bordered"
                                classNames={{
                                    inputWrapper: "border-orange-500/30 bg-black/20 hover:bg-black/30 w-48",
                                    input: "text-white text-right",
                                }}
                            />
                        </div>
                    </div>
                  )}

                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button 
                  onPress={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-orange-500/25 text-white border-0"
                >
                  Calculate
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 space-y-12"
          >
            <AdPlaceholder position="top" />

            <div id="results" className="max-w-2xl mx-auto">
               <Card className="glass-strong border-2 border-orange-500/20 p-8 text-center">
                 <h3 className="text-2xl text-gray-300 mb-4">Result</h3>
                 <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300">
                    {getResultText()}
                 </div>
               </Card>
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={percentageFAQs} />
    </div>
  );
}
