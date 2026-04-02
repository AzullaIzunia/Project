"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { apiUrl } from "@/lib/api"
import { parseJwt, setToken } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const payload = parseJwt(token)
    if (payload?.isAdmin) {
      router.replace("/admin")
    }
  }, [router])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "เข้าสู่ระบบไม่สำเร็จ")
      setIsLoading(false)
      return
    }

    setToken(data.token)
    const payload = parseJwt(data.token)
    const redirectTarget =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null

    if (redirectTarget && !payload?.isAdmin) router.push(redirectTarget)
    else if (payload?.isAdmin) router.push("/admin")
    else router.push("/")
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <section className="flex items-center justify-center bg-[#0d0c14] px-6 py-14">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 shadow-[0_0_30px_rgba(139,92,246,0.18)]">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <span className="font-serif text-2xl font-semibold text-white">DUDUANG</span>
            </Link>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/90 px-4 py-2 text-sm text-foreground shadow-[0_8px_30px_rgba(6,5,16,0.28)]">
              <Sparkles className="h-4 w-4 text-gold" />
              เข้าสู่ประสบการณ์ดูดวงและร้านค้า
            </div>

            <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">ยินดีต้อนรับกลับ</h1>
            <p className="mt-3 text-lg text-white/60">
              เข้าสู่ระบบเพื่อเริ่มดูดวง ดูคำสั่งซื้อ และจัดการโปรไฟล์ของคุณ
            </p>

            <form onSubmit={handleLogin} className="mt-10 space-y-4">
              <Input
                id="email"
                label="อีเมล"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
              />
              <Input
                id="password"
                label="รหัสผ่าน"
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, password: event.target.value }))
                }
              />

              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full justify-center py-3 text-base" size="lg" loading={isLoading}>
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <Link href="/forgot-password" className="text-white/60 no-underline hover:text-white">
                ลืมรหัสผ่าน?
              </Link>
              <Link href="/register" className="text-white no-underline hover:text-gold">
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden border-l border-border bg-[#120f1b] lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,165,116,0.14),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.18),transparent_30%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(212,165,116,0.08),transparent_28%)]" />
          <div className="relative max-w-lg px-10 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/25 bg-white/5 text-4xl text-gold shadow-[0_10px_30px_rgba(6,5,16,0.22)]">
              ✦
            </div>
            <h2 className="mt-8 text-5xl font-semibold leading-tight text-white">
              เปิดคำทำนาย
              <br />
              แล้วไปต่อที่ร้าน
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/60">
              เข้าสู่ระบบเพื่อเชื่อมทุกอย่างไว้ด้วยกัน ตั้งแต่การดูดวง ไพ่ทาโรต์
              สินค้าแนะนำ การชำระเงิน ไปจนถึงการติดตามออเดอร์
            </p>
            <div className="mt-8 grid gap-4 text-left">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(6,5,16,0.2)] backdrop-blur">
                <div className="text-xs tracking-[0.16em] text-gold">เส้นทางการดูดวง</div>
                <p className="mt-2 text-sm leading-7 text-white/65">ตอบคำถาม เลือกไพ่ แล้วรับคำทำนายพร้อมสินค้าแนะนำได้ในหน้าเดียวกัน</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(6,5,16,0.2)] backdrop-blur">
                <div className="text-xs tracking-[0.16em] text-gold">ร้านค้า + คำสั่งซื้อ</div>
                <p className="mt-2 text-sm leading-7 text-white/65">ดูสินค้า ใส่ตะกร้า ชำระเงิน และตรวจสอบคำสั่งซื้อย้อนหลังได้ทันที</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
