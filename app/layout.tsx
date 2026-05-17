import type { Metadata } from "next";
import { Anton, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bopherz Entertainment — Audio Rental & DJ Services, Jamaica",
  description:
    "Professional audio rental and DJ services for weddings, corporate events, concerts, and private celebrations across Jamaica.",
  openGraph: {
    title: "Bopherz Entertainment",
    description: "Professional audio rental and DJ services across Jamaica.",
    url: "https://headbopherz.com",
    siteName: "Bopherz Entertainment",
    locale: "en_JM",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${manrope.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
