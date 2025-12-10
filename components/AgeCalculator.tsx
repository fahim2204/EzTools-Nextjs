"use client";

import { useState } from "react";
import { Card, CardBody, Button, DatePicker } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { motion } from "framer-motion";

interface AgeCalculatorProps {
  onCalculate: (date: Date) => void;
}

export default function AgeCalculator({ onCalculate }: AgeCalculatorProps) {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    if (!selectedDate) {
      setError("Please select your date of birth");
      return;
    }

    const birthDate = new Date(
      selectedDate.year,
      selectedDate.month - 1,
      selectedDate.day
    );

    const today = new Date();
    if (birthDate > today) {
      setError("Birth date cannot be in the future");
      return;
    }

    setError("");
    onCalculate(birthDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="glass-strong border-2 border-purple-500/20 shadow-2xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Age Calculator
            </h1>
            <p className="text-gray-400 text-lg">
              Discover your exact age and fascinating life insights
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Select Your Date of Birth
              </label>
              <DatePicker
                label="Birth Date"
                variant="bordered"
                size="lg"
                className="w-full"
                classNames={{
                  input: "text-lg",
                  inputWrapper: "border-purple-500/30 hover:border-purple-500/50",
                }}
                value={selectedDate}
                onChange={setSelectedDate}
                showMonthAndYearPickers
                maxValue={parseDate(new Date().toISOString().split('T')[0])}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-7 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              onPress={handleCalculate}
            >
              Calculate My Age ✨
            </Button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Last updated: December 2025
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
