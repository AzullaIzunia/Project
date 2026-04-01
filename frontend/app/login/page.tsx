"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
        router.push("/draw")
        return
      }

      setError(data.error || "Login failed")
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>WELCOME BACK</p>
        <h1 style={{ margin: "8px 0 10px", fontSize: 36 }}>Login</h1>
        <p style={copyStyle}>เข้าสู่ระบบเพื่อดูดวง ดูคำสั่งซื้อ และกลับมาจัดการ flow ของคุณต่อ</p>

        <div style={fieldWrapStyle}>
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />
        </div>

        {error ? <p style={errorStyle}>{error}</p> : null}

        <button type="button" onClick={handleSubmit} style={buttonStyle} disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
        </button>

        <div style={footerRowStyle}>
          <Link href="/forgot-password" style={linkStyle}>
            ลืมรหัสผ่าน?
          </Link>
          <Link href="/register" style={linkStyle}>
            สมัครสมาชิก
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
  maxWidth: 460,
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

const fieldWrapStyle = {
  display: "grid",
  gap: 12,
  marginTop: 18
} as const

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d9c6b6",
  background: "#fffdfa",
  color: "#2f2118",
  fontSize: 14
} as const

const buttonStyle = {
  width: "100%",
  marginTop: 16,
  border: "none",
  borderRadius: 999,
  padding: "14px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6",
  cursor: "pointer",
  fontSize: 14
} as const

const footerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap" as const,
  marginTop: 18
} as const

const linkStyle = {
  color: "#7b5234",
  textDecoration: "none"
} as const

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318",
  marginTop: 14
} as const
