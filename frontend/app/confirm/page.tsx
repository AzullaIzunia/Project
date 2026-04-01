"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ConfirmPage() {
  const router = useRouter()
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")

  const handleConfirm = () => {
    localStorage.setItem("address", address)
    localStorage.setItem("order_note", note)
    router.push("/payment")
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>CONFIRM ORDER</p>
        <h1 style={{ margin: "8px 0 12px", fontSize: 36 }}>Final Check Before Payment</h1>
        <p style={copyStyle}>
          ระบุที่อยู่และหมายเหตุเพิ่มเติมก่อนส่งต่อไปหน้าชำระเงิน เพื่อให้ flow ตอนเดโม่ดูครบและเป็นขั้นตอนมากขึ้น
        </p>

        <div style={panelStyle}>
          <div style={miniLabelStyle}>Shipping address</div>
          <textarea
            placeholder="กรอกที่อยู่สำหรับจัดส่ง"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={textareaStyle}
            rows={5}
          />

          <div style={{ ...miniLabelStyle, marginTop: 14 }}>Order note</div>
          <textarea
            placeholder="หมายเหตุเพิ่มเติม เช่น ช่วงเวลาที่สะดวกรับของ"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={textareaStyle}
            rows={3}
          />
        </div>

        <div style={actionRowStyle}>
          <button type="button" onClick={handleConfirm} style={primaryButtonStyle}>
            Continue to Payment
          </button>
          <Link href="/cart" style={secondaryLinkStyle}>
            Back to Cart
          </Link>
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
  maxWidth: 720,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 28,
  padding: 32,
  boxShadow: "0 22px 56px rgba(74, 49, 31, 0.08)"
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: "#9b7458"
} as const

const copyStyle = {
  margin: 0,
  color: "#6e5848",
  lineHeight: 1.8
} as const

const panelStyle = {
  marginTop: 20,
  padding: 18,
  borderRadius: 20,
  background: "#fff8f2",
  border: "1px solid #e3d0c0"
} as const

const miniLabelStyle = {
  color: "#8b705d",
  fontSize: 12,
  letterSpacing: "0.06em"
} as const

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d9c6b6",
  background: "#fffdfa",
  color: "#2f2118",
  fontSize: 14,
  resize: "vertical" as const
} as const

const actionRowStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  marginTop: 22
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
