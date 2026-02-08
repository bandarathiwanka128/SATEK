import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SATEK - Smart Accessories Tools Electronics Knowledge",
    template: "%s | SATEK",
  },
  description:
    "Discover the best tech gadgets, software tools, and electronics. Expert reviews, deals, and affiliate recommendations.",
  keywords: [
    "tech",
    "gadgets",
    "software",
    "electronics",
    "reviews",
    "deals",
    "accessories",
  ],
  authors: [{ name: "SATEK" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SATEK",
    title: "SATEK - Smart Accessories Tools Electronics Knowledge",
    description:
      "Discover the best tech gadgets, software tools, and electronics.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SATEK",
    description:
      "Discover the best tech gadgets, software tools, and electronics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
