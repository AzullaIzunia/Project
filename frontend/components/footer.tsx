import Link from "next/link"
import { Sparkles } from "lucide-react"

const quickLinks = [
  { href: "/shop", label: "ร้านค้า" },
  { href: "/draw", label: "ดูดวง" },
  { href: "/about", label: "วิธีการใช้งาน" },
]

const accountLinks = [
  { href: "/profile", label: "โปรไฟล์" },
  { href: "/orders", label: "คำสั่งซื้อ" },
  { href: "/fate-history", label: "ประวัติดวง" },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#0f0f17]/90">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe1]">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">DUDUANG</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              ระบบดูดวงออนไลน์ที่เชื่อมคำทำนาย ไพ่ทาโรต์ สินค้าแนะนำ การชำระเงิน
              และการติดตามออเดอร์ไว้ในประสบการณ์เดียว
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">ลิงก์ด่วน</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">บัญชีผู้ใช้</h3>
            <ul className="mt-4 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">2026 เดโม DUDUANG สงวนลิขสิทธิ์</p>
          <p className="text-sm text-muted-foreground">ระบบดูดวง สินค้าแนะนำ การชำระเงิน และหลังบ้านถูกรวมไว้ในโปรเจกต์เดียว</p>
        </div>
      </div>
    </footer>
  )
}
