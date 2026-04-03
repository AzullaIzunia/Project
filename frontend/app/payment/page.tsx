"use client"

import Image from "next/image"
import Link from "next/link"
import { CreditCard, QrCode } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { formatPrice, paymentMethodLabel } from "@/lib/display"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { StatusBadge } from "@/components/ui/status-badge"
import { Input } from "@/components/ui/input"

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
  const [cardForm, setCardForm] = useState({
    holderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    const groups = digits.match(/.{1,4}/g)
    return groups ? groups.join(" ") : ""
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  const validateCardForm = () => {
    const cardNumberDigits = cardForm.cardNumber.replace(/\s/g, "")
    if (cardNumberDigits.length !== 16) {
      return "เลขบัตรต้องครบ 16 หลัก"
    }
    return ""
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const orderId = localStorage.getItem("pending_order_id")

    if (!token) {
      setLoading(false)
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
      } catch (error: unknown) {
        setError(getErrorMessage(error, "โหลดข้อมูลการชำระเงินไม่สำเร็จ"))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [router])

  const payByCard = async () => {
    const token = localStorage.getItem("token")

    if (!order || !token) return
    const cardError = validateCardForm()
    if (cardError) {
      setError(cardError)
      return
    }

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

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/payment"
        description="กรุณาเข้าสู่ระบบก่อน เพื่อชำระเงินต่อและอัปโหลดสลิปหากเลือกจ่ายด้วยพร้อมเพย์"
      />
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="text-xs tracking-[0.18em] text-gold">การชำระเงิน</div>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            ชำระเงินสำหรับออเดอร์ของคุณ
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            ตรวจยอด ชำระผ่านบัตร หรือสแกน PromptPay แล้วอัปโหลดสลิปต่อได้จากหน้านี้
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
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
              <div className="text-xs tracking-[0.18em] text-gold">สรุปออเดอร์</div>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ออเดอร์</span>
                  <strong className="text-foreground">#{order.order_id}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">วิธีชำระเงิน</span>
                  <strong className="text-foreground">{paymentMethodLabel(order.payment_method)}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">สถานะ</span>
                  <StatusBadge status={order.latestOrderStatus} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ยอดรวม</span>
                  <strong className="text-xl text-foreground">{formatPrice(order.total_price)}</strong>
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
                    <Image
                      src="/promptpay-qr-real.jpeg"
                      alt="PromptPay QR"
                      width={600}
                      height={820}
                      className="mt-5 w-full rounded-2xl border border-border bg-white p-2"
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
                      กรอกเลขบัตรให้ครบ 16 หลักก่อนชำระเงิน ข้อมูลช่องอื่นใส่หรือเว้นว่างก็ได้
                    </p>
                    <div className="mt-4 rounded-2xl border border-gold/20 bg-gradient-to-br from-[#191628] via-[#121321] to-[#0f1019] p-4 shadow-[0_16px_44px_rgba(7,6,16,0.38)]">
                      <div className="text-xs tracking-[0.16em] text-gold">ตัวอย่างบัตร</div>
                      <div className="mt-3 text-lg font-semibold text-foreground">
                        {cardForm.cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{cardForm.holderName || "CARD HOLDER"}</span>
                        <span>{cardForm.expiry || "MM/YY"}</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <Input
                        id="card-holder"
                        label="ชื่อบนบัตร"
                        placeholder="เช่น AZUL TANASIN"
                        value={cardForm.holderName}
                        onChange={(event) => {
                          setCardForm((current) => ({ ...current, holderName: event.target.value }))
                          setError("")
                        }}
                        disabled={processing || order.latestOrderStatus !== "paid"}
                      />
                      <Input
                        id="card-number"
                        label="เลขบัตร"
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        value={cardForm.cardNumber}
                        onChange={(event) => {
                          setCardForm((current) => ({
                            ...current,
                            cardNumber: formatCardNumber(event.target.value),
                          }))
                          setError("")
                        }}
                        disabled={processing || order.latestOrderStatus !== "paid"}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          id="card-expiry"
                          label="วันหมดอายุ (MM/YY)"
                          placeholder="08/29"
                          inputMode="numeric"
                          value={cardForm.expiry}
                          onChange={(event) => {
                            setCardForm((current) => ({
                              ...current,
                              expiry: formatExpiry(event.target.value),
                            }))
                            setError("")
                          }}
                          disabled={processing || order.latestOrderStatus !== "paid"}
                        />
                        <Input
                          id="card-cvv"
                          label="CVV"
                          placeholder="123"
                          inputMode="numeric"
                          value={cardForm.cvv}
                          onChange={(event) => {
                            setCardForm((current) => ({
                              ...current,
                              cvv: event.target.value.replace(/\D/g, "").slice(0, 4),
                            }))
                            setError("")
                          }}
                          disabled={processing || order.latestOrderStatus !== "paid"}
                        />
                      </div>
                    </div>
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
              <div className="text-xs tracking-[0.18em] text-gold">รายการสินค้า</div>
              <div className="mt-5 grid gap-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.orderItem_id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={getProductImage(item.product)}
                        alt={item.product.product_name}
                        width={56}
                        height={56}
                        unoptimized
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
                  <Button variant="ghost">กลับไปคำสั่งซื้อของฉัน</Button>
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
                <Button>กลับไปคำสั่งซื้อของฉัน</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
