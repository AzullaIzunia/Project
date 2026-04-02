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
        <p style={eyebrowStyle}>ยืนยันก่อนชำระเงิน</p>
        <h1 style={{ margin: "8px 0 12px", fontSize: 36 }}>ตรวจรายละเอียดก่อนไปหน้าจ่ายเงิน</h1>
        <p style={copyStyle}>
          ระบุที่อยู่และหมายเหตุเพิ่มเติมก่อนส่งต่อไปหน้าชำระเงิน เพื่อให้ flow ตอนเดโม่ดูครบและเป็นขั้นตอนมากขึ้น
        </p>

        <div style={panelStyle}>
          <div style={miniLabelStyle}>ที่อยู่สำหรับจัดส่ง</div>
          <textarea
            placeholder="กรอกที่อยู่สำหรับจัดส่ง"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={textareaStyle}
            rows={5}
          />

          <div style={{ ...miniLabelStyle, marginTop: 14 }}>หมายเหตุคำสั่งซื้อ</div>
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
            ไปหน้าชำระเงิน
          </button>
          <Link href="/cart" style={secondaryLinkStyle}>
            กลับไปตะกร้า
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
  background: "radial-gradient(circle at top, rgba(139,92,246,0.18), transparent 28%), linear-gradient(180deg, #0a0a0f 0%, #12111a 100%)",
  fontFamily: "Georgia, serif",
  color: "#f0f0f5"
} as const

const cardStyle = {
  width: "100%",
  maxWidth: 720,
  background: "rgba(18,18,26,0.92)",
  border: "1px solid rgba(74,65,97,0.7)",
  borderRadius: 28,
  padding: 32,
  boxShadow: "0 30px 70px rgba(4,3,12,0.35)"
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: "#d4a574"
} as const

const copyStyle = {
  margin: 0,
  color: "rgba(240,240,245,0.68)",
  lineHeight: 1.8
} as const

const panelStyle = {
  marginTop: 20,
  padding: 18,
  borderRadius: 20,
  background: "rgba(15,15,23,0.85)",
  border: "1px solid rgba(74,65,97,0.7)"
} as const

const miniLabelStyle = {
  color: "#d4a574",
  fontSize: 12,
  letterSpacing: "0.06em"
} as const

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(74,65,97,0.7)",
  background: "rgba(10,10,15,0.7)",
  color: "#f0f0f5",
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
  background: "linear-gradient(90deg, #8b5cf6 0%, #6d3ef0 100%)",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: 14
} as const

const secondaryLinkStyle = {
  display: "inline-block",
  textDecoration: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "rgba(18,18,26,0.92)",
  border: "1px solid rgba(74,65,97,0.7)",
  color: "#f0f0f5"
} as const
