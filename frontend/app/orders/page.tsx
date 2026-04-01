"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

type Order = {
  order_id: number
  total_price: number
  payment_method: string
  payment_bill?: string | null
  latestOrderStatus: string
  order_status: string[]
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

  const fetchOrders = async (authToken: string) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(apiUrl("/api/orders/my"), {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "โหลดรายการออเดอร์ไม่สำเร็จ")
      }

      setOrders(data)
    } catch (err: any) {
      setError(err.message || "โหลดรายการออเดอร์ไม่สำเร็จ")
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
    fetchOrders(storedToken)
  }, [router])

  const cancelOrder = async (orderId: number) => {
    const res = await fetch(apiUrl(`/api/orders/${orderId}/cancel`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={shellStyle}>
          <h1 style={{ marginTop: 0 }}>My Orders</h1>
          <p>กำลังโหลดรายการออเดอร์...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>ORDER CENTER</p>
            <h1 style={{ margin: "8px 0 10px", fontSize: 38 }}>My Orders</h1>
            <p style={copyStyle}>
              ตรวจดูการชำระเงิน สถานะออเดอร์ และกดเข้าไปดูรายละเอียดแต่ละออเดอร์ได้จากหน้านี้
            </p>
          </div>
          <button type="button" onClick={() => fetchOrders(token)} style={primaryButtonStyle}>
            รีเฟรช
          </button>
        </div>

        {error ? <p style={errorStyle}>{error}</p> : null}
        {notice ? <p style={noticeStyle}>{notice}</p> : null}

        {orders.length === 0 ? (
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>ยังไม่มีออเดอร์</h2>
            <p style={copyStyle}>เมื่อคุณซื้อสินค้าหรือชำระเงินแล้ว รายการจะมาแสดงที่หน้านี้</p>
            <Link href="/products" style={linkButtonStyle}>
              ไปดูสินค้า
            </Link>
          </section>
        ) : (
          <section style={{ display: "grid", gap: 18 }}>
            {orders.map(order => {
              const canCancel = order.latestOrderStatus === "paid"
              const canContinuePayment = order.latestOrderStatus === "paid"

              return (
                <article key={order.order_id} style={cardStyle}>
                  <div style={orderTopStyle}>
                    <div>
                      <div style={titleStyle}>Order #{order.order_id}</div>
                      <div style={metaStyle}>{new Date(order.createOrder).toLocaleString()}</div>
                    </div>
                    <span style={badgeStyle}>{order.latestOrderStatus}</span>
                  </div>

                  <div style={summaryGridStyle}>
                    <div>
                      <div style={labelStyle}>Payment</div>
                      <div style={valueStyle}>{order.payment_method.replace("_", " ")}</div>
                    </div>
                    <div>
                      <div style={labelStyle}>Total</div>
                      <div style={valueStyle}>{order.total_price} THB</div>
                    </div>
                    <div>
                      <div style={labelStyle}>Items</div>
                      <div style={valueStyle}>{order.orderItems.length} รายการ</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <div style={labelStyle}>Products</div>
                    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                      {order.orderItems.map(item => (
                        <div key={item.orderItem_id} style={itemRowStyle}>
                          <span>{item.product.product_name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={actionRowStyle}>
                    <Link href={`/orders/${order.order_id}`} style={primaryLinkStyle}>
                      ดูรายละเอียด
                    </Link>

                    {canContinuePayment ? (
                      <button
                        type="button"
                        onClick={() => goToPayment(order.order_id)}
                        style={secondaryButtonStyle}
                      >
                        ไปหน้าชำระเงิน
                      </button>
                    ) : null}

                    {canCancel ? (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order.order_id)}
                        style={dangerButtonStyle}
                      >
                        ยกเลิกออเดอร์
                      </button>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px 60px",
  background: "linear-gradient(180deg, #f7efe6 0%, #efdfd2 100%)",
  fontFamily: "Georgia, serif",
  color: "#2a1f18"
} as const

const shellStyle = {
  maxWidth: 980,
  margin: "0 auto"
} as const

const cardStyle = {
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)"
} as const

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap" as const,
  marginBottom: 20
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

const titleStyle = {
  fontSize: 26,
  fontWeight: 700
} as const

const metaStyle = {
  marginTop: 6,
  color: "#7c6657",
  fontSize: 14
} as const

const orderTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  flexWrap: "wrap" as const
} as const

const badgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#f2e0d4",
  color: "#5c4535",
  textTransform: "capitalize" as const
} as const

const summaryGridStyle = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  marginTop: 18
} as const

const labelStyle = {
  color: "#8b705d",
  fontSize: 13,
  letterSpacing: "0.05em"
} as const

const valueStyle = {
  marginTop: 6,
  fontSize: 17,
  fontWeight: 700
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

const actionRowStyle = {
  display: "flex",
  gap: 10,
  marginTop: 18,
  flexWrap: "wrap" as const
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

const secondaryButtonStyle = {
  border: "1px solid #d8c1b0",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#fffaf4",
  color: "#5e4637",
  cursor: "pointer",
  fontSize: 14
} as const

const dangerButtonStyle = {
  ...secondaryButtonStyle,
  background: "#fff0ee",
  borderColor: "#eabdb7",
  color: "#a03e31"
} as const

const primaryLinkStyle = {
  textDecoration: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6",
  fontSize: 14
} as const

const linkButtonStyle = {
  display: "inline-block",
  marginTop: 10,
  textDecoration: "none",
  color: "#7c5234"
} as const

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318",
  marginBottom: 16
} as const

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginBottom: 16
} as const
