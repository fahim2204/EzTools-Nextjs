
import MortgageCalculator from "@/components/MortgageCalculator";

export const metadata = {
    title: 'Mortgage Calculator - Estimate Monthly Payments',
    description: 'Calculate your monthly mortgage payments including principal, interest, taxes, and insurance. Plan your home purchase with confidence.',
};

export default function Page() {
  return <MortgageCalculator />;
}
