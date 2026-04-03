"use client"

import Link from "next/link"
import { Eye, LayoutDashboard, Package, CreditCard, ShoppingCart, Sparkles } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatPrice, paymentMethodLabel, statusLabel } from "@/lib/display"
import { cn } from "@/lib/utils"
import { isAdmin } from "@/lib/auth"

type DashboardData = {
  totalOrders: number
  totalRevenue: number
  statusCount: Record<string, number>
}

type PendingPayment = {
  order_id: number
  total_price: number
  payment_bill: string | null
  createOrder: string
  latestOrderStatus?: string
  user: {
    name: string
    surname: string
    email: string
  }
}

type AdminOrder = {
  order_id: number
  total_price: number
  payment_method: string
  latestOrderStatus: string
  createOrder: string
  user: {
    name: string
    surname: string
    email: string
  }
  orderItems: Array<{
    orderItem_id: number
    quantity: number
    product: {
      product_name: string
    }
  }>
}

const tabs = [
  { id: "dashboard", label: "ภาพรวม", icon: LayoutDashboard },
  { id: "payments", label: "ตรวจสลิป", icon: CreditCard },
  { id: "orders", label: "คำสั่งซื้อ", icon: Package },
]

const nextStatusMap: Record<string, string | null> = {
  paid: null,
  preparing: "shipping",
  shipping: "completed",
  completed: null,
  cancelled: null,
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [token, setToken] = useState("")
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [authReady, setAuthReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback

  const loadData = useCallback(async (authToken: string) => {
    setLoading(true)
    setError("")

    try {
      const [dashboardRes, paymentsRes, ordersRes] = await Promise.all([
        fetch(apiUrl("/api/admin/dashboard"), {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch(apiUrl("/api/admin/pending-payments"), {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch(apiUrl("/api/orders"), {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ])

      const dashboardData = await dashboardRes.json()
      const paymentsData = await paymentsRes.json()
      const ordersData = await ordersRes.json()

      if (!dashboardRes.ok) throw new Error(dashboardData.error || "โหลด dashboard ไม่สำเร็จ")
      if (!paymentsRes.ok) throw new Error(paymentsData.error || "โหลดรายการสลิปไม่สำเร็จ")
      if (!ordersRes.ok) throw new Error(ordersData.error || "โหลดรายการออเดอร์ไม่สำเร็จ")

      setDashboard(dashboardData)
      setPendingPayments(paymentsData)
      setOrders(ordersData)
    } catch (error: unknown) {
      setError(getErrorMessage(error, "โหลดข้อมูลหลังบ้านไม่สำเร็จ"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const adminAccess = isAdmin()

    setIsAuthenticated(Boolean(storedToken))
    setHasAdminAccess(adminAccess)
    setAuthReady(true)

    if (!storedToken) {
      setLoading(false)
      return
    }

    setToken(storedToken)
    loadData(storedToken)
  }, [loadData])

  const approvePayment = async (orderId: number) => {
    const res = await fetch(apiUrl(`/api/orders/${orderId}/approve`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "อนุมัติสลิปไม่สำเร็จ")
      return
    }

    setNotice(`อนุมัติสลิปของออเดอร์ #${orderId} แล้ว`)
    loadData(token)
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    const res = await fetch(apiUrl(`/api/orders/${orderId}/status`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "อัปเดตสถานะไม่สำเร็จ")
      return
    }

    setNotice(`อัปเดตออเดอร์ #${orderId} เป็น ${statusLabel(status)} แล้ว`)
    loadData(token)
  }

  const stats = dashboard
    ? [
        {
          label: "รายได้รวม",
          value: formatPrice(dashboard.totalRevenue),
          icon: CreditCard,
          iconColor: "text-emerald-300",
          iconBg: "bg-emerald-500/12",
        },
        {
          label: "ออเดอร์ทั้งหมด",
          value: dashboard.totalOrders,
          icon: ShoppingCart,
          iconColor: "text-sky-300",
          iconBg: "bg-sky-500/12",
        },
        {
          label: "รอตรวจสลิป",
          value: pendingPayments.length,
          icon: Eye,
          iconColor: "text-amber-300",
          iconBg: "bg-amber-500/12",
        },
        {
          label: "กำลังเตรียม",
          value: dashboard.statusCount.preparing || 0,
          icon: Package,
          iconColor: "text-violet-300",
          iconBg: "bg-violet-500/12",
        },
      ]
    : []

  if (!authReady) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
          กำลังตรวจสอบสิทธิ์...
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/admin"
        description="กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินเพื่อใช้งานแดชบอร์ด ตรวจสลิป และจัดการคำสั่งซื้อ"
      />
    )
  }

  if (!hasAdminAccess) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <section className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-[#15121b] px-6 py-20 text-center shadow-[0_30px_80px_rgba(10,8,20,0.28)] sm:px-10">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#2c2045] text-[#8d5cf6] shadow-[0_0_40px_rgba(141,92,246,0.25)]">
              <span className="text-5xl">🛡️</span>
            </div>
            <h1 className="mt-8 text-4xl font-semibold text-white md:text-5xl">สำหรับแอดมินเท่านั้น</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-white/60">
              หน้านี้เปิดให้ใช้งานเฉพาะบัญชีแอดมิน กรุณาเข้าสู่ระบบด้วยบัญชีที่ถูกต้อง หรือกลับไปหน้าแรก
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                className="bg-[#8d5cf6] text-white hover:bg-[#7c4ef0] border-[#8d5cf6] px-8"
                onClick={() => router.push("/")}
              >
                กลับหน้าแรก
              </Button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.18em] text-gold">พื้นที่จัดการหลังบ้าน</div>
              <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
                จัดการระบบ DUDUANG
              </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              ดูภาพรวมออเดอร์ ตรวจสลิป และขยับ workflow ของคำสั่งซื้อจากหน้าเดียว
            </p>
          </div>
          <Button variant="ghost" onClick={() => loadData(token)} disabled={loading}>
            <Sparkles className="h-4 w-4" />
            รีเฟรชข้อมูล
          </Button>
        </div>

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

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
            กำลังโหลดข้อมูลหลังบ้าน...
          </div>
        ) : null}

        {!loading && activeTab === "dashboard" ? (
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-border bg-card/80 p-5 shadow-[0_18px_48px_rgba(4,3,12,0.22)]">
                  <div className="flex items-center justify-between">
                    <div className={cn("rounded-xl p-3", stat.iconBg)}>
                      <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                    </div>
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div className="mt-4 text-3xl font-semibold text-foreground">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {pendingPayments.length > 0 ? (
              <div className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-amber-300" />
                  <div>
                    <div className="font-semibold text-foreground">
                      มี {pendingPayments.length} รายการที่รอตรวจสอบสลิป
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ตรวจสอบและอนุมัติการชำระเงินเพื่อให้ออเดอร์เดินต่อไปยังขั้นเตรียมสินค้า
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.18em] text-gold">ภาพรวมสถานะ</div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                ภาพรวมสถานะออเดอร์ปัจจุบัน ช่วยให้เห็นภาพว่าตอนนี้งานอยู่ในขั้นไหนมากที่สุดและมีจุดค้างตรงไหน
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {Object.entries(dashboard?.statusCount || {}).map(([status, value]) => (
                  <div key={status} className="rounded-2xl border border-border bg-background/40 p-4">
                    <StatusBadge status={status} />
                    <div className="mt-3 text-2xl font-semibold text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.18em] text-gold">ทางลัดสำหรับแอดมิน</div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">การจัดการด่วน</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Link href="/admin" className="no-underline">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-background/70">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">ดูแดชบอร์ด</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 text-left transition-colors hover:bg-background/70"
                >
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">จัดการคำสั่งซื้อ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("payments")}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 text-left transition-colors hover:bg-background/70"
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">ตรวจสอบการชำระเงิน</span>
                </button>
                <Link href="/admin/products" className="no-underline">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-background/70">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">จัดการสินค้า</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === "payments" ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.16em] text-gold">รายการสลิปรอตรวจ</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                ตรวจสอบสลิปที่ผู้ใช้อัปโหลดและอนุมัติออเดอร์เพื่อขยับสถานะไปขั้นเตรียมสินค้า
              </p>
            </div>
            {pendingPayments.length === 0 ? (
              <div className="rounded-[2rem] border border-border bg-card/70 p-8 text-center text-muted-foreground">
                ตอนนี้ไม่มีสลิปรอตรวจ
              </div>
            ) : (
              pendingPayments.map((payment) => (
                <article
                  key={payment.order_id}
                  className="rounded-[1.75rem] border border-border bg-card/70 p-5"
                >
                  <div className="mb-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                      <div className="text-xs tracking-[0.16em] text-gold">ออเดอร์</div>
                      <div className="mt-2 text-sm text-muted-foreground">#{payment.order_id}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                      <div className="text-xs tracking-[0.16em] text-gold">ลูกค้า</div>
                      <div className="mt-2 text-sm text-muted-foreground">{payment.user.email}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                      <div className="text-xs tracking-[0.16em] text-gold">ยอดรวม</div>
                      <div className="mt-2 text-sm text-muted-foreground">{formatPrice(payment.total_price)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        ออเดอร์ #{payment.order_id}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {payment.user.name} {payment.user.surname} • {payment.user.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">
                        {formatPrice(payment.total_price)}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {new Date(payment.createOrder).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {payment.payment_bill ? (
                      <a
                        href={`${apiUrl("")}${payment.payment_bill}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="ghost">
                          <Eye className="h-4 w-4" />
                          ดูสลิป
                        </Button>
                      </a>
                    ) : null}
                    <Button onClick={() => approvePayment(payment.order_id)}>
                      อนุมัติสลิป
                    </Button>
                  </div>
                </article>
              ))
            )}
          </section>
        ) : null}

        {!loading && activeTab === "orders" ? (
          <section className="space-y-4">
            <div className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.16em] text-gold">การจัดการคำสั่งซื้อ</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                ติดตามออเดอร์ทั้งหมดในระบบและกดเปลี่ยนสถานะไปขั้นถัดไปตาม workflow ได้จากหน้านี้
              </p>
            </div>
            {orders.map((order) => {
              const nextStatus = nextStatusMap[order.latestOrderStatus]

              return (
                <article
                  key={order.order_id}
                  className="rounded-[1.75rem] border border-border bg-card/70 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        ออเดอร์ #{order.order_id}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {order.user.name} {order.user.surname} • {order.user.email}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={order.latestOrderStatus} />
                      <div className="font-semibold text-foreground">{formatPrice(order.total_price)}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                      <div className="text-xs tracking-[0.16em] text-gold">การชำระเงิน</div>
                      <div className="mt-2 text-sm text-muted-foreground">{paymentMethodLabel(order.payment_method)}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                      <div className="text-xs tracking-[0.16em] text-gold">วันที่สั่งซื้อ</div>
                      <div className="mt-2 text-sm text-muted-foreground">{new Date(order.createOrder).toLocaleString()}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                      <div className="text-xs tracking-[0.16em] text-gold">รายการสินค้า</div>
                      <div className="mt-2 text-sm text-muted-foreground">{order.orderItems.length} รายการ</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.orderItem_id}
                        className="flex items-center justify-between rounded-2xl border border-border bg-background/40 px-4 py-3"
                      >
                        <span className="text-foreground">{item.product.product_name}</span>
                        <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {nextStatus ? (
                    <div className="mt-5">
                      <Button variant="gold" onClick={() => updateOrderStatus(order.order_id, nextStatus)}>
                        อัปเดตเป็น {statusLabel(nextStatus)}
                      </Button>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </section>
        ) : null}
      </div>
    </main>
  )
}
