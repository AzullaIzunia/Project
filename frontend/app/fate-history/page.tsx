"use client"

import Link from "next/link"
import { BookOpen, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import ProtectedGate from "@/components/protected-gate"
import { Button } from "@/components/ui/button"
import { statLabel } from "@/lib/display"

type FateHistoryItem = {
  result_id: number
  drawn_stat: string
  result: string
  createdAt: string
  special_event: boolean
  fate: {
    stone: string
  }
}

export default function FateHistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<FateHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setLoading(false)
      return
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(apiUrl("/api/fate/history"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "โหลดประวัติผลดูดวงไม่สำเร็จ")
        }

        setItems(data)
      } catch (error: unknown) {
        setError(getErrorMessage(error, "โหลดประวัติผลดูดวงไม่สำเร็จ"))
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/fate-history"
        description="กรุณาเข้าสู่ระบบก่อน เพื่อย้อนดูคำทำนายเก่าและกลับไปเปิดหน้าสินค้าแนะนำจากผลเดิมได้"
      />
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.18em] text-gold">คลังคำทำนาย</div>
            <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">ประวัติดวงของฉัน</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              ย้อนกลับมาดูคำทำนายย้อนหลัง หินมงคลที่เคยได้ และเปิดหน้าสินค้าแนะนำต่อจากผลแต่ละครั้งได้ทันที
            </p>
          </div>
          <Link href="/draw">
            <Button>ดูดวงอีกครั้ง</Button>
          </Link>
        </div>

        {!loading && !error ? (
          <section className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="text-xs tracking-[0.16em] text-gold">จำนวนการเปิดดวง</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">{items.length}</div>
              <p className="mt-2 text-sm text-muted-foreground">จำนวนผลดูดวงที่บันทึกไว้ทั้งหมด</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="text-xs tracking-[0.16em] text-gold">เหตุการณ์พิเศษ</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">
                {items.filter((item) => item.special_event).length}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">ครั้งที่เกิดเหตุการณ์พิเศษระหว่างการเปิดดวง</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card/70 p-5">
              <div className="text-xs tracking-[0.16em] text-gold">หินมงคลล่าสุด</div>
              <div className="mt-3 text-2xl font-semibold text-foreground">{items[0]?.fate?.stone || "-"}</div>
              <p className="mt-2 text-sm text-muted-foreground">หินมงคลล่าสุดจากผลดูดวงครั้งล่าสุด</p>
            </div>
          </section>
        ) : null}

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
            กำลังโหลดประวัติผลดูดวง...
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <section className="rounded-[2rem] border border-border bg-card/70 p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-gold" />
            <h2 className="mt-5 text-2xl font-semibold text-foreground">ยังไม่มีประวัติผลดูดวง</h2>
            <p className="mt-3 text-muted-foreground">เมื่อคุณเริ่มดูดวงและเลือกคำทำนายแล้ว รายการจะมาแสดงที่หน้านี้</p>
            <div className="mt-6">
              <Link href="/draw">
                <Button>เริ่มดูดวง</Button>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="grid gap-4">
          {items.map((item) => (
            <article key={item.result_id} className="rounded-[1.75rem] border border-border bg-card/70 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-xs tracking-[0.16em] text-gold">
                    <Sparkles className="h-3.5 w-3.5" />
                    {statLabel(item.drawn_stat)}
                  </div>
                  <div className="mt-4 text-2xl font-semibold text-foreground">{item.fate?.stone || "-"}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
                {item.special_event ? (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-[var(--gold-muted)]">
                    เหตุการณ์พิเศษ
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-sm leading-8 text-muted-foreground">{item.result}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/recommend/${item.result_id}`}>
                  <Button>ดูสินค้าแนะนำ</Button>
                </Link>
                <Link href="/draw">
                  <Button variant="ghost">เปิดดวงใหม่</Button>
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
