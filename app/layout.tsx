import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ezcalc.xyz'),
  title: {
    default: "Free Online Calculators – Age, BMI, Gold Price, Land & More | EZCalc",
    template: "%s | EZCalc"
  },
  applicationName: "EZCalc",
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
  alternates: {
    canonical: "https://ezcalc.xyz",
  },
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
    url: "https://ezcalc.xyz",
    title: "Free Online Calculators - Age, BMI, Gold Price, Land & More",
    description: "Calculate anything with our free online calculators. Age, BMI, gold prices, land area, loans, and more. Fast, accurate, and easy to use.",
    siteName: "EZCalc",
    images: [
      {
        url: "/images/ezcalc.webp",
        width: 1024,
        height: 1024,
        alt: "EZCalc - Free Online Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Calculators - Age, BMI, Gold Price, Land & More",
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
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y11DNC9PE3"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y11DNC9PE3');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "EZCalc",
                "url": "https://ezcalc.xyz",
                "description": "Free online calculators for age, BMI, gold prices, land area, loans, mortgages, percentages, tips, and more"
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "EZCalc - Free Online Calculators",
                "description": "Free online calculators for age, BMI, gold prices, land area, loans, mortgages, percentages, tips, and more",
                "url": "https://ezcalc.xyz",
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
              }
            ])
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
