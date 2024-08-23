import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import './animations.css'
import {ClerkProvider} from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "10 Cards",
  description: "Flash Card generation and management app created by Akhil Trivedi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>{children}<Analytics/></body>
    </html>
    </ClerkProvider>
    
  );
}
