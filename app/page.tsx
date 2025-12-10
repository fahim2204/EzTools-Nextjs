"use client";

import { useState } from "react";
import AgeCalculator from "@/components/AgeCalculator";
import ResultsDisplay from "@/components/ResultsDisplay";
import LifeInsights from "@/components/LifeInsights";
import FamousBirthdays from "@/components/FamousBirthdays";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";
import {
  calculateAge,
  calculateNextBirthday,
  calculateLifeInsights,
  AgeResult,
  NextBirthday,
  LifeInsights as LifeInsightsType,
} from "@/lib/ageCalculations";
import { getFamousBirthdays, FamousPerson } from "@/data/famousBirthdays";

export default function Home() {
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [nextBirthday, setNextBirthday] = useState<NextBirthday | null>(null);
  const [lifeInsights, setLifeInsights] = useState<LifeInsightsType | null>(null);
  const [famousPeople, setFamousPeople] = useState<FamousPerson[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (birthDate: Date) => {
    const age = calculateAge(birthDate);
    const birthday = calculateNextBirthday(birthDate);
    const insights = calculateLifeInsights(age.totalDays);
    const famous = getFamousBirthdays(birthDate.getMonth(), birthDate.getDate());

    setAgeResult(age);
    setNextBirthday(birthday);
    setLifeInsights(insights);
    setFamousPeople(famous);
    setShowResults(true);

    // Smooth scroll to results
    setTimeout(() => {
      window.scrollTo({
        top: 600,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 gradient-text">
            EZCalc
          </h1>
          <p className="text-xl text-gray-400">
            Calculate Your Age & Discover Life Insights
          </p>
        </div>

        {/* Main Calculator */}
        <AgeCalculator onCalculate={handleCalculate} />

        {/* Results Section */}
        {showResults && ageResult && nextBirthday && (
          <>
            {/* Ad Space - Above Results */}
            <AdPlaceholder position="top" />

            {/* Age Results */}
            <ResultsDisplay ageResult={ageResult} nextBirthday={nextBirthday} />

            {/* Life Insights */}
            {lifeInsights && <LifeInsights insights={lifeInsights} />}

            {/* Ad Space - Below Insights */}
            <AdPlaceholder position="bottom" />

            {/* Famous Birthdays */}
            <FamousBirthdays people={famousPeople} />

            {/* FAQ Section */}
            <FAQ />
          </>
        )}

        {/* SEO Content */}
        {!showResults && (
          <div className="max-w-4xl mx-auto mt-16 glass-strong rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              About Our Age Calculator
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Welcome to EZCalc's Age Calculator – your go-to tool for calculating your exact age 
                with precision and discovering fascinating insights about your life journey. Our 
                calculator goes beyond simple age calculation to provide you with engaging statistics 
                and fun facts.
              </p>
              <h3 className="text-xl font-semibold text-purple-300 mt-6">Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Calculate your exact age in years, months, and days</li>
                <li>See your total time lived in days, hours, and minutes</li>
                <li>Countdown to your next birthday with real-time updates</li>
                <li>Discover fascinating life insights (water consumed, oxygen inhaled, CO₂ exhaled)</li>
                <li>Find famous people who share your birthday</li>
                <li>Fast, accurate, and completely free to use</li>
              </ul>
              <p className="mt-6">
                Whether you're curious about your exact age, want to know how many days you've been 
                alive, or discover which celebrities share your birthday, our age calculator provides 
                all the answers in a beautiful, easy-to-use interface.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm pb-8">
          <p>© 2025 EZCalc. All rights reserved.</p>
          <p className="mt-2">
            Fast, accurate age calculator with life insights and famous birthdays
          </p>
        </footer>
      </div>
    </main>
  );
}
