"use client"

import Link from "next/link"
import { Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatPrice } from "@/lib/display"

export default function UploadSlip() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const pendingOrderId = localStorage.getItem("pending_order_id")

    if (!token) {
      setLoading(false)
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
            Authorization: `Bearer ${token}`,
          },
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
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/upload-slip"
        description="กรุณาเข้าสู่ระบบก่อน เพื่ออัปโหลดสลิปและยืนยันการชำระเงินผ่านพร้อมเพย์"
      />
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
          <div className="text-xs tracking-[0.18em] text-gold">อัปโหลดสลิป</div>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            อัปโหลดหลักฐานการชำระเงิน
          </h1>
          <p className="mt-3 text-muted-foreground">
            ส่งสลิป PromptPay ให้แอดมินตรวจสอบเพื่ออนุมัติคำสั่งซื้อของคุณ
          </p>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 rounded-2xl border border-border bg-background/40 p-8 text-center text-muted-foreground">
              กำลังโหลดข้อมูลออเดอร์...
            </div>
          ) : order ? (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <InfoBlock label="ออเดอร์" value={`#${order.order_id}`} />
                <InfoBlock label="ยอดรวม" value={formatPrice(order.total_price)} />
                <div className="rounded-2xl border border-border bg-background/40 p-4">
                  <div className="text-xs tracking-[0.16em] text-gold">สถานะ</div>
                  <div className="mt-2">
                    <StatusBadge status={order.latestOrderStatus} />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-border bg-background/40 p-5">
                <div className="text-xs tracking-[0.16em] text-gold">คำแนะนำการอัปโหลด</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  หลังอัปโหลดสลิปแล้ว ออเดอร์จะถูกส่งให้แอดมินตรวจสอบอีกครั้ง
                  จากนั้นสถานะจะถูกอัปเดตในหน้าคำสั่งซื้อของคุณ
                </p>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-dashed border-gold/40 bg-gold/5 p-6">
                <label className="block cursor-pointer">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-8 w-8 text-gold" />
                    <div className="mt-3 text-lg font-semibold text-foreground">
                      {file ? file.name : "เลือกไฟล์สลิป"}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      รองรับไฟล์ JPG และ PNG ขนาดไม่เกิน 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={upload} loading={submitting} disabled={!file}>
                  {submitting ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}
                </Button>
                <Link href="/payment">
                  <Button variant="ghost">กลับไปหน้าชำระเงิน</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-border bg-background/40 p-8 text-center">
              <p className="text-muted-foreground">ไม่พบข้อมูลออเดอร์สำหรับการอัปโหลดสลิป</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="text-xs tracking-[0.16em] text-gold">{label}</div>
      <div className="mt-2 text-lg font-semibold text-foreground">{value}</div>
    </div>
  )
}
