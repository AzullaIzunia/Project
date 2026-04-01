"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { CartItem, clearCart, getCart, removeFromCart, updateCartQuantity } from "@/lib/cart"
import { getProductImage } from "@/lib/product-media"

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "credit_card">("promptpay")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setItems(getCart())
    setLoading(false)
  }, [])

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

  if (loading) {
    return <main style={pageStyle}><section style={cardStyle}>กำลังโหลดตะกร้า...</section></main>
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>CART</p>
            <h1 style={{ margin: "8px 0 10px", fontSize: 38 }}>Your Cart</h1>
            <p style={copyStyle}>จัดจำนวนสินค้า เลือกวิธีชำระเงิน แล้วสร้างออเดอร์เพื่อไปต่อที่ payment</p>
          </div>
          <Link href="/products" style={secondaryLinkStyle}>Continue Shopping</Link>
        </div>

        {error ? <p style={errorStyle}>{error}</p> : null}

        {items.length === 0 ? (
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>ตะกร้าว่าง</h2>
            <p style={copyStyle}>เพิ่มสินค้าจากหน้ารายการสินค้าหรือสินค้าที่ระบบแนะนำก่อน</p>
          </section>
        ) : (
          <div style={layoutStyle}>
            <section style={{ display: "grid", gap: 14 }}>
              {items.map(item => (
                <article key={item.product_id} style={cardStyle}>
                  <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 14, alignItems: "start" }}>
                    <img
                      src={getProductImage(item)}
                      alt={item.product_name}
                      style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 16, border: "1px solid #ead7c8" }}
                    />
                    <div>
                      <div style={titleStyle}>{item.product_name}</div>
                      <div style={metaStyle}>{item.category} • {item.price} THB</div>
                    </div>
                  </div>
                  <div style={actionRowStyle}>
                    <button type="button" onClick={() => { updateCartQuantity(item.product_id, item.quantity - 1); syncCart() }} style={smallButtonStyle}>-</button>
                    <span style={{ padding: "10px 6px" }}>{item.quantity}</span>
                    <button type="button" onClick={() => { updateCartQuantity(item.product_id, item.quantity + 1); syncCart() }} style={smallButtonStyle}>+</button>
                    <button type="button" onClick={() => { removeFromCart(item.product_id); syncCart() }} style={dangerButtonStyle}>Remove</button>
                  </div>
                </article>
              ))}
            </section>

            <aside style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Checkout</h2>
              <div style={summaryRowStyle}>
                <span>Items</span>
                <strong>{items.length}</strong>
              </div>
              <div style={summaryRowStyle}>
                <span>Total</span>
                <strong>{total} THB</strong>
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={miniLabelStyle}>Payment method</div>
                <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                  <button type="button" onClick={() => setPaymentMethod("promptpay")} style={paymentMethod === "promptpay" ? selectedMethodStyle : methodStyle}>PromptPay</button>
                  <button type="button" onClick={() => setPaymentMethod("credit_card")} style={paymentMethod === "credit_card" ? selectedMethodStyle : methodStyle}>Credit Card</button>
                </div>
              </div>

              <div style={actionRowStyle}>
                <button type="button" onClick={checkout} style={buttonStyle} disabled={submitting}>
                  {submitting ? "กำลังสร้างออเดอร์..." : "Checkout"}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

const pageStyle = { minHeight: "100vh", padding: "32px 20px 60px", background: "linear-gradient(180deg, #f7efe6 0%, #efdfd2 100%)", fontFamily: "Georgia, serif", color: "#2a1f18" } as const
const shellStyle = { maxWidth: 1100, margin: "0 auto" } as const
const headerStyle = { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" as const, marginBottom: 20 } as const
const layoutStyle = { display: "grid", gap: 18, gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)" } as const
const cardStyle = { background: "rgba(255,255,255,0.84)", border: "1px solid rgba(111, 78, 55, 0.12)", borderRadius: 24, padding: 24, boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)" } as const
const eyebrowStyle = { margin: 0, fontSize: 12, letterSpacing: "0.16em", color: "#9b7458" } as const
const copyStyle = { margin: 0, color: "#6e5848", lineHeight: 1.7 } as const
const titleStyle = { fontSize: 24, fontWeight: 700 } as const
const metaStyle = { color: "#6e5848", fontSize: 14, marginTop: 6 } as const
const actionRowStyle = { display: "flex", gap: 10, flexWrap: "wrap" as const, marginTop: 16 } as const
const buttonStyle = { border: "none", borderRadius: 999, padding: "12px 18px", background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)", color: "#fffaf6", cursor: "pointer", fontSize: 14 } as const
const smallButtonStyle = { border: "1px solid #d8c1b0", borderRadius: 999, padding: "10px 14px", background: "#fff8f2", color: "#5e4637", cursor: "pointer", fontSize: 14 } as const
const dangerButtonStyle = { ...smallButtonStyle, background: "#fff0ee", borderColor: "#eabdb7", color: "#a03e31" } as const
const secondaryLinkStyle = { display: "inline-block", textDecoration: "none", borderRadius: 999, padding: "12px 18px", background: "#fff8f2", border: "1px solid #dbc5b4", color: "#5f4738" } as const
const summaryRowStyle = { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10 } as const
const miniLabelStyle = { color: "#8b705d", fontSize: 12, letterSpacing: "0.06em" } as const
const methodStyle = { border: "1px solid #d8c1b0", borderRadius: 18, padding: "12px 14px", background: "#fff8f2", color: "#5e4637", cursor: "pointer", textAlign: "left" as const } as const
const selectedMethodStyle = { ...methodStyle, background: "#7c5234", color: "#fffaf6", borderColor: "#7c5234" } as const
const errorStyle = { padding: "12px 16px", borderRadius: 14, background: "#fdeeee", color: "#b42318", marginBottom: 16 } as const
