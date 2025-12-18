import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index (BMI) to understand your health status and find your ideal weight range.",
  alternates: {
    canonical: "https://ezcalc.xyz/bmi-calculator",
  },
  openGraph: {
    url: "https://ezcalc.xyz/bmi-calculator",
  },
};

export default function BMICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
