"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.name || !form.surname || !form.email || !form.password) {
      setError("กรุณากรอกข้อมูลให้ครบ")
      return
    }

    if (!form.email.includes("@")) {
      setError("กรุณากรอกอีเมลให้ถูกต้อง")
      return
    }

    if (form.password.length < 6) {
      setError("รหัสผ่านควรยาวอย่างน้อย 6 ตัวอักษร")
      return
    }

    setLoading(true)

    const res = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess("สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ")
      setTimeout(() => router.push("/login"), 800)
    } else {
      setError(data.error || "สมัครสมาชิกไม่สำเร็จ")
    }

    setLoading(false)
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>NEW ACCOUNT</p>
        <h1 style={{ margin: "8px 0 10px", fontSize: 36 }}>Register</h1>
        <p style={copyStyle}>สร้างบัญชีเพื่อเริ่มดูดวง จัดการโปรไฟล์ และติดตามคำสั่งซื้อของคุณ</p>

        <form onSubmit={handleSubmit} style={fieldWrapStyle}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={inputStyle}
          />
          <input
            placeholder="Surname"
            value={form.surname}
            onChange={e => setForm({...form, surname: e.target.value})}
            style={inputStyle}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={inputStyle}
          />

          {error ? <p style={errorStyle}>{error}</p> : null}
          {success ? <p style={successStyle}>{success}</p> : null}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "กำลังสมัครสมาชิก..." : "Register"}
          </button>
        </form>
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
  border: "none",
  borderRadius: 999,
  padding: "14px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6",
  cursor: "pointer",
  fontSize: 14
} as const

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318"
} as const

const successStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e"
} as const
