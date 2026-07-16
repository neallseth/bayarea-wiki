import type { Metadata } from "next";
import "./globals.css";
import { geistSans, geistMono } from "./fonts/fonts";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://bayarea.wiki"),
  title: {
    default: "Bay Area Wiki",
    template: "%s — Bay Area Wiki",
  },
  description:
    "A small encyclopedia of notable places, communities, and ideas from the San Francisco Bay Area.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bay Area Wiki",
    title: "Bay Area Wiki",
    description:
      "A small encyclopedia of notable places, communities, and ideas from the San Francisco Bay Area.",
    images: [{ url: "/og-minimal.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bay Area Wiki",
    description:
      "A small encyclopedia of notable places, communities, and ideas from the San Francisco Bay Area.",
    images: ["/og-minimal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh px-5 py-5 sm:px-8 sm:py-7`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
