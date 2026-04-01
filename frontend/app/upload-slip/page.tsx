"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

export default function UploadSlip() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [file, setFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const pendingOrderId = localStorage.getItem("pending_order_id")

    if (!token) {
      router.push("/login")
      return
    }

    if (!pendingOrderId) {
      setLoading(false)
      setError("ไม่พบออเดอร์ที่รออัปโหลดสลิป")
      return
    }

    setOrderId(pendingOrderId)

    const fetchOrder = async () => {
      try {
        const res = await fetch(apiUrl(`/api/orders/${pendingOrderId}`), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "โหลดข้อมูลออเดอร์ไม่สำเร็จ")
        }

        setOrder(data)
      } catch (err: any) {
        setError(err.message || "โหลดข้อมูลออเดอร์ไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [router])

  const upload = async () => {
    const token = localStorage.getItem("token")

    if (!file || !orderId) {
      setError("ไม่พบไฟล์หรือออเดอร์ที่รอชำระ")
      return
    }

    setSubmitting(true)
    setError("")

    const formData = new FormData()
    formData.append("slip", file)

    const res = await fetch(apiUrl(`/api/orders/${orderId}/payment`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!res.ok) {
      const data = await res.json()
      setSubmitting(false)
      setError(data.error || "อัปโหลดสลิปไม่สำเร็จ")
      return
    }

    localStorage.removeItem("pending_order_id")
    router.push("/pay-success")
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Upload Slip</h1>
          <p style={copyStyle}>กำลังโหลดข้อมูลออเดอร์...</p>
        </section>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>UPLOAD SLIP</p>
        <h1 style={{ margin: "8px 0 12px", fontSize: 34 }}>PromptPay Evidence</h1>
        <p style={copyStyle}>อัปโหลดหลักฐานการชำระเงินเพื่อส่งให้แอดมินตรวจสอบ</p>

        {error ? <p style={errorStyle}>{error}</p> : null}

        {order ? (
          <div style={summaryBoxStyle}>
            <div style={rowStyle}>
              <span>Order</span>
              <strong>#{order.order_id}</strong>
            </div>
            <div style={rowStyle}>
              <span>Total</span>
              <strong>{order.total_price} THB</strong>
            </div>
            <div style={rowStyle}>
              <span>Status</span>
              <strong style={{ textTransform: "capitalize" }}>{order.latestOrderStatus}</strong>
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 18 }}>
          <input type="file" accept="image/png,image/jpeg" onChange={(e:any)=>setFile(e.target.files[0])} />
          <p style={{ ...copyStyle, marginTop: 8, fontSize: 14 }}>
            รองรับไฟล์ JPG และ PNG ขนาดไม่เกิน 5MB
          </p>
        </div>

        <div style={actionRowStyle}>
          <button type="button" onClick={upload} style={buttonStyle} disabled={submitting}>
            {submitting ? "กำลังอัปโหลด..." : "Upload Slip"}
          </button>
          <Link href="/payment" style={linkStyle}>กลับไปหน้าชำระเงิน</Link>
        </div>
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
  maxWidth: 560,
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
  border: "1px solid #e3d0c0",
  marginTop: 16
} as const

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12
} as const

const actionRowStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  marginTop: 18
} as const

const buttonStyle = {
  border: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6",
  cursor: "pointer",
  fontSize: 14
} as const

const linkStyle = {
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
