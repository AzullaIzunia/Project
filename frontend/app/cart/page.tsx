"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { CartItem, clearCart, getCart, removeFromCart, updateCartQuantity } from "@/lib/cart"
import { formatPrice, paymentMethodLabel } from "@/lib/display"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>(() => getCart())
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "credit_card">("promptpay")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const syncCart = () => {
    setItems(getCart())
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const checkout = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    if (items.length === 0) {
      setError("ยังไม่มีสินค้าในตะกร้า")
      return
    }

    setSubmitting(true)
    setError("")

    const res = await fetch(apiUrl("/api/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "สร้างออเดอร์ไม่สำเร็จ")
      setSubmitting(false)
      return
    }

    clearCart()
    localStorage.setItem("pending_order_id", String(data.order_id))
    router.push("/payment")
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-gold">ตะกร้าสินค้า</p>
            <h1 className="mt-2 text-4xl font-semibold text-foreground">ตะกร้าของคุณ</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              จัดจำนวนสินค้า เลือกวิธีชำระเงิน แล้วสร้างออเดอร์เพื่อไปต่อที่ payment
            </p>
          </div>
          <Link href="/shop">
            <Button variant="ghost">เลือกซื้อสินค้าต่อ</Button>
          </Link>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {items.length === 0 ? (
          <section className="rounded-[2rem] border border-border bg-card/70 p-8">
            <h2 className="mt-0 text-2xl font-semibold text-foreground">ตะกร้าว่าง</h2>
            <p className="mt-3 text-muted-foreground">
              เพิ่มสินค้าจากหน้ารายการสินค้าหรือสินค้าที่ระบบแนะนำก่อน
            </p>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
            <section className="grid gap-4">
              {items.map(item => (
                <article key={item.product_id} className="rounded-[1.75rem] border border-border bg-card/70 p-5">
                  <div className="grid gap-4 sm:grid-cols-[96px_1fr] sm:items-start">
                    <Image
                      src={getProductImage(item)}
                      alt={item.product_name}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-24 w-24 rounded-2xl border border-border object-cover"
                    />
                    <div>
                      <div className="text-xl font-semibold text-foreground">{item.product_name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {item.category} • {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Button type="button" variant="ghost" onClick={() => { updateCartQuantity(item.product_id, item.quantity - 1); syncCart() }}>
                      -
                    </Button>
                    <span className="px-2 text-sm text-foreground">{item.quantity}</span>
                    <Button type="button" variant="ghost" onClick={() => { updateCartQuantity(item.product_id, item.quantity + 1); syncCart() }}>
                      +
                    </Button>
                    <Button type="button" variant="danger" onClick={() => { removeFromCart(item.product_id); syncCart() }}>
                      ลบออก
                    </Button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-[1.75rem] border border-border bg-card/70 p-6">
              <h2 className="mt-0 text-2xl font-semibold text-foreground">สรุปการสั่งซื้อ</h2>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>จำนวนรายการ</span>
                <strong className="text-foreground">{items.length}</strong>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>ยอดรวม</span>
                <strong className="text-foreground">{formatPrice(total)}</strong>
              </div>

              <div className="mt-6">
                <div className="text-xs tracking-[0.16em] text-gold">วิธีชำระเงิน</div>
                <div className="mt-3 grid gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("promptpay")}
                    className={paymentMethod === "promptpay"
                      ? "rounded-2xl border border-gold/40 bg-gold/15 px-4 py-3 text-left text-foreground"
                      : "rounded-2xl border border-border bg-background/40 px-4 py-3 text-left text-muted-foreground"}
                  >
                    {paymentMethodLabel("promptpay")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("credit_card")}
                    className={paymentMethod === "credit_card"
                      ? "rounded-2xl border border-gold/40 bg-gold/15 px-4 py-3 text-left text-foreground"
                      : "rounded-2xl border border-border bg-background/40 px-4 py-3 text-left text-muted-foreground"}
                  >
                    {paymentMethodLabel("credit_card")}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button type="button" onClick={checkout} className="w-full justify-center" loading={submitting}>
                  {submitting ? "กำลังสร้างออเดอร์..." : "ยืนยันคำสั่งซื้อ"}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
