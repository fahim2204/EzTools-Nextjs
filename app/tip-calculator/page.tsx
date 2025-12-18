
import TipCalculator from "@/components/TipCalculator";

export const metadata = {
    title: 'Tip Calculator - Calculate Tips & Split Bills',
    description: 'Calculate gratuity and split bills among friends easily. Customize tip percentages and see the cost per person.',
    alternates: {
        canonical: "https://ezcalc.xyz/tip-calculator",
    },
    openGraph: {
        url: "https://ezcalc.xyz/tip-calculator",
    },
};

export default function Page() {
  return <TipCalculator />;
}
