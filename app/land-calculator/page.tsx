
import LandCalculator from "@/components/LandCalculator";

export const metadata = {
    title: 'Land Calculator - Calculate Land Area in Sq Ft, Acres, Hectares',
    description: 'Calculate land area for varied shapes (rectangle, triangle, circle) and convert between different units like square feet, square meters, acres, and hectares.',
};

export default function Page() {
  return <LandCalculator />;
}
