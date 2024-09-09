import type { Metadata } from "next";
import "./globals.css";
import { geistSans, geistMono } from "./fonts/fonts";

export const metadata: Metadata = {
  title: "Bay Area Wiki",
  description: "Bay Area Wiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh flex justify-center p-8">{children}</div>
      </body>
    </html>
  );
}
