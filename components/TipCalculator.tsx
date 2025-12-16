"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input, Slider } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const tipFAQs = [
  {
    question: "How much should I tip?",
    answer: "Standard tipping in the US is typically 15-20% for sit-down service. For outstanding service, 20% or more is common."
  },
  {
    question: "Is the tip calculated on the total with or without tax?",
    answer: "It generally considered proper etiquette to calculate the tip based on the pre-tax bill amount."
  },
  {
    question: "Does this calculate split bills?",
    answer: "Yes, this calculator allows you to enter the number of people to easily split the total amounts."
  }
];

type TipResult = {
  tipAmount: number;
  totalWithTip: number;
  tipPerPerson: number;
  totalPerPerson: number;
};

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState("1");
  
  const [result, setResult] = useState<TipResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const b = parseFloat(bill);
    const p = parseFloat(people);
    const t = tipPercent;

    if (isNaN(b) || isNaN(p) || b <= 0 || p <= 0) {
      setError("Please enter valid positive numbers for bill and people");
      return;
    }
    
    // Check for realistic number of people (simple sanity check, not strictly required but good for UX)
    if (!Number.isInteger(p)) {
         setError("Number of people should be a whole number");
         return;
    }

    const tipAmt = b * (t / 100);
    const total = b + tipAmt;
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculate', {
        event_category: 'calculator',
        event_label: 'Tip Calculator',
        value: tipAmt
      });
    }

    setResult({
      tipAmount: tipAmt,
      totalWithTip: total,
      tipPerPerson: tipAmt / p,
      totalPerPerson: total / p
    });
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
              Tip Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Quickly calculate tips and split bills among friends.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <Card className="glass-strong border-2 border-pink-500/20 shadow-2xl shadow-pink-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                <h2 className="text-2xl font-semibold text-pink-500">Bill Details</h2>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-6">
                  <Input
                    type="number"
                    label="Bill Amount"
                    placeholder="50.00"
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                    value={bill}
                    onValueChange={setBill}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-pink-500/30 bg-black/20 hover:bg-black/30",
                      label: "text-gray-300",
                      input: "text-white",
                    }}
                  />
                  
                   <div>
                        <div className="flex justify-between mb-2">
                             <label className="text-gray-300 text-sm">Tip Percentage</label>
                             <span className="text-pink-400 font-bold">{tipPercent}%</span>
                        </div>
                        <Slider 
                            aria-label="Tip Percentage"
                            step={1} 
                            maxValue={50} 
                            minValue={0} 
                            value={tipPercent} 
                            onChange={(v) => setTipPercent(v as number)}
                            className="max-w-md"
                            color="danger"
                            classNames={{
                                track: "bg-pink-500/30",
                                filler: "bg-pink-500",
                                thumb: "bg-pink-400 border-2 border-white shadow-lg"
                            }}
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                             <span onClick={() => setTipPercent(10)} className="cursor-pointer hover:text-white">10%</span>
                             <span onClick={() => setTipPercent(15)} className="cursor-pointer hover:text-white">15%</span>
                             <span onClick={() => setTipPercent(18)} className="cursor-pointer hover:text-white">18%</span>
                             <span onClick={() => setTipPercent(20)} className="cursor-pointer hover:text-white">20%</span>
                             <span onClick={() => setTipPercent(25)} className="cursor-pointer hover:text-white">25%</span>
                        </div>
                   </div>

                  <Input
                    type="number"
                    label="Number of People"
                    placeholder="1"
                    value={people}
                    onValueChange={setPeople}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-pink-500/30 bg-black/20 hover:bg-black/30",
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
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-pink-500/25 text-white border-0"
                >
                  Calculate Tip
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

            <div id="results" className="max-w-4xl mx-auto">
               <div className="grid md:grid-cols-2 gap-6">
                 {/* Total Summary */}
                 <Card className="glass-strong border-2 border-pink-500/20 p-6">
                   <h3 className="text-pink-400 text-lg font-semibold mb-4 border-b border-pink-500/20 pb-2">Total</h3>
                   <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Total Tip</span>
                        <span className="text-2xl font-bold text-white">
                            {result.tipAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                   </div>
                   <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Bill</span>
                        <span className="text-2xl font-bold text-pink-300">
                             {result.totalWithTip.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                   </div>
                 </Card>

                 {/* Per Person Summary */}
                 <Card className="glass-strong border-2 border-pink-500/20 p-6">
                   <h3 className="text-pink-400 text-lg font-semibold mb-4 border-b border-pink-500/20 pb-2">Per Person</h3>
                   <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Tip / Person</span>
                        <span className="text-2xl font-bold text-white">
                             {result.tipPerPerson.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                   </div>
                   <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total / Person</span>
                         <span className="text-2xl font-bold text-pink-300">
                             {result.totalPerPerson.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                   </div>
                 </Card>
               </div>
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={tipFAQs} />
    </div>
  );
}
