import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUXBIN Quantum Internet - Software Suite & Developer APIs",
  description: "Quantum-enhanced developer APIs and software suite for photonic networking. True quantum random numbers, light-based encoding, and AI code translation.",
  keywords: ["quantum", "internet", "photonic", "api", "developer", "crypto", "web3", "random", "encoding"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
