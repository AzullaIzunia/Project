"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { getProductImage } from "@/lib/product-media"

export default function RecommendPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchased, setPurchased] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")

      const res = await fetch(apiUrl(`/api/fate/recommend/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await res.json()
      setData(result)
      setLoading(false)
    }

    fetchData()
  }, [id])

  const createOrder = async (
    product_id: number,
    payment_method: "credit_card" | "promptpay"
  ) => {
    const token = localStorage.getItem("token")

    const res = await fetch(apiUrl("/api/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        payment_method,
        items: [{ product_id, quantity: 1 }]
      })
    })

    return res.json()
  }

  const goToPayment = (orderId: number) => {
    localStorage.setItem("pending_order_id", String(orderId))
    window.location.href = "/payment"
  }

  const handleCardBuy = async (product_id: number) => {
    const order = await createOrder(product_id, "credit_card")

    if (!order?.order_id) {
      alert(order?.error || "สร้างออเดอร์ไม่สำเร็จ")
      return
    }

    goToPayment(order.order_id)
  }

  const handlePromptPayBuy = async (product_id: number) => {
    const order = await createOrder(product_id, "promptpay")

    if (!order?.order_id) {
      alert(order?.error || "สร้างออเดอร์ไม่สำเร็จ")
      return
    }

    goToPayment(order.order_id)
  }

  if (loading) return <div>🔮 Loading...</div>

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>RECOMMENDED FOR YOUR FATE</p>
            <h1 style={{ margin: "8px 0 10px", fontSize: 38 }}>Recommended Products</h1>
            <p style={copyStyle}>
              สินค้าชุดนี้คัดจากผลดูดวงของคุณเพื่อให้เลือกซื้อได้ทันทีหรือเก็บเข้าตะกร้าก่อนก็ได้
            </p>
          </div>
          <Link href="/cart" style={primaryLinkStyle}>Open Cart</Link>
        </div>

        <section style={gridStyle}>
          {data.recommended_products.map((p: any) => (
            <article key={p.product_id} style={cardStyle}>
              <img
                src={getProductImage(p)}
                alt={p.product_name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 18,
                  border: "1px solid #ead7c8"
                }}
              />
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 24 }}>{p.product_name}</h3>
                <p style={{ margin: 0, color: "#6e5848" }}>{p.category} • {p.price} THB</p>
              </div>

              <div style={actionRowStyle}>
                <Link href={`/products/${p.product_id}`} style={secondaryLinkStyle}>View Detail</Link>

                <button
                  disabled={purchased.includes(p.product_id)}
                  onClick={() => handleCardBuy(p.product_id)}
                  style={buttonStyle}
                >
                  {purchased.includes(p.product_id) ? "Purchased ✅" : "Buy with Card"}
                </button>

                <button onClick={() => handlePromptPayBuy(p.product_id)} style={secondaryButtonStyle}>
                  Buy with PromptPay
                </button>

                <button
                  onClick={() =>
                    addToCart({
                      product_id: p.product_id,
                      product_name: p.product_name,
                      price: p.price,
                      category: p.category,
                      quantity: 1
                    })
                  }
                  style={secondaryButtonStyle}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

const pageStyle = { minHeight: "100vh", padding: "32px 20px 60px", background: "linear-gradient(180deg, #f7efe6 0%, #efdfd2 100%)", fontFamily: "Georgia, serif", color: "#2a1f18" } as const
const shellStyle = { maxWidth: 1100, margin: "0 auto" } as const
const headerStyle = { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" as const, marginBottom: 20 } as const
const eyebrowStyle = { margin: 0, fontSize: 12, letterSpacing: "0.16em", color: "#9b7458" } as const
const copyStyle = { margin: 0, color: "#6e5848", lineHeight: 1.7 } as const
const gridStyle = { display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" } as const
const cardStyle = { background: "rgba(255,255,255,0.84)", border: "1px solid rgba(111, 78, 55, 0.12)", borderRadius: 24, padding: 22, boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)", display: "grid", gap: 16 } as const
const actionRowStyle = { display: "flex", gap: 10, flexWrap: "wrap" as const } as const
const primaryLinkStyle = { display: "inline-block", textDecoration: "none", borderRadius: 999, padding: "12px 18px", background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)", color: "#fffaf6" } as const
const secondaryLinkStyle = { display: "inline-block", textDecoration: "none", borderRadius: 999, padding: "12px 18px", background: "#fff8f2", border: "1px solid #dbc5b4", color: "#5f4738" } as const
const buttonStyle = { border: "none", borderRadius: 999, padding: "12px 18px", background: "#7c5234", color: "#fffaf6", cursor: "pointer", fontSize: 14 } as const
const secondaryButtonStyle = { border: "1px solid #d8c1b0", borderRadius: 999, padding: "12px 18px", background: "#fff8f2", color: "#5e4637", cursor: "pointer", fontSize: 14 } as const
