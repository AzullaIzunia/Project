"use client"

import { useState } from "react"
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

    if (payload?.isAdmin) router.push("/admin")
    else router.push("/")
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 no-underline">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="font-serif text-xl font-semibold">FLORDER</span>
            </Link>

            <h1 className="mt-10 text-3xl font-semibold text-foreground">ยินดีต้อนรับกลับ</h1>
            <p className="mt-3 text-muted-foreground">
              เข้าสู่ระบบเพื่อเริ่มดูดวง ดูคำสั่งซื้อ และจัดการโปรไฟล์ของคุณ
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
                <div className="rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full justify-center" size="lg" loading={isLoading}>
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <Link href="/forgot-password" className="text-muted-foreground no-underline hover:text-foreground">
                ลืมรหัสผ่าน?
              </Link>
              <Link href="/register" className="text-foreground no-underline hover:text-gold">
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden border-l border-border bg-card lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,168,67,0.15),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,40,217,0.18),transparent_35%)]" />
          <div className="relative max-w-lg px-10 text-center">
            <div className="text-7xl">✦</div>
            <h2 className="mt-8 text-4xl font-semibold text-foreground">
              เปิดคำทำนาย
              <br />
              แล้วไปต่อที่ร้าน
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              UI รอบนี้ถูกยกโทนจาก reference มาให้ใกล้ขึ้น ทั้ง home, draw, choose, shop และ shell กลางของระบบ
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
