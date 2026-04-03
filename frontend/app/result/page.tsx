"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type StoredResult = {
  result_id: number
  stone: string
  result: string
}

export default function ResultPage() {
  const router = useRouter()
  const [result] = useState<StoredResult | null>(() => {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem("result")
    if (!raw) return null
    try {
      return JSON.parse(raw) as StoredResult
    } catch {
      return null
    }
  })
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (!result) {
      router.push("/choose")
      return
    }
    const timeoutId = window.setTimeout(() => setShowResult(true), 250)
    return () => window.clearTimeout(timeoutId)
  }, [result, router])

  if (!result) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
          กำลังเปิดผลคำทำนาย...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <section
        className={`mx-auto max-w-4xl transition-all duration-700 ${
          showResult ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            ผลลัพธ์ของการเปิดไพ่ครั้งนี้
          </div>
        </div>

        <div className="mt-8 mystic-card p-8 text-center sm:p-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-[#f7efe1] text-4xl text-gold">
            ✦
          </div>
          <div className="mt-6 text-xs tracking-[0.18em] text-gold">หินมงคลของคุณ</div>
          <h1 className="mt-3 text-4xl font-semibold text-foreground md:text-5xl">{result.stone}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            {result.result}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/recommend/${result.result_id}`}>
              <Button size="lg">ดูสินค้าแนะนำ</Button>
            </Link>
            <Link href="/draw">
              <Button size="lg" variant="ghost">เริ่มดูดวงใหม่</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="mystic-card p-6">
            <div className="text-xs tracking-[0.18em] text-gold">เกี่ยวกับคำทำนายนี้</div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              ผลลัพธ์นี้จะถูกใช้เชื่อมกับหน้าสินค้าแนะนำของคุณ เพื่อให้ดูรายการสินค้าที่สัมพันธ์กับพลังของหินมงคลได้ทันที
            </p>
          </div>
          <div className="mystic-card p-6">
            <div className="text-xs tracking-[0.18em] text-gold">ขั้นตอนถัดไป</div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              คุณสามารถเปิดหน้าสินค้าเพิ่มเติม ใส่ตะกร้า ชำระเงิน และกลับมาดูประวัติดวงย้อนหลังได้จากบัญชีเดียวกัน
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
