"use client"

import Link from "next/link"
import { CreditCard, QrCode } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

type Order = {
  order_id: number
  total_price: number
  payment_method: string
  payment_bill?: string | null
  latestOrderStatus: string
  createOrder: string
  orderItems: Array<{
    orderItem_id: number
    quantity: number
    product: {
      product_name: string
      category?: string
      image_url?: string | null
      main_stat?: string[]
    }
  }>
}

export default function PaymentPage() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const orderId = localStorage.getItem("pending_order_id")

    if (!token) {
      router.push("/login")
      return
    }

    if (!orderId) {
      setLoading(false)
      setError("ไม่พบออเดอร์ที่รอชำระ")
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(apiUrl(`/api/orders/${orderId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "โหลดข้อมูลการชำระเงินไม่สำเร็จ")
        }

        setOrder(data)
      } catch (err: any) {
        setError(err.message || "โหลดข้อมูลการชำระเงินไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [router])

  const payByCard = async () => {
    const token = localStorage.getItem("token")

    if (!order || !token) return

    setProcessing(true)
    setError("")

    try {
      const res = await fetch(apiUrl(`/api/orders/${order.order_id}/pay`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        router.push("/pay-fail")
        return
      }

      localStorage.removeItem("pending_order_id")
      router.push("/pay-success")
    } catch {
      setError("เกิดข้อผิดพลาดระหว่างชำระเงิน")
    } finally {
      setProcessing(false)
    }
  }

  const goToSlipUpload = () => {
    if (!order) return
    localStorage.setItem("pending_order_id", String(order.order_id))
    router.push("/upload-slip")
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="text-xs tracking-[0.18em] text-gold">PAYMENT</div>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            ชำระเงินสำหรับออเดอร์ของคุณ
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            ตรวจยอด ชำระผ่านบัตร หรือสแกน PromptPay แล้วอัปโหลดสลิปต่อได้จากหน้านี้
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
            กำลังโหลดข้อมูลการชำระเงิน...
          </div>
        ) : order ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.18em] text-gold">SUMMARY</div>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Order</span>
                  <strong className="text-foreground">#{order.order_id}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <strong className="text-foreground">{order.payment_method.replace("_", " ")}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={order.latestOrderStatus} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <strong className="text-xl text-foreground">{order.total_price} THB</strong>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4">
                {order.latestOrderStatus !== "paid" ? (
                  <p className="text-sm text-muted-foreground">
                    ออเดอร์นี้ไม่ได้อยู่ในสถานะที่ต้องชำระเพิ่มแล้ว
                  </p>
                ) : order.payment_method === "promptpay" ? (
                  <>
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <QrCode className="h-5 w-5 text-gold" />
                      PromptPay
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      สแกน QR code ด้านล่างเพื่อชำระเงิน แล้วอัปโหลดสลิปให้แอดมินตรวจสอบ
                    </p>
                    <img
                      src="/promptpay-qr-demo.svg"
                      alt="PromptPay QR"
                      className="mt-5 w-full rounded-2xl border border-border bg-white p-4"
                    />
                    <Button className="mt-5 w-full justify-center" onClick={goToSlipUpload}>
                      ไปหน้าอัปโหลดสลิป
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <CreditCard className="h-5 w-5 text-gold" />
                      Credit Card
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      ระบบนี้ใช้การชำระเงินแบบจำลอง เมื่อกดยืนยันจะเรียก backend ทันที
                    </p>
                    <Button
                      className="mt-5 w-full justify-center"
                      onClick={payByCard}
                      loading={processing}
                      disabled={order.latestOrderStatus !== "paid"}
                    >
                      {processing ? "กำลังดำเนินการ..." : "ยืนยันการชำระเงิน"}
                    </Button>
                  </>
                )}
              </div>
            </aside>

            <section className="rounded-[2rem] border border-border bg-card/70 p-6">
              <div className="text-xs tracking-[0.18em] text-gold">ITEMS</div>
              <div className="mt-5 grid gap-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.orderItem_id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.product_name}
                        className="h-14 w-14 rounded-xl border border-border object-cover"
                      />
                      <div>
                        <div className="font-medium text-foreground">{item.product.product_name}</div>
                        <div className="text-sm text-muted-foreground">{item.product.category}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/orders">
                  <Button variant="ghost">กลับไป My Orders</Button>
                </Link>
                {order.payment_method === "promptpay" && order.latestOrderStatus === "paid" ? (
                  <Button variant="gold" onClick={goToSlipUpload}>
                    อัปโหลดสลิป
                  </Button>
                ) : null}
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border bg-card/70 p-8 text-center">
            <p className="text-muted-foreground">ไม่พบข้อมูลออเดอร์</p>
            <div className="mt-5">
              <Link href="/orders">
                <Button>กลับไป My Orders</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
