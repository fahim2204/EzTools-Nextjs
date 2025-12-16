"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const goldFAQs = [
  {
    question: "How is gold price calculated?",
    answer: "Gold price is calculated by multiplying the weight of the gold by the current market rate per unit (gram, ounce, tola) and purity factor."
  },
  {
    question: "What is the difference between 24k and 22k gold?",
    answer: "24k gold is 99.9% pure, while 22k gold is 91.6% pure. 22k is often used for jewelry as it is more durable."
  },
  {
    question: "What is a Tola?",
    answer: "Tola is a traditional unit of mass used in South Asia, equal to approximately 11.66 grams."
  }
];

export default function GoldPriceCalculator() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("gram");
  const [purity, setPurity] = useState("24k");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!weight || !rate) {
      setError("Please enter weight and rate");
      return;
    }

    const w = parseFloat(weight);
    const r = parseFloat(rate);

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
      setError("Please enter valid positive numbers");
      return;
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculate', {
        event_category: 'calculator',
        event_label: 'Gold Price Calculator',
        value: w
      });
    }

    setResult(w * r);
  };

  const reset = () => {
    setResult(null);
    setError("");
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
              Gold Price Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Calculate the value of your gold based on weight, purity, and current market rates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <Card className="glass-strong border-2 border-yellow-500/20 shadow-2xl shadow-yellow-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                <h2 className="text-2xl font-semibold text-yellow-500">Calculate Value</h2>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      label="Weight"
                      placeholder="10"
                      value={weight}
                      onValueChange={setWeight}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-yellow-500/30 bg-black/20 hover:bg-black/30",
                        label: "text-gray-300",
                        input: "text-white",
                      }}
                      className="flex-grow"
                    />
                    <Select
                      label="Unit"
                      selectedKeys={[unit]}
                      onChange={(e) => setUnit(e.target.value)}
                      variant="bordered"
                      classNames={{
                        trigger: "border-yellow-500/30 bg-black/20 hover:bg-black/30",
                        value: "text-white",
                        popoverContent: "bg-gray-900 border border-yellow-500/30",
                      }}
                      className="w-32"
                    >
                      <SelectItem key="gram" value="gram" className="text-gray-300">Gram</SelectItem>
                      <SelectItem key="ounce" value="ounce" className="text-gray-300">Ounce</SelectItem>
                      <SelectItem key="tola" value="tola" className="text-gray-300">Tola</SelectItem>
                    </Select>
                  </div>
                  
                  <Select
                    label="Purity"
                    selectedKeys={[purity]}
                    onChange={(e) => setPurity(e.target.value)}
                    variant="bordered"
                    classNames={{
                        trigger: "border-yellow-500/30 bg-black/20 hover:bg-black/30",
                        value: "text-white",
                        popoverContent: "bg-gray-900 border border-yellow-500/30",
                    }}
                  >
                    <SelectItem key="24k" value="24k" className="text-gray-300">24k (99.9%)</SelectItem>
                    <SelectItem key="22k" value="22k" className="text-gray-300">22k (91.6%)</SelectItem>
                    <SelectItem key="21k" value="21k" className="text-gray-300">21k (87.5%)</SelectItem>
                    <SelectItem key="18k" value="18k" className="text-gray-300">18k (75.0%)</SelectItem>
                  </Select>

                  <Input
                    type="number"
                    label={`Rate per ${unit}`}
                    placeholder="Rate"
                    value={rate}
                    onValueChange={setRate}
                    variant="bordered"
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                    classNames={{
                      inputWrapper: "border-yellow-500/30 bg-black/20 hover:bg-black/30",
                      label: "text-gray-300",
                      input: "text-white",
                    }}
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button 
                  onPress={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-yellow-500/25 text-white border-0"
                >
                  Calculate Value
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

            <div id="results" className="max-w-4xl mx-auto">
               <Card className="glass-strong border-2 border-yellow-500/20 p-8 text-center">
                 <h3 className="text-2xl text-gray-300 mb-2">Total Value</h3>
                 <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300">
                    {result.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                 </div>
                 <p className="text-gray-400 mt-4">
                    Based on {weight} {unit} of {purity} gold at {parseFloat(rate).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/{unit}
                 </p>
               </Card>
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={goldFAQs} />
    </div>
  );
}
