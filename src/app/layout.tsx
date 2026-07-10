import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uzhavar Thozhan — Farmer's Companion",
  description:
    "From soil test to sale price, one farm office in your pocket. Crop planning, weather, government schemes, insurance, marketplace & more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-soil antialiased">{children}</body>
    </html>
  );
}
