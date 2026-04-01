"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [form, setForm] = useState({
    name: "",
    address: "",
    telephone: "",
    password: ""
  })

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        setError("กรุณาเข้าสู่ระบบก่อน")
        return
      }

      const res = await fetch(apiUrl("/api/user/me"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ")
        setLoading(false)
        return
      }

      setForm({
        name: data.name || "",
        address: data.address || "",
        telephone: data.telephone || "",
        password: ""
      })
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleSave = async () => {
    const token = localStorage.getItem("token")
    setError("")
    setNotice("")

    if (!form.name.trim()) {
      setError("กรุณากรอกชื่อ")
      return
    }

    if (form.password && form.password.length < 6) {
      setError("รหัสผ่านใหม่ควรยาวอย่างน้อย 6 ตัวอักษร")
      return
    }

    setSaving(true)

    const res = await fetch(apiUrl("/api/user/update"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "อัปเดตโปรไฟล์ไม่สำเร็จ")
      setSaving(false)
      return
    }

    setForm(current => ({
      ...current,
      password: ""
    }))
    setNotice("อัปเดตข้อมูลเรียบร้อยแล้ว")
    setSaving(false)
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Profile</h1>
          <p>กำลังโหลดข้อมูลโปรไฟล์...</p>
        </section>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>PROFILE</p>
        <h1 style={{ margin: "8px 0 18px", fontSize: 34 }}>Profile</h1>

        <div style={fieldWrapStyle}>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
            placeholder="Name"
          />

          <input
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            style={inputStyle}
            placeholder="Address"
          />

          <input
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
            style={inputStyle}
            placeholder="Telephone"
          />

          <input
            type="password"
            placeholder="New password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />
        </div>

        {error ? <p style={errorStyle}>{error}</p> : null}
        {notice ? <p style={noticeStyle}>{notice}</p> : null}

        <div style={actionRowStyle}>
          <button onClick={handleSave} style={buttonStyle} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "Save"}
          </button>
          <Link href="/orders" style={linkStyle}>My Orders</Link>
          <Link href="/fate-history" style={linkStyle}>Fate History</Link>
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

const fieldWrapStyle = {
  display: "grid",
  gap: 12
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
  marginTop: 16
} as const

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginTop: 16
} as const
