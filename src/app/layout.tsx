import { Inter, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StaySite — AI Websites for Hotels & Rentals",
    template: "%s | StaySite",
  },
  description:
    "Answer a few questions. Get a beautiful, booking-ready accommodation website in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
