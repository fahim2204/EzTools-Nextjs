import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ezcalc.com'),
  title: {
    default: "Age Calculator – Exact Age, Life Stats & Fun Facts | EZCalc",
    template: "%s | EZCalc"
  },
  description: "Calculate your exact age in years, months, and days. Discover fascinating life insights including water consumed, oxygen inhaled, and famous people who share your birthday. Fast, accurate, and SEO-friendly age calculator.",
  keywords: [
    "age calculator",
    "calculate age by date of birth",
    "exact age today",
    "age in days calculator",
    "birthday calculator",
    "how old am i",
    "age counter",
    "life stats calculator",
    "famous birthdays"
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
    title: "Age Calculator – Exact Age, Life Stats & Fun Facts",
    description: "Calculate your exact age and discover fascinating life insights. See famous people born on your birthday!",
    siteName: "EZCalc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Age Calculator – Exact Age, Life Stats & Fun Facts",
    description: "Calculate your exact age and discover fascinating life insights.",
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
              "name": "Age Calculator",
              "description": "Calculate your exact age in years, months, and days with life insights and famous birthdays",
              "url": "https://ezcalc.com",
              "applicationCategory": "UtilityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Exact age calculation",
                "Life statistics insights",
                "Famous birthdays matching",
                "Next birthday countdown"
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
