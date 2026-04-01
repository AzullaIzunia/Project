"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

type Step = "email" | "otp" | "reset" | "done"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const requestOtp = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "ส่ง OTP ไม่สำเร็จ")
        return
      }

      setToken(data.token)
      setStep("otp")
      setMessage("ส่ง OTP แล้ว กรุณาตรวจอีเมลและกรอกรหัส 6 หลัก")
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(apiUrl("/api/auth/verify-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, otp })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "OTP ไม่ถูกต้อง")
        return
      }

      setEmail(data.email)
      setStep("reset")
      setMessage("ยืนยัน OTP สำเร็จ ตั้งรหัสผ่านใหม่ได้เลย")
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้")
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "ตั้งรหัสผ่านใหม่ไม่สำเร็จ")
        return
      }

      setStep("done")
      setMessage("เปลี่ยนรหัสผ่านสำเร็จแล้ว คุณสามารถกลับไปเข้าสู่ระบบได้")
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>ACCOUNT RECOVERY</p>
        <h1 style={{ margin: "8px 0 10px", fontSize: 34 }}>Forgot Password</h1>
        <p style={copyStyle}>
          ขอ OTP ทางอีเมล ยืนยันตัวตน แล้วตั้งรหัสผ่านใหม่ใน flow เดียว
        </p>

        <div style={stepRowStyle}>
          {["email", "otp", "reset", "done"].map((item, index) => (
            <div
              key={item}
              style={{
                ...stepChipStyle,
                background:
                  item === step ? "#7c5234" : index <= stepIndex(step) ? "#d9b79a" : "#f2e5d8",
                color: item === step ? "#fffaf6" : "#6b5545"
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {step === "email" ? (
          <div style={fieldWrapStyle}>
            <input
              placeholder="Email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              style={inputStyle}
            />
            <button type="button" onClick={requestOtp} style={buttonStyle} disabled={loading || !email}>
              {loading ? "กำลังส่ง OTP..." : "ส่ง OTP"}
            </button>
          </div>
        ) : null}

        {step === "otp" ? (
          <div style={fieldWrapStyle}>
            <input
              placeholder="OTP 6 หลัก"
              value={otp}
              onChange={event => setOtp(event.target.value)}
              style={inputStyle}
            />
            <button type="button" onClick={verifyOtp} style={buttonStyle} disabled={loading || !otp}>
              {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
            </button>
          </div>
        ) : null}

        {step === "reset" ? (
          <div style={fieldWrapStyle}>
            <input value={email} readOnly style={{ ...inputStyle, background: "#f6eee7" }} />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={updatePassword}
              style={buttonStyle}
              disabled={loading || !newPassword}
            >
              {loading ? "กำลังบันทึก..." : "ตั้งรหัสผ่านใหม่"}
            </button>
          </div>
        ) : null}

        {step === "done" ? (
          <div style={fieldWrapStyle}>
            <button type="button" onClick={() => router.push("/login")} style={buttonStyle}>
              กลับไปหน้า Login
            </button>
          </div>
        ) : null}

        {error ? <p style={errorStyle}>{error}</p> : null}
        {message ? <p style={noticeStyle}>{message}</p> : null}

        <div style={{ marginTop: 18 }}>
          <Link href="/login" style={linkStyle}>
            ← กลับไปหน้า Login
          </Link>
        </div>
      </section>
    </main>
  )
}

function stepIndex(step: Step) {
  const steps: Step[] = ["email", "otp", "reset", "done"]
  return steps.indexOf(step)
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
  maxWidth: 500,
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

const stepRowStyle = {
  display: "flex",
  gap: 10,
  marginTop: 18
} as const

const stepChipStyle = {
  width: 34,
  height: 34,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  fontSize: 13
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

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginTop: 14
} as const
