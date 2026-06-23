import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { HeaderFooterWrapper } from "@/components/layout/HeaderFooterWrapper";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Sphere Academy",
  description: "Next Generation Learning Platform",
  manifest: "/manifest.json",
  themeColor: "#4F7DF3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#F5F1EB] text-[#1E1B2E] font-sans" suppressHydrationWarning>
        <HeaderFooterWrapper>
          {children}
        </HeaderFooterWrapper>
      </body>
    </html>
  );
}
