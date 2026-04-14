import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getIdentitas } from "@/lib/sheets";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Desa Kita - Beranda",
  description: "Portal resmi desa dengan pelayanan modern dan informatif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="referrer" content="no-referrer" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          body { font-family: 'Inter', sans-serif; }
          h1, h2, h3, .font-headline { font-family: 'Manrope', sans-serif; }
        `}} />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-body bg-surface text-on-surface min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
