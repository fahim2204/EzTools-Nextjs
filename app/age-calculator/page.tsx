"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { calculateAge, calculateNextBirthday, calculateLifeInsights, AgeResult, NextBirthday, LifeInsights as LifeInsightsType } from "@/lib/ageCalculations";
import { getFamousBirthdays, FamousPerson } from "@/data/famousBirthdays";
import ResultsDisplay from "@/components/ResultsDisplay";
import LifeInsights from "@/components/LifeInsights";
import FamousBirthdays from "@/components/FamousBirthdays";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AgeCalculator() {
  const [inputValue, setInputValue] = useState("");
  const [date, setDate] = useState<Date>();
  const [isCalculated, setIsCalculated] = useState(false);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [nextBirthday, setNextBirthday] = useState<NextBirthday | null>(null);
  const [lifeInsights, setLifeInsights] = useState<LifeInsightsType | null>(null);
  const [famousPeople, setFamousPeople] = useState<FamousPerson[]>([]);
  const [error, setError] = useState("");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Attempt to parse date
    if (val.length === 10) {
      const parsedDate = parse(val, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
      } else {
        setDate(undefined);
      }
    } else {
      setDate(undefined);
    }
  };

  const handleCalculate = () => {
    setError("");
    
    if (!inputValue) {
      setError("Please enter a date");
      return;
    }

    const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
    if (!isValid(parsedDate)) {
      setError("Invalid date format. Use DD/MM/YYYY");
      return;
    }

    const today = new Date();
    if (parsedDate > today) {
      setError("Date must be in the past");
      return;
    }

    // Calculate
    const result = calculateAge(parsedDate);
    const nextBday = calculateNextBirthday(parsedDate);
    const insights = calculateLifeInsights(result.totalDays);
    const famous = getFamousBirthdays(parsedDate.getMonth(), parsedDate.getDate());

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
              <CardHeader>
                <CardTitle className="text-2xl text-center">Enter Date of Birth</CardTitle>
                <CardDescription className="text-center">
                  We'll calculate everything else for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="flex gap-2 relative">
                    <Input
                      id="dob"
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={inputValue}
                      onChange={handleInputChange}
                      className="bg-black/20 border-purple-500/30 focus-visible:ring-purple-500 pl-10"
                    />
                    <div className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none">
                       <CalendarIcon className="h-4 w-4" />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 border-purple-500/30 bg-black/20 hover:bg-black/30 text-muted-foreground hover:text-white"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xs text-muted-foreground ml-1">Format: DD/MM/YYYY</p>
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25"
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
