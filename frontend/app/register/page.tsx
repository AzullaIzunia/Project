"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.name || !form.surname || !form.email || !form.password) {
      setError("กรุณากรอกข้อมูลให้ครบ")
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

    setLoading(true)

    const res = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess("สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ")
      setTimeout(() => router.push("/login"), 800)
    } else {
      setError(data.error || "สมัครสมาชิกไม่สำเร็จ")
    }

    setLoading(false)
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

            <h1 className="mt-10 text-3xl font-semibold text-foreground">สร้างบัญชีใหม่</h1>
            <p className="mt-3 text-muted-foreground">
              สมัครสมาชิกเพื่อดูดวง จัดการคำสั่งซื้อ และเก็บประวัติของคุณไว้ในระบบ
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="name"
                  label="ชื่อ"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  id="surname"
                  label="นามสกุล"
                  value={form.surname}
                  onChange={(e) => setForm({ ...form, surname: e.target.value })}
                />
              </div>
              <Input
                id="email"
                label="อีเมล"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                id="password"
                label="รหัสผ่าน"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              {error ? (
                <div className="rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="rounded-xl border border-green-800/50 bg-green-900/20 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              ) : null}

              <Button type="submit" className="w-full justify-center" size="lg" loading={loading}>
                {loading ? "กำลังสมัครสมาชิก..." : "Register"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="text-foreground no-underline hover:text-gold">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden border-l border-border bg-card lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,168,67,0.15),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,40,217,0.18),transparent_35%)]" />
          <div className="relative max-w-lg px-10 text-center">
            <div className="text-7xl">✦</div>
            <h2 className="mt-8 text-4xl font-semibold text-foreground">
              เริ่มต้นเส้นทาง
              <br />
              ของคำทำนายใหม่
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              เข้าสู่ระบบนิเวศของ Florder เพื่อเปิดไพ่ เลือกสินค้า และติดตามคำสั่งซื้อในหน้าเดียวกัน
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
