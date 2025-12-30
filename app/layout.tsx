import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import DeferredScripts from "@/components/DeferredScripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://imagepix.xyz'),
  title: {
    default: "ImagePix – Fast Tools for Images, PDFs & Audio",
    template: "%s | ImagePix"
  },
  applicationName: "ImagePix",
  description: "Fast, privacy-friendly online tools for images, PDFs, and audio. Resize, crop, convert, and compress files directly in your browser. No installation required.",
  keywords: [
    "ImagePix",
    "image tools",
    "resize image",
    "crop image",
    "convert image",
    "compress image",
    "image converter",
    "PDF tools",
    "audio tools",
    "online image editor",
    "image optimizer",
    "app icon generator",
    "square image",
    "remove padding"
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://imagepix.xyz",
  },
  authors: [{ name: "ImagePix" }],
  creator: "ImagePix",
  publisher: "ImagePix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagepix.xyz",
    title: "ImagePix - Fast Tools for Images, PDFs & Audio",
    description: "Fast, privacy-friendly online tools for images, PDFs, and audio. Process files directly in your browser. No installation required.",
    siteName: "ImagePix",
    images: [
      {
        url: "/images/imagepix.webp",
        width: 1024,
        height: 1024,
        alt: "ImagePix - Fast Tools for Images, PDFs & Audio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImagePix - Fast Tools for Images, PDFs & Audio",
    description: "Fast, privacy-friendly online tools. Process files directly in your browser.",
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
      <body className={inter.className}>
        {/* Structured Data - Critical, loads before interactive */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "ImagePix",
                "alternateName": ["Image Pix", "ImagePix Tools"],
                "url": "https://imagepix.xyz",
                "description": "Fast, privacy-friendly online tools for images, PDFs, and audio"
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "ImagePix - Fast Tools for Images, PDFs & Audio",
                "description": "Fast, privacy-friendly online tools for images, PDFs, and audio. Process files directly in your browser.",
                "url": "https://imagepix.xyz",
                "applicationCategory": "UtilityApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "featureList": [
                  "Resize images",
                  "Crop images",
                  "Convert image formats",
                  "Compress images",
                  "Square images for app icons",
                  "Remove white padding",
                  "Privacy-friendly processing",
                  "Free and easy to use"
                ]
              }
            ])
          }}
        />
        
        <Providers>
          <Navbar />
          {children}
        </Providers>
        
        {/* Deferred third-party scripts - loads after interaction or idle */}
        <DeferredScripts />
      </body>
    </html>
  );
}
