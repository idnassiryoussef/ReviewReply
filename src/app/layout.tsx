import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./ClerkProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewReply",
  description:
    "Generate professional replies to Google reviews in seconds. Perfect for restaurants, hotels, clinics, cafés, gyms, and local businesses.",
  metadataBase: new URL("https://reviewreply.ai"),
  keywords: [
    "google review reply",
    "review reply generator",
    "ai review response",
    "local business",
    "customer review reply",
  ],
  openGraph: {
    title: "ReviewReply",
    description:
      "A simple AI tool to generate professional replies to Google reviews for local businesses.",
    type: "website",
    siteName: "ReviewReply",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewReply",
    description:
      "Generate professional replies to Google reviews in seconds. Perfect for restaurants, hotels, clinics, cafés, gyms, and local businesses.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-white antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
