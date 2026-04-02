"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.name || !form.surname || !form.email || !form.password) {
      setError("กรุณากรอกข้อมูลจำเป็นให้ครบ")
      return
    }

    if (!form.email.includes("@")) {
      setError("กรุณากรอกอีเมลให้ถูกต้อง")
      return
    }

    if (form.password.length < 6) {
      setError("รหัสผ่านควรยาวอย่างน้อย 6 ตัวอักษร")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน")
      return
    }

    setLoading(true)

    const res = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        surname: form.surname,
        email: form.email,
        password: form.password,
        address: form.address || undefined,
        telephone: form.telephone || undefined,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess("สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ")
      setTimeout(() => router.push("/login?registered=true"), 900)
    } else {
      setError(data.error || "สมัครสมาชิกไม่สำเร็จ")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <section className="flex items-center justify-center bg-[#0d0c14] px-6 py-14">
          <div className="w-full max-w-lg">
            <Link href="/" className="inline-flex items-center gap-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 shadow-[0_0_30px_rgba(139,92,246,0.18)]">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <span className="font-serif text-2xl font-semibold text-white">DUDUANG</span>
            </Link>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/90 px-4 py-2 text-sm text-foreground shadow-[0_8px_30px_rgba(6,5,16,0.28)]">
              <Sparkles className="h-4 w-4 text-gold" />
              เริ่มต้นเส้นทางคำทำนายของคุณ
            </div>

            <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">สร้างบัญชีใหม่</h1>
            <p className="mt-3 text-lg text-white/60">
              สมัครสมาชิกเพื่อดูดวง เก็บผลลัพธ์ย้อนหลัง และสั่งซื้อสินค้าในระบบเดียวกัน
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="name"
                  label="ชื่อ"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ชื่อจริง"
                />
                <Input
                  id="surname"
                  label="นามสกุล"
                  value={form.surname}
                  onChange={(e) => setForm({ ...form, surname: e.target.value })}
                  placeholder="นามสกุล"
                />
              </div>

              <Input
                id="email"
                label="อีเมล"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="password"
                  label="รหัสผ่าน"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                />
                <Input
                  id="confirm-password"
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                />
              </div>

              <Input
                id="telephone"
                label="เบอร์โทรศัพท์"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="ใส่หรือเว้นไว้ก็ได้"
              />

              <Textarea
                id="address"
                label="ที่อยู่"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ที่อยู่สำหรับจัดส่งสินค้า (ถ้ามี)"
                rows={3}
              />

              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
                  {success}
                </div>
              ) : null}

              <Button type="submit" className="w-full justify-center py-3 text-base" size="lg" loading={loading}>
                {loading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-white/60">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="text-white no-underline hover:text-gold">
                เข้าสู่ระบบ
              </Link>
            </p>
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
              เริ่มต้นเส้นทาง
              <br />
              ของคำทำนายใหม่
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/60">
              สร้างบัญชีเพื่อเก็บผลดูดวง ประวัติคำสั่งซื้อ และเข้าถึงหน้าสินค้าแนะนำที่เชื่อมกับผลลัพธ์ของคุณ
            </p>
            <div className="mt-8 grid gap-4 text-left">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(6,5,16,0.2)] backdrop-blur">
                <div className="text-xs tracking-[0.16em] text-gold">ประวัติดวง</div>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  ผลดูดวงที่เปิดไว้จะถูกเก็บในบัญชีเพื่อกลับมาดูย้อนหลังได้ทุกเมื่อ
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(6,5,16,0.2)] backdrop-blur">
                <div className="text-xs tracking-[0.16em] text-gold">การสั่งซื้อแบบต่อเนื่อง</div>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  เลือกซื้อสินค้า ชำระเงิน และติดตามออเดอร์ได้ใน flow เดียวตั้งแต่ต้นจนจบ
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
