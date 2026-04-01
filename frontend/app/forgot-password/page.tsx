"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, otp }),
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
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
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <section className="rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
          <div className="text-xs tracking-[0.18em] text-gold">ACCOUNT RECOVERY</div>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            Forgot Password
          </h1>
          <p className="mt-3 text-muted-foreground">
            ขอ OTP ทางอีเมล ยืนยันตัวตน แล้วตั้งรหัสผ่านใหม่ใน flow เดียว
          </p>

          <div className="mt-6 flex gap-2">
            {["email", "otp", "reset", "done"].map((item, index) => (
              <div
                key={item}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                  item === step
                    ? "bg-foreground text-background"
                    : index <= stepIndex(step)
                      ? "bg-gold/20 text-gold"
                      : "bg-background/40 text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {step === "email" ? (
              <>
                <Input
                  id="email"
                  label="อีเมล"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button type="button" onClick={requestOtp} className="w-full justify-center" disabled={loading || !email}>
                  {loading ? "กำลังส่ง OTP..." : "ส่ง OTP"}
                </Button>
              </>
            ) : null}

            {step === "otp" ? (
              <>
                <Input
                  id="otp"
                  label="OTP 6 หลัก"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
                <Button type="button" onClick={verifyOtp} className="w-full justify-center" disabled={loading || !otp}>
                  {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
                </Button>
              </>
            ) : null}

            {step === "reset" ? (
              <>
                <Input id="verified-email" label="อีเมล" value={email} readOnly />
                <Input
                  id="new-password"
                  type="password"
                  label="รหัสผ่านใหม่"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <Button
                  type="button"
                  onClick={updatePassword}
                  className="w-full justify-center"
                  disabled={loading || !newPassword}
                >
                  {loading ? "กำลังบันทึก..." : "ตั้งรหัสผ่านใหม่"}
                </Button>
              </>
            ) : null}

            {step === "done" ? (
              <Button type="button" onClick={() => router.push("/login")} className="w-full justify-center">
                กลับไปหน้า Login
              </Button>
            ) : null}
          </div>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-5 rounded-xl border border-green-800/50 bg-green-900/20 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          ) : null}

          <div className="mt-6">
            <Link href="/login" className="text-sm text-muted-foreground no-underline hover:text-foreground">
              ← กลับไปหน้า Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function stepIndex(step: Step) {
  const steps: Step[] = ["email", "otp", "reset", "done"]
  return steps.indexOf(step)
}
