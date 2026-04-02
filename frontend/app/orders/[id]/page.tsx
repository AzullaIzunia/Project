"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { API_BASE, apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatPrice, paymentMethodLabel, statLabel, statusLabel } from "@/lib/display"

type OrderDetail = {
  order_id: number
  total_price: number
  payment_method: string
  payment_bill?: string | null
  latestOrderStatus: string
  order_status: string[]
  createOrder: string
  user: {
    name: string
    surname: string
    email: string
  }
  orderItems: Array<{
    orderItem_id: number
    quantity: number
    price: number
    tracking_status?: string[]
    product: {
      product_name: string
      category: string
      description?: string | null
    }
    fateResult?: {
      drawn_stat: string
      result: string
    } | null
  }>
}

export default function OrderDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [token, setToken] = useState("")
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })

  const fetchOrder = async (authToken: string) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(apiUrl(`/api/orders/${id}`), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "โหลดรายละเอียดออเดอร์ไม่สำเร็จ")
      }

      setOrder(data)
    } catch (err: any) {
      setError(err.message || "โหลดรายละเอียดออเดอร์ไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      setLoading(false)
      return
    }

    setToken(storedToken)
    fetchOrder(storedToken)
  }, [id, router])

  const cancelOrder = async () => {
    if (!order) return

    const res = await fetch(apiUrl(`/api/orders/${order.order_id}/cancel`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "ยกเลิกออเดอร์ไม่สำเร็จ")
      return
    }

    setNotice("ยกเลิกออเดอร์เรียบร้อยแล้ว")
    fetchOrder(token)
  }

  const goToPayment = () => {
    if (!order) return
    localStorage.setItem("pending_order_id", String(order.order_id))
    router.push("/payment")
  }

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo={`/orders/${id}`}
        description="กรุณาเข้าสู่ระบบก่อน เพื่อเปิดรายละเอียดออเดอร์ ดูสลิปที่อัปโหลด และชำระเงินต่อหากยังไม่เสร็จ"
      />
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
          กำลังโหลดรายละเอียดออเดอร์...
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-card/70 p-10 text-center">
          <div className="text-red-200">ไม่พบออเดอร์นี้</div>
          <div className="mt-5">
            <Link href="/orders">
              <Button>กลับไปหน้ารายการออเดอร์</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const canContinuePayment = order.latestOrderStatus === "paid"
  const canCancel = order.latestOrderStatus === "paid"

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/orders" className="text-sm text-muted-foreground no-underline hover:text-foreground">
          ← กลับไปหน้ารายการออเดอร์
        </Link>

        <section className="mt-4 rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.18em] text-gold">รายละเอียดออเดอร์</div>
              <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
                ออเดอร์ #{order.order_id}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {new Date(order.createOrder).toLocaleString()} • {order.user.name} {order.user.surname}
              </p>
            </div>
            <StatusBadge status={order.latestOrderStatus} />
          </div>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
              {notice}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoBlock label="วิธีชำระเงิน" value={paymentMethodLabel(order.payment_method)} />
            <InfoBlock label="ยอดรวม" value={formatPrice(order.total_price)} />
            <InfoBlock label="อีเมลผู้สั่งซื้อ" value={order.user.email} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <InfoBlock
              label="จำนวนสินค้า"
              value={`${order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น`}
            />
            <InfoBlock label="สถานะปัจจุบัน" value={statusLabel(order.latestOrderStatus)} />
            <InfoBlock label="จำนวนขั้นตอน" value={`${order.order_status.length} ขั้น`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {canContinuePayment ? (
              <Button onClick={goToPayment}>ไปหน้าชำระเงิน</Button>
            ) : null}
            {canCancel ? (
              <Button variant="danger" onClick={cancelOrder}>
                ยกเลิกออเดอร์
              </Button>
            ) : null}
            {order.payment_bill ? (
              <a href={`${API_BASE}${order.payment_bill}`} target="_blank" rel="noreferrer">
                <Button variant="ghost">ดูสลิปที่อัปโหลด</Button>
              </a>
            ) : null}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
          <div className="text-xs tracking-[0.18em] text-gold">ลำดับสถานะ</div>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">ไทม์ไลน์สถานะ</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            สถานะของออเดอร์นี้ตั้งแต่เริ่มสั่งซื้อไปจนถึงขั้นล่าสุดที่ระบบบันทึกไว้
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {order.order_status.map((status, index) => (
              <span
                key={`${status}-${index}`}
                className="rounded-full border border-border bg-background/40 px-3 py-1 text-sm text-muted-foreground"
              >
                {index + 1}. {statusLabel(status)}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
          <div className="text-xs tracking-[0.18em] text-gold">รายการสินค้า</div>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">รายการสินค้า</h2>
          <div className="mt-5 grid gap-4">
            {order.orderItems.map((item) => (
              <article
                key={item.orderItem_id}
                className="rounded-[1.5rem] border border-border bg-background/40 p-5"
              >
                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <div className="text-xs tracking-[0.16em] text-gold">หมวดหมู่</div>
                    <div className="mt-2 text-sm text-muted-foreground">{item.product.category}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <div className="text-xs tracking-[0.16em] text-gold">จำนวน</div>
                    <div className="mt-2 text-sm text-muted-foreground">{item.quantity} ชิ้น</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3">
                    <div className="text-xs tracking-[0.16em] text-gold">ราคา</div>
                    <div className="mt-2 text-sm text-muted-foreground">{formatPrice(item.price)}</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-foreground">{item.product.product_name}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {item.product.category} • {formatPrice(item.price)} x {item.quantity}
                </div>
                {item.product.description ? (
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.product.description}</p>
                ) : null}
                {item.tracking_status?.length ? (
                  <div className="mt-4">
                    <div className="text-xs tracking-[0.16em] text-gold">การติดตาม</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.tracking_status.map((status, index) => (
                        <span
                          key={`${status}-${index}`}
                          className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                        >
                          {statusLabel(status)}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {item.fateResult ? (
                  <div className="mt-4">
                    <div className="text-xs tracking-[0.16em] text-gold">ผลดูดวงที่เชื่อมไว้</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {statLabel(item.fateResult.drawn_stat)}: {item.fateResult.result}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="text-xs tracking-[0.16em] text-gold">{label}</div>
      <div className="mt-2 text-lg font-semibold text-foreground break-words">{value}</div>
    </div>
  )
}
