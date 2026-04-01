import type { Metadata, Viewport } from "next"
import Navbar from "@/components/navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Florder — Fortune and Flow",
  description: "ดูดวงออนไลน์และเลือกสินค้าใน flow เดียว",
}

export const viewport: Viewport = {
  themeColor: "#0d0b1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
