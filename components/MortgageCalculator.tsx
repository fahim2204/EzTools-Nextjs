"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const mortgageFAQs = [
  {
    question: "What is included in this mortgage calculation?",
    answer: "This calculator estimates your monthly principal and interest payments. It also includes estimates for property taxes and home insurance if you provide them, giving you a better idea of your total monthly housing cost."
  },
  {
    question: "How does a down payment affect my mortgage?",
    answer: "A larger down payment reduces the principal loan amount, which lowers your monthly payments and the total interest paid over the life of the loan. It may also help you avoid Private Mortgage Insurance (PMI)."
  },
  {
    question: "What is a typical loan term?",
    answer: "The most common loan terms are 15 and 30 years. A 30-year term has lower monthly payments but higher total interest costs, while a 15-year term has higher monthly payments but saves significantly on interest."
  }
];

type MortgageResult = {
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  totalMonthly: number;
};

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("60000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTax, setPropertyTax] = useState("3000"); // Annual
  const [homeInsurance, setHomeInsurance] = useState("1200"); // Annual
  
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    
    // Parse inputs
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);
    const tax = parseFloat(propertyTax) || 0;
    const insurance = parseFloat(homeInsurance) || 0;

    // Validate
    if (isNaN(price) || isNaN(down) || isNaN(rate) || isNaN(term) || price <= 0 || term <= 0) {
      setError("Please enter valid positive numbers for core fields");
      return;
    }

    if (down >= price) {
        setError("Down payment cannot equal or exceed home price");
        return;
    }

    const principal = price - down;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    // Principal & Interest
    let monthlyPI = 0;
    if (rate === 0) {
        monthlyPI = principal / numPayments;
    } else {
        const x = Math.pow(1 + monthlyRate, numPayments);
        monthlyPI = (principal * x * monthlyRate) / (x - 1);
    }

    // Monthly Tax & Insurance
    const monthlyT = tax / 12;
    const monthlyI = insurance / 12;

    setResult({
      monthlyPrincipalInterest: monthlyPI,
      monthlyTax: monthlyT,
      monthlyInsurance: monthlyI,
      totalMonthly: monthlyPI + monthlyT + monthlyI
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
              Mortgage Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Calculate your estimated monthly mortgage payments including tax and insurance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-strong border-2 border-indigo-500/20 shadow-2xl shadow-indigo-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                <h2 className="text-2xl font-semibold text-indigo-500">Mortgage Details</h2>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column: Core Loan Info */}
                    <div className="space-y-4">
                        <Input
                            type="number"
                            label="Home Price"
                            startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                            value={homePrice}
                            onValueChange={setHomePrice}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-indigo-500/30 bg-black/20 hover:bg-black/30",
                                label: "text-gray-300",
                                input: "text-white",
                            }}
                        />
                        <Input
                            type="number"
                            label="Down Payment"
                            startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                            value={downPayment}
                            onValueChange={setDownPayment}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-indigo-500/30 bg-black/20 hover:bg-black/30",
                                label: "text-gray-300",
                                input: "text-white",
                            }}
                        />
                        <Input
                            type="number"
                            label="Interest Rate"
                            endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">%</span></div>}
                            value={interestRate}
                            onValueChange={setInterestRate}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-indigo-500/30 bg-black/20 hover:bg-black/30",
                                label: "text-gray-300",
                                input: "text-white",
                            }}
                        />
                        <Input
                            type="number"
                            label="Loan Term"
                            endContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">Years</span></div>}
                            value={loanTerm}
                            onValueChange={setLoanTerm}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-indigo-500/30 bg-black/20 hover:bg-black/30",
                                label: "text-gray-300",
                                input: "text-white",
                            }}
                        />
                    </div>

                    {/* Right Column: Extras (Tax, Insurance) */}
                    <div className="space-y-4">
                        <Input
                            type="number"
                            label="Annual Property Tax"
                            startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                            value={propertyTax}
                            onValueChange={setPropertyTax}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-indigo-500/30 bg-black/20 hover:bg-black/30",
                                label: "text-gray-300",
                                input: "text-white",
                            }}
                        />
                        <Input
                            type="number"
                            label="Annual Home Insurance"
                            startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">$</span></div>}
                            value={homeInsurance}
                            onValueChange={setHomeInsurance}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-indigo-500/30 bg-black/20 hover:bg-black/30",
                                label: "text-gray-300",
                                input: "text-white",
                            }}
                        />
                        <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-sm text-gray-400">
                            <p>Taxes and insurance can vary significantly by location. These are estimates added to your monthly payment.</p>
                        </div>
                    </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button 
                  onPress={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg shadow-indigo-500/25 text-white border-0"
                >
                  Calculate Mortgage
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
               <Card className="glass-strong border-2 border-indigo-500/20 p-8">
                 <div className="text-center mb-8">
                    <h3 className="text-2xl text-gray-300 mb-2">Total Monthly Payment</h3>
                    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-300">
                        {result.totalMonthly.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                 </div>

                 <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-700">
                     <div className="text-center">
                        <p className="text-gray-400 text-sm">Principal & Interest</p>
                        <p className="text-xl font-semibold text-white">
                            {result.monthlyPrincipalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                     </div>
                     <div className="text-center">
                        <p className="text-gray-400 text-sm">Property Tax</p>
                        <p className="text-xl font-semibold text-white">
                            {result.monthlyTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                     </div>
                     <div className="text-center">
                        <p className="text-gray-400 text-sm">Home Insurance</p>
                        <p className="text-xl font-semibold text-white">
                            {result.monthlyInsurance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                     </div>
                 </div>
               </Card>
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={mortgageFAQs} />
    </div>
  );
}
