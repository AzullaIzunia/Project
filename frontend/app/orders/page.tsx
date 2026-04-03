"use client"

import Link from "next/link"
import { Package } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatPrice, paymentMethodLabel, statusLabel } from "@/lib/display"

type Order = {
  order_id: number
  total_price: number
  payment_method: string
  latestOrderStatus: string
  createOrder: string
  orderItems: Array<{
    orderItem_id: number
    quantity: number
    price: number
    product: {
      product_name: string
      category: string
    }
  }>
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback

  const fetchOrders = useCallback(async (authToken: string) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(apiUrl("/api/orders/my"), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "โหลดรายการออเดอร์ไม่สำเร็จ")
      }

      setOrders(data)
    } catch (error: unknown) {
      setError(getErrorMessage(error, "โหลดรายการออเดอร์ไม่สำเร็จ"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      setLoading(false)
      return
    }

    setToken(storedToken)
    fetchOrders(storedToken)
  }, [fetchOrders])

  const cancelOrder = async (orderId: number) => {
    setError("")
    setNotice("")

    const res = await fetch(apiUrl(`/api/orders/${orderId}/cancel`), {
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

    setNotice(`ยกเลิกออเดอร์ #${orderId} แล้ว`)
    fetchOrders(token)
  }

  const goToPayment = (orderId: number) => {
    localStorage.setItem("pending_order_id", String(orderId))
    router.push("/payment")
  }

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/orders"
        description="กรุณาเข้าสู่ระบบก่อน เพื่อดูคำสั่งซื้อ สถานะการชำระเงิน และความคืบหน้าการจัดส่งของคุณ"
      />
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.18em] text-gold">คำสั่งซื้อของฉัน</div>
            <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
              คำสั่งซื้อของฉัน
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              ตรวจสถานะการชำระเงิน ดูสินค้าในแต่ละออเดอร์ และไปต่อที่ payment ได้จากหน้านี้
            </p>
          </div>
          <Button variant="ghost" onClick={() => fetchOrders(token)} disabled={loading}>
            รีเฟรช
          </Button>
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

        {!loading && orders.length > 0 ? (
          <section className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="text-xs tracking-[0.16em] text-gold">จำนวนออเดอร์ทั้งหมด</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">{orders.length}</div>
              <p className="mt-2 text-sm text-muted-foreground">รายการทั้งหมดในบัญชีนี้</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="text-xs tracking-[0.16em] text-gold">รายการที่ต้องดำเนินการ</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">
                {orders.filter((order) => order.latestOrderStatus === "paid").length}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">ออเดอร์ที่ยังชำระ/อัปโหลดสลิปต่อได้</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="text-xs tracking-[0.16em] text-gold">ยอดใช้จ่ายรวม</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">
                {formatPrice(orders.reduce((sum, order) => sum + order.total_price, 0))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">มูลค่าออเดอร์รวมทั้งหมดของคุณ</p>
            </div>
          </section>
        ) : null}

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
            กำลังโหลดรายการออเดอร์...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card/70 p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-gold" />
            <h2 className="mt-5 text-2xl font-semibold text-foreground">ยังไม่มีออเดอร์</h2>
            <p className="mt-3 text-muted-foreground">เริ่มเลือกสินค้าในร้านก่อน แล้วรายการจะมาแสดงที่นี่</p>
            <div className="mt-6">
              <Link href="/shop">
                <Button>ไปที่ร้านค้า</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const canCancel = order.latestOrderStatus === "paid"
              const canContinuePayment = order.latestOrderStatus === "paid"

              return (
                <article
                  key={order.order_id}
                  className="overflow-hidden rounded-[1.75rem] border border-border bg-card/70"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-5">
                    <div>
                      <div className="text-lg font-semibold text-foreground">ออเดอร์ #{order.order_id}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {new Date(order.createOrder).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={order.latestOrderStatus} />
                      <div className="text-sm text-muted-foreground">
                        {paymentMethodLabel(order.payment_method)}
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatPrice(order.total_price)}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <div className="mb-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                        <div className="text-xs tracking-[0.16em] text-gold">การชำระเงิน</div>
                        <div className="mt-2 text-sm text-muted-foreground">{paymentMethodLabel(order.payment_method)}</div>
                      </div>
                      <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                        <div className="text-xs tracking-[0.16em] text-gold">จำนวนสินค้า</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
                        <div className="text-xs tracking-[0.16em] text-gold">สถานะ</div>
                        <div className="mt-2 text-sm text-muted-foreground">{statusLabel(order.latestOrderStatus)}</div>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.orderItem_id}
                          className="flex items-center justify-between rounded-2xl border border-border bg-background/40 px-4 py-3"
                        >
                          <div>
                            <div className="font-medium text-foreground">{item.product.product_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.category}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>x{item.quantity}</div>
                            <div>{formatPrice(item.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href={`/orders/${order.order_id}`}>
                        <Button>ดูรายละเอียด</Button>
                      </Link>
                      {canContinuePayment ? (
                        <Button variant="gold" onClick={() => goToPayment(order.order_id)}>
                          ไปหน้าชำระเงิน
                        </Button>
                      ) : null}
                      {canCancel ? (
                        <Button variant="danger" onClick={() => cancelOrder(order.order_id)}>
                          ยกเลิกออเดอร์
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
