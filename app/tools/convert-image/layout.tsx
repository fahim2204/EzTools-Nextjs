import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Image Format - PNG, JPG, WebP, GIF | ImagePix",
  description: "Free online image converter. Convert between PNG, JPG, WebP, GIF, BMP, and more. Adjust quality and compression. Fast, secure, client-side processing.",
  keywords: [
    "image converter",
    "convert image format",
    "png to jpg",
    "jpg to webp",
    "webp to png",
    "image format converter",
    "compress image",
    "online image converter",
    "free image converter",
  ],
  openGraph: {
    title: "Convert Image Format - ImagePix",
    description: "Convert images between PNG, JPG, WebP, GIF, and more. Free online tool with quality control.",
    type: "website",
  },
};

export default function ConvertImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
