import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SellYourSoul — ดูดวงและของมู",
  description:
    "ดูดวงออนไลน์ เลือกสรรของมูคุณภาพ พลังลึกลับจากจักรวาล ส่งตรงถึงคุณ",
  keywords: ["ดูดวง", "ของมู", "ไพ่ทาโรต์", "คริสตัล", "โชคชะตา"],
};

export const viewport: Viewport = {
  themeColor: "#0d0b1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={inter.variable}>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
