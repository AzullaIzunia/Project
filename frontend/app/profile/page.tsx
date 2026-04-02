"use client"

import Link from "next/link"
import { BookOpen, LogOut, MapPin, Package, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { removeToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { Input, Textarea } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatPrice } from "@/lib/display"
import { cn } from "@/lib/utils"

type UserOrder = {
  order_id: number
  total_price: number
  latestOrderStatus: string
  createOrder: string
}

const tabs = [
  { id: "profile", label: "ข้อมูลส่วนตัว", icon: User },
  { id: "orders", label: "คำสั่งซื้อ", icon: Package },
  { id: "history", label: "ประวัติดวง", icon: BookOpen },
]

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [recentOrders, setRecentOrders] = useState<UserOrder[]>([])
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })
  const [form, setForm] = useState({
    name: "",
    address: "",
    telephone: "",
    password: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch(apiUrl("/api/user/me"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(apiUrl("/api/orders/my"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const userData = await userRes.json()
        const ordersData = await ordersRes.json()

        if (!userRes.ok) {
          throw new Error(userData.error || "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ")
        }

        if (!ordersRes.ok) {
          throw new Error(ordersData.error || "โหลดออเดอร์ไม่สำเร็จ")
        }

        setForm({
          name: userData.name || "",
          address: userData.address || "",
          telephone: userData.telephone || "",
          password: "",
        })
        setRecentOrders((ordersData || []).slice(0, 3))
      } catch (err: any) {
        setError(err.message || "โหลดข้อมูลไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSave = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    setError("")
    setNotice("")

    if (!form.name.trim()) {
      setError("กรุณากรอกชื่อ")
      return
    }

    if (form.password && form.password.length < 6) {
      setError("รหัสผ่านใหม่ควรยาวอย่างน้อย 6 ตัวอักษร")
      return
    }

    setSaving(true)

    const res = await fetch(apiUrl("/api/user/update"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "อัปเดตโปรไฟล์ไม่สำเร็จ")
      setSaving(false)
      return
    }

    setForm((current) => ({
      ...current,
      password: "",
    }))
    setNotice("อัปเดตข้อมูลเรียบร้อยแล้ว")
    setSaving(false)
  }

  const handleLogout = () => {
    removeToken()
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/profile"
        description="กรุณาเข้าสู่ระบบก่อน เพื่อจัดการโปรไฟล์ ประวัติดวง และออเดอร์ล่าสุดของคุณ"
      />
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
          กำลังโหลดข้อมูลโปรไฟล์...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-2xl font-semibold text-gold">
              {form.name ? form.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="text-xs tracking-[0.18em] text-gold">โปรไฟล์</div>
              <h1 className="mt-2 text-3xl font-semibold text-foreground">{form.name || "โปรไฟล์ของคุณ"}</h1>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </Button>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs tracking-[0.16em] text-gold">สถานะโปรไฟล์</div>
            <div className="mt-3 text-2xl font-semibold text-foreground">
              {form.name ? "พร้อมใช้งาน" : "ยังไม่สมบูรณ์"}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">อัปเดตข้อมูลส่วนตัวเพื่อให้การสั่งซื้อและจัดส่งสมบูรณ์ขึ้น</p>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs tracking-[0.16em] text-gold">ออเดอร์ล่าสุด</div>
            <div className="mt-3 text-2xl font-semibold text-foreground">{recentOrders.length}</div>
            <p className="mt-2 text-sm text-muted-foreground">สรุปรายการล่าสุดที่ผูกกับบัญชีนี้</p>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
            <div className="text-xs tracking-[0.16em] text-gold">ข้อมูลติดต่อ</div>
            <div className="mt-3 text-2xl font-semibold text-foreground">{form.telephone || "-"}</div>
            <p className="mt-2 text-sm text-muted-foreground">เบอร์โทรสำหรับใช้ในออเดอร์และการติดต่อกลับ</p>
          </div>
        </section>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        ) : null}

        {activeTab === "profile" ? (
          <section className="rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-xs tracking-[0.18em] text-gold">รายละเอียดบัญชี</div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">ข้อมูลส่วนตัว</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="name"
                label="ชื่อ"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
              <Input
                id="telephone"
                label="เบอร์โทรศัพท์"
                value={form.telephone}
                onChange={(event) => setForm((current) => ({ ...current, telephone: event.target.value }))}
              />
            </div>

            <div className="mt-4">
              <Textarea
                id="address"
                label="ที่อยู่"
                rows={4}
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
              />
            </div>

            <div className="mt-4">
              <Input
                id="password"
                type="password"
                label="รหัสผ่านใหม่"
                placeholder="เว้นว่างถ้ายังไม่ต้องการเปลี่ยน"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleSave} loading={saving}>
                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
              <Link href="/orders">
                <Button variant="gold">ไปที่คำสั่งซื้อ</Button>
              </Link>
            </div>
          </section>
        ) : null}

        {activeTab === "orders" ? (
          <section className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="rounded-[2rem] border border-border bg-card/70 p-8 text-center text-muted-foreground">
                ยังไม่มีรายการออเดอร์
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-border bg-card/70 p-5"
                >
                  <div>
                    <div className="text-xs tracking-[0.16em] text-gold">สรุปออเดอร์</div>
                    <div className="text-lg font-semibold text-foreground">ออเดอร์ #{order.order_id}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.createOrder).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={order.latestOrderStatus} />
                    <div className="font-semibold text-foreground">{formatPrice(order.total_price)}</div>
                  </div>
                </div>
              ))
            )}

            <Link href="/orders">
              <Button variant="ghost" className="w-full justify-center">
                ดูคำสั่งซื้อทั้งหมด
              </Button>
            </Link>
          </section>
        ) : null}

        {activeTab === "history" ? (
          <section className="rounded-[2rem] border border-border bg-card/70 p-8">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div className="flex items-center justify-center rounded-[1.5rem] border border-border bg-background/40 p-8">
                <BookOpen className="h-14 w-14 text-gold" />
              </div>
              <div>
                <div className="text-xs tracking-[0.16em] text-gold">ประวัติดวง</div>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">ประวัติการดูดวง</h2>
                <p className="mt-3 text-muted-foreground">
                  ดูผลคำทำนายย้อนหลังและกลับไปเลือกสินค้าที่เหมาะกับผลแต่ละครั้งได้จากหน้าประวัติดวง
                </p>
                <div className="mt-6">
                  <Link href="/fate-history">
                    <Button>เปิดประวัติดวง</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
