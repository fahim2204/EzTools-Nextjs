import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator",
  description: "Calculate your precise age, explore life insights, and discover which historical figures share your birthday.",
  alternates: {
    canonical: "https://ezcalc.xyz/age-calculator",
  },
  openGraph: {
    url: "https://ezcalc.xyz/age-calculator",
  },
};

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
