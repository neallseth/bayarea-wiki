import type { Metadata } from "next";
import "./globals.css";
import { geistSans, geistMono } from "./fonts/fonts";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Bay Area Wiki",
  // description: "Bay Area Wiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh p-6 sm:p-8 flex flex-col max-w-[70ch] mx-auto`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
