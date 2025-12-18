
import LoanCalculator from "@/components/LoanCalculator";

export const metadata = {
    title: 'Loan Calculator - Calculate Monthly Payments & Interest',
    description: 'Calculate your monthly loan payments, total interest, and full repayment amount for personal loans, car loans, and more.',
    alternates: {
        canonical: "https://ezcalc.xyz/loan-calculator",
    },
    openGraph: {
        url: "https://ezcalc.xyz/loan-calculator",
    },
};

export default function Page() {
  return <LoanCalculator />;
}
