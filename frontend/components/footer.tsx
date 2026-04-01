import Link from "next/link"
import { Sparkles } from "lucide-react"

const links = [
  { href: "/draw", label: "ดูดวง" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/orders", label: "คำสั่งซื้อ" },
  { href: "/profile", label: "โปรไฟล์" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="font-serif text-lg font-semibold text-foreground">FLORDER</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            ระบบดูดวงและร้านค้าที่เชื่อมคำทำนายเข้ากับการเลือกสินค้า การชำระเงิน
            และการติดตามออเดอร์ใน flow เดียว
          </p>
        </div>

        <div>
          <div className="text-xs tracking-[0.18em] text-gold">NAVIGATION</div>
          <div className="mt-4 grid gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs tracking-[0.18em] text-gold">DEMO NOTES</div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>เหมาะสำหรับพรีเซนต์ flow ตั้งแต่ draw ไปจนถึง checkout</p>
            <p>รองรับทั้ง user และ admin journey ในโปรเจกต์เดียว</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/80 px-4 py-4 text-center text-xs text-muted-foreground">
        Florder Demo UI • 2026
      </div>
    </footer>
  )
}
