import type { Metadata } from "next"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import ScrollRevealAnimator from "@/components/scroll-reveal-animator"
import "./globals.css"

export const metadata: Metadata = {
  title: "DUDUANG",
  description: "ประสบการณ์ดูดวงและร้านค้าในระบบเดียว",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-background text-foreground">
        <ScrollRevealAnimator />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
