"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { getProductImage } from "@/lib/product-media"

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
            Authorization: `Bearer ${token}`
          }
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
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        router.push("/pay-fail")
        return
      }

      localStorage.removeItem("pending_order_id")
      router.push("/pay-success")
    } finally {
      setProcessing(false)
    }
  }

  const goToSlipUpload = () => {
    if (!order) return
    localStorage.setItem("pending_order_id", String(order.order_id))
    router.push("/upload-slip")
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Payment</h1>
          <p style={copyStyle}>กำลังโหลดข้อมูลการชำระเงิน...</p>
        </section>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>PAYMENT</p>
        <h1 style={{ margin: "8px 0 12px", fontSize: 36 }}>Complete Your Payment</h1>

        {error ? <p style={errorStyle}>{error}</p> : null}

        {order ? (
          <>
            <div style={summaryBoxStyle}>
              <div style={rowStyle}>
                <span>Order</span>
                <strong>#{order.order_id}</strong>
              </div>
              <div style={rowStyle}>
                <span>Method</span>
                <strong>{order.payment_method.replace("_", " ")}</strong>
              </div>
              <div style={rowStyle}>
                <span>Status</span>
                <strong style={{ textTransform: "capitalize" }}>{order.latestOrderStatus}</strong>
              </div>
              <div style={rowStyle}>
                <span>Total</span>
                <strong>{order.total_price} THB</strong>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={miniLabelStyle}>Items</div>
              <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                {order.orderItems.map(item => (
                  <div key={item.orderItem_id} style={itemRowStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.product_name}
                        style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 12, border: "1px solid #ead7c8" }}
                      />
                      <span>{item.product.product_name}</span>
                    </div>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.latestOrderStatus !== "paid" ? (
              <p style={noticeStyle}>ออเดอร์นี้ไม่ได้อยู่ในสถานะที่ต้องชำระเพิ่มแล้ว</p>
            ) : order.payment_method === "promptpay" ? (
              <>
                <div style={guideBoxStyle}>
                  <h2 style={{ marginTop: 0, fontSize: 24 }}>PromptPay</h2>
                  <p style={copyStyle}>
                    อัปโหลดสลิปเพื่อส่งให้ระบบตรวจสอบและรอแอดมินอนุมัติการชำระเงิน
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <img
                      src="/promptpay-qr-demo.svg"
                      alt="Demo PromptPay QR"
                      style={{
                        width: "100%",
                        maxWidth: 280,
                        display: "block",
                        borderRadius: 18,
                        border: "1px solid #e3d0c0",
                        background: "#fff"
                      }}
                    />
                    <p style={{ ...copyStyle, marginTop: 10, fontSize: 14 }}>
                      ตอนเดโม่สามารถเปลี่ยนไฟล์นี้เป็น QR พร้อมเพย์จริงได้ที่
                      {" "}
                      <code>/frontend/public/promptpay-qr-demo.svg</code>
                    </p>
                  </div>
                </div>
                <div style={actionRowStyle}>
                  <button type="button" onClick={goToSlipUpload} style={primaryButtonStyle}>
                    ไปหน้าอัปโหลดสลิป
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={guideBoxStyle}>
                  <h2 style={{ marginTop: 0, fontSize: 24 }}>Credit Card</h2>
                  <p style={copyStyle}>
                    ระบบนี้ใช้การชำระแบบจำลอง เมื่อกดยืนยันจะส่งคำขอชำระเงินให้ backend ทันที
                  </p>
                </div>
                <div style={actionRowStyle}>
                  <button type="button" onClick={payByCard} style={primaryButtonStyle} disabled={processing}>
                    {processing ? "กำลังดำเนินการ..." : "ยืนยันการชำระเงิน"}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div style={actionRowStyle}>
            <Link href="/orders" style={secondaryLinkStyle}>ไปที่ My Orders</Link>
          </div>
        )}
      </section>
    </main>
  )
}

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: "linear-gradient(180deg, #f7efe6 0%, #efdfd2 100%)",
  fontFamily: "Georgia, serif",
  color: "#2a1f18"
} as const

const cardStyle = {
  width: "100%",
  maxWidth: 620,
  background: "rgba(255,255,255,0.84)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)"
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.16em",
  color: "#9b7458"
} as const

const copyStyle = {
  margin: 0,
  color: "#6e5848",
  lineHeight: 1.7
} as const

const summaryBoxStyle = {
  display: "grid",
  gap: 12,
  padding: 16,
  borderRadius: 18,
  background: "#fff8f2",
  border: "1px solid #e3d0c0"
} as const

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12
} as const

const miniLabelStyle = {
  color: "#8b705d",
  fontSize: 12,
  letterSpacing: "0.06em"
} as const

const itemRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 14,
  background: "#fff8f2",
  color: "#5d4738"
} as const

const guideBoxStyle = {
  marginTop: 18,
  padding: 18,
  borderRadius: 18,
  background: "#f6ede3",
  border: "1px solid #e3d0c0"
} as const

const actionRowStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  marginTop: 18
} as const

const primaryButtonStyle = {
  border: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6",
  cursor: "pointer",
  fontSize: 14
} as const

const secondaryLinkStyle = {
  display: "inline-block",
  textDecoration: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#fff8f2",
  border: "1px solid #dbc5b4",
  color: "#5f4738"
} as const

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318",
  marginTop: 14
} as const

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginTop: 14
} as const
