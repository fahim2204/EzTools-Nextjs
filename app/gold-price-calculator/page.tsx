
import GoldPriceCalculator from "@/components/GoldPriceCalculator";

export const metadata = {
    title: 'Gold Price Calculator - Calculate Gold Value Instantly',
    description: 'Calculate the value of your gold based on weight, purity (24k, 22k, etc.), and current market rates. Supports various units like grams, ounces, and tolas.',
};

export default function Page() {
  return <GoldPriceCalculator />;
}
