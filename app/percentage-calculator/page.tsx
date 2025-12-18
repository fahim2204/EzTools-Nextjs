
import PercentageCalculator from "@/components/PercentageCalculator";

export const metadata = {
    title: 'Percentage Calculator - Calculate Percentages Easily',
    description: 'Easily calculate percentage increases, decreases, and find what percentage X is of Y.',
    alternates: {
        canonical: "https://ezcalc.xyz/percentage-calculator",
    },
    openGraph: {
        url: "https://ezcalc.xyz/percentage-calculator",
    },
};

export default function Page() {
  return <PercentageCalculator />;
}
