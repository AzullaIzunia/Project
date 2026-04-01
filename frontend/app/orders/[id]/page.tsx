"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { API_BASE, apiUrl } from "@/lib/api"

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

  const fetchOrder = async (authToken: string) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(apiUrl(`/api/orders/${id}`), {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
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
      router.push("/login")
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
        Authorization: `Bearer ${token}`
      }
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

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={shellStyle}>
          <p>กำลังโหลดรายละเอียดออเดอร์...</p>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main style={pageStyle}>
        <div style={shellStyle}>
          <p style={errorStyle}>ไม่พบออเดอร์นี้</p>
          <Link href="/orders" style={linkStyle}>
            กลับไปหน้ารายการออเดอร์
          </Link>
        </div>
      </main>
    )
  }

  const canContinuePayment = order.latestOrderStatus === "paid"
  const canCancel = order.latestOrderStatus === "paid"

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <Link href="/orders" style={linkStyle}>
          ← กลับไปหน้ารายการออเดอร์
        </Link>

        <section style={{ ...cardStyle, marginTop: 16 }}>
          <div style={topRowStyle}>
            <div>
              <p style={eyebrowStyle}>ORDER DETAIL</p>
              <h1 style={{ margin: "8px 0 10px", fontSize: 38 }}>Order #{order.order_id}</h1>
              <p style={copyStyle}>
                {new Date(order.createOrder).toLocaleString()} • {order.user.name} {order.user.surname}
              </p>
            </div>
            <span style={badgeStyle}>{order.latestOrderStatus}</span>
          </div>

          {error ? <p style={errorStyle}>{error}</p> : null}
          {notice ? <p style={noticeStyle}>{notice}</p> : null}

          <div style={summaryGridStyle}>
            <InfoBlock label="Payment method" value={order.payment_method.replace("_", " ")} />
            <InfoBlock label="Total price" value={`${order.total_price} THB`} />
            <InfoBlock label="Customer email" value={order.user.email} />
          </div>

          <div style={actionRowStyle}>
            {canContinuePayment ? (
              <button type="button" onClick={goToPayment} style={primaryButtonStyle}>
                ไปหน้าชำระเงิน
              </button>
            ) : null}

            {canCancel ? (
              <button type="button" onClick={cancelOrder} style={dangerButtonStyle}>
                ยกเลิกออเดอร์
              </button>
            ) : null}

            {order.payment_bill ? (
              <a
                href={`${API_BASE}${order.payment_bill}`}
                target="_blank"
                rel="noreferrer"
                style={secondaryLinkStyle}
              >
                ดูสลิปที่อัปโหลด
              </a>
            ) : null}
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 18 }}>
          <h2 style={sectionTitleStyle}>Status Timeline</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            {order.order_status.map((status, index) => (
              <span key={`${status}-${index}`} style={timelineChipStyle}>
                {index + 1}. {status}
              </span>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 18 }}>
          <h2 style={sectionTitleStyle}>Items</h2>
          <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
            {order.orderItems.map(item => (
              <article key={item.orderItem_id} style={itemCardStyle}>
                <div style={itemTitleStyle}>{item.product.product_name}</div>
                <div style={metaStyle}>
                  {item.product.category} • {item.price} THB x {item.quantity}
                </div>
                {item.product.description ? (
                  <p style={{ ...copyStyle, marginTop: 10 }}>{item.product.description}</p>
                ) : null}
                {item.tracking_status?.length ? (
                  <div style={{ marginTop: 10 }}>
                    <div style={miniLabelStyle}>Tracking</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {item.tracking_status.map((status, index) => (
                        <span key={`${status}-${index}`} style={smallChipStyle}>
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {item.fateResult ? (
                  <div style={{ marginTop: 12 }}>
                    <div style={miniLabelStyle}>Linked fate result</div>
                    <p style={{ ...copyStyle, marginTop: 6 }}>
                      {item.fateResult.drawn_stat}: {item.fateResult.result}
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
    <div>
      <div style={miniLabelStyle}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
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

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  flexWrap: "wrap" as const
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

const linkStyle = {
  color: "#7b5234",
  textDecoration: "none"
} as const

const secondaryLinkStyle = {
  textDecoration: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#fffaf4",
  border: "1px solid #d8c1b0",
  color: "#5e4637",
  fontSize: 14
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  marginTop: 20
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

const dangerButtonStyle = {
  border: "1px solid #eabdb7",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#fff0ee",
  color: "#a03e31",
  cursor: "pointer",
  fontSize: 14
} as const

const sectionTitleStyle = {
  margin: 0,
  fontSize: 28
} as const

const timelineChipStyle = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "#fff8f2",
  border: "1px solid #e8d7ca",
  color: "#5f493a"
} as const

const itemCardStyle = {
  background: "#fff9f4",
  border: "1px solid #ead7c8",
  borderRadius: 20,
  padding: 18
} as const

const itemTitleStyle = {
  fontSize: 22,
  fontWeight: 700
} as const

const metaStyle = {
  marginTop: 6,
  color: "#7c6657",
  fontSize: 14
} as const

const miniLabelStyle = {
  color: "#8b705d",
  fontSize: 12,
  letterSpacing: "0.06em"
} as const

const smallChipStyle = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "#f1e3d8",
  color: "#684d3b",
  fontSize: 13
} as const

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318",
  marginTop: 16
} as const

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginTop: 16
} as const
