"use client"

import { Eye, LayoutDashboard, Package, CreditCard, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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

  const loadData = async (authToken: string) => {
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
    } catch (err: any) {
      setError(err.message || "โหลดข้อมูลหลังบ้านไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      router.push("/login")
      return
    }

    setToken(storedToken)
    loadData(storedToken)
  }, [router])

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

    setNotice(`อัปเดตออเดอร์ #${orderId} เป็น ${status} แล้ว`)
    loadData(token)
  }

  const stats = dashboard
    ? [
        { label: "ออเดอร์ทั้งหมด", value: dashboard.totalOrders, icon: Package },
        { label: "รายได้รวม", value: `${dashboard.totalRevenue} THB`, icon: CreditCard },
        { label: "รอตรวจสลิป", value: pendingPayments.length, icon: Eye },
        { label: "กำลังเตรียม", value: dashboard.statusCount.preparing || 0, icon: CheckCircle },
      ]
    : []

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.18em] text-gold">ADMIN WORKSPACE</div>
            <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
              จัดการระบบ Florder
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              ดูภาพรวมออเดอร์ ตรวจสลิป และขยับ workflow ของคำสั่งซื้อจากหน้าเดียว
            </p>
          </div>
          <Button variant="ghost" onClick={() => loadData(token)} disabled={loading}>
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
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
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
                <div key={stat.label} className="rounded-[1.5rem] border border-border bg-card/70 p-5">
                  <div className="flex items-center justify-between">
                    <stat.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="mt-4 text-3xl font-semibold text-foreground">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.18em] text-gold">STATUS SNAPSHOT</div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {Object.entries(dashboard?.statusCount || {}).map(([status, value]) => (
                  <div key={status} className="rounded-2xl border border-border bg-background/40 p-4">
                    <StatusBadge status={status} />
                    <div className="mt-3 text-2xl font-semibold text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === "payments" ? (
          <section className="space-y-4">
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
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        Order #{payment.order_id}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {payment.user.name} {payment.user.surname} • {payment.user.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">
                        {payment.total_price} THB
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
                        Order #{order.order_id}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {order.user.name} {order.user.surname} • {order.user.email}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={order.latestOrderStatus} />
                      <div className="font-semibold text-foreground">{order.total_price} THB</div>
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
                        อัปเดตเป็น {nextStatus}
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
