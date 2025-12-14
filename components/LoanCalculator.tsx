"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const loanFAQs = [
  {
    question: "How is the monthly payment calculated?",
    answer: "The monthly payment is calculated using the formula: M = P [i(1 + i)^n] / [(1 + i)^n – 1], where P is the principal loan amount, i is the monthly interest rate, and n is the number of months."
  },
  {
    question: "Does this calculator include extra fees?",
    answer: "This basic calculator only accounts for the principal and interest. It does not include additional fees, insurance, or taxes that might be part of your actual loan agreement."
  },
  {
    question: "What happens if I change the loan term?",
    answer: "Increasing the loan term generally lowers your monthly payment but increases the total amount of interest you pay over the life of the loan."
  }
];

type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [years, setYears] = useState("");
  
  const [result, setResult] = useState<LoanResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    
    if (!amount || !interest || !years) {
      setError("Please fill in all fields");
      return;
    }

    const p = parseFloat(amount); // Principal
    const r = parseFloat(interest) / 100 / 12; // Monthly interest rate
    const n = parseFloat(years) * 12; // Total number of payments

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
       // Handle simple interest (rate 0) case or invalid inputs
       if (parseFloat(interest) === 0 && p > 0 && n > 0) {
            setResult({
                monthlyPayment: p / n,
                totalPayment: p,
                totalInterest: 0
            });
            return;
       }
       setError("Please enter valid positive numbers");
       return;
    }

    // Formula: M = P [i(1 + i)^n] / [(1 + i)^n – 1]
    const x = Math.pow(1 + r, n);
    const monthly = (p * x * r) / (x - 1);
    
    if (isNaN(monthly) || !isFinite(monthly)) {
        setError("Calculation error. Please check inputs.");
        return;
    }

    setResult({
      monthlyPayment: monthly,
      totalPayment: monthly * n,
      totalInterest: (monthly * n) - p
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
              Loan Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Estimate your monthly loan payments and total interest costs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <Card className="glass-strong border-2 border-blue-500/20 shadow-2xl shadow-blue-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                <h2 className="text-2xl font-semibold text-blue-500">Loan Details</h2>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4">
                  <Input
                    type="number"
                    label="Loan Amount"
                    placeholder="25000"
                    startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                    value={amount}
                    onValueChange={setAmount}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-blue-500/30 bg-black/20 hover:bg-black/30",
                      label: "text-gray-300",
                      input: "text-white",
                    }}
                  />
                  <Input
                    type="number"
                    label="Interest Rate"
                    placeholder="5.5"
                    endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">%</span></div>}
                    value={interest}
                    onValueChange={setInterest}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-blue-500/30 bg-black/20 hover:bg-black/30",
                      label: "text-gray-300",
                      input: "text-white",
                    }}
                  />
                  <Input
                    type="number"
                    label="Loan Term"
                    placeholder="5"
                    endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">Years</span></div>}
                    value={years}
                    onValueChange={setYears}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-blue-500/30 bg-black/20 hover:bg-black/30",
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
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25 text-white border-0"
                >
                  Calculate Repayment
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
               <div className="grid md:grid-cols-3 gap-6">
                 <Card className="glass-strong border-2 border-blue-500/20 p-6 text-center">
                   <h3 className="text-gray-400 mb-2">Monthly Payment</h3>
                   <div className="text-3xl font-bold text-white">
                      {result.monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                   </div>
                 </Card>
                 <Card className="glass-strong border-2 border-blue-500/20 p-6 text-center">
                   <h3 className="text-gray-400 mb-2">Total Interest</h3>
                   <div className="text-3xl font-bold text-blue-400">
                      {result.totalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                   </div>
                 </Card>
                 <Card className="glass-strong border-2 border-blue-500/20 p-6 text-center">
                   <h3 className="text-gray-400 mb-2">Total Cost</h3>
                   <div className="text-3xl font-bold text-cyan-400">
                      {result.totalPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                   </div>
                 </Card>
               </div>
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={loanFAQs} />
    </div>
  );
}
