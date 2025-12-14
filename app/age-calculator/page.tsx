"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAge, calculateNextBirthday, calculateLifeInsights, AgeResult, NextBirthday, LifeInsights as LifeInsightsType } from "@/lib/ageCalculations";
import { getFamousBirthdays, FamousPerson } from "@/data/famousBirthdays";
import ResultsDisplay from "@/components/ResultsDisplay";
import LifeInsights from "@/components/LifeInsights";
import FamousBirthdays from "@/components/FamousBirthdays";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function AgeCalculator() {
  const [date, setDate] = useState<CalendarDate | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [nextBirthday, setNextBirthday] = useState<NextBirthday | null>(null);
  const [lifeInsights, setLifeInsights] = useState<LifeInsightsType | null>(null);
  const [famousPeople, setFamousPeople] = useState<FamousPerson[]>([]);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    
    if (!date) {
      setError("Please enter a date");
      return;
    }

    const nativeDate = date.toDate(getLocalTimeZone());
    const todayDate = new Date();

    if (nativeDate > todayDate) {
      setError("Date must be in the past");
      return;
    }

    // Calculate
    const result = calculateAge(nativeDate);
    const nextBday = calculateNextBirthday(nativeDate);
    const insights = calculateLifeInsights(result.totalDays);
    const famous = getFamousBirthdays(nativeDate.getMonth(), nativeDate.getDate());

    setAgeResult(result);
    setNextBirthday(nextBday);
    setLifeInsights(insights);
    setFamousPeople(famous);
    setIsCalculated(true);
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
              Age Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Calculate your precise age, explore life insights, and discover which historical figures share your birthday.
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
                <h3 className="text-2xl font-bold text-center text-white">Enter Date of Birth</h3>
                <p className="text-sm text-gray-400 text-center">
                  We'll calculate everything else for you
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex flex-col space-y-2">
                  <DatePicker 
                    label="Date of Birth"
                    variant="bordered"
                    showMonthAndYearPickers
                    value={date} 
                    onChange={setDate}
                    maxValue={today(getLocalTimeZone())}
                    description="Format: MM/DD/YYYY"
                    className="max-w-full"
                    classNames={{
                      inputWrapper: "border-purple-500/30 bg-black/20 hover:bg-black/30",
                      label: "text-gray-300",
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
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25 text-white border-0"
                >
                  Calculate Age
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <AnimatePresence>
        {isCalculated && ageResult && nextBirthday && lifeInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 space-y-12"
          >
            <AdPlaceholder position="top" />

            <div id="results">
              <ResultsDisplay ageResult={ageResult} nextBirthday={nextBirthday} />
            </div>

            <LifeInsights insights={lifeInsights} />
            
            <FamousBirthdays people={famousPeople} />

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ />
    </div>
  );
}
