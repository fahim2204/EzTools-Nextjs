import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ezcalc.com'),
  title: {
    default: "Free Online Calculators – Age, BMI, Gold Price, Land & More | EZCalc",
    template: "%s | EZCalc"
  },
  description: "Free online calculators for age, BMI, gold prices, land area, loans, mortgages, percentages, tips, and more. Fast, accurate, and easy-to-use calculators for all your needs.",
  keywords: [
    "free online calculators",
    "age calculator",
    "BMI calculator",
    "gold price calculator",
    "land calculator",
    "loan calculator",
    "mortgage calculator",
    "percentage calculator",
    "tip calculator",
    "unit converter",
    "financial calculator",
    "health calculator",
    "measurement calculator"
  ],
  authors: [{ name: "EZCalc" }],
  creator: "EZCalc",
  publisher: "EZCalc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ezcalc.com",
    title: "Free Online Calculators – Age, BMI, Gold Price, Land & More",
    description: "Calculate anything with our free online calculators. Age, BMI, gold prices, land area, loans, and more. Fast, accurate, and easy to use.",
    siteName: "EZCalc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Calculators – Age, BMI, Gold Price, Land & More",
    description: "Calculate anything with our free online calculators. Fast, accurate, and easy to use.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "EZCalc - Free Online Calculators",
              "description": "Free online calculators for age, BMI, gold prices, land area, loans, mortgages, percentages, tips, and more",
              "url": "https://ezcalc.com",
              "applicationCategory": "UtilityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Age calculator with life insights",
                "BMI calculator",
                "Gold price calculator",
                "Land area calculator",
                "Loan and mortgage calculators",
                "Percentage calculator",
                "Tip calculator",
                "Free and easy to use"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
