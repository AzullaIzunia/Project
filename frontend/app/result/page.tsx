"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type StoredResult = {
  result_id: number
  stone: string
  result: string
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<StoredResult | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("result")
    if (!raw) {
      router.push("/choose")
      return
    }

    try {
      setResult(JSON.parse(raw))
    } catch {
      router.push("/choose")
    }
  }, [router])

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
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card/70 p-8 text-center">
        <div className="text-xs tracking-[0.18em] text-gold">YOUR RESULT</div>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">{result.stone}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          {result.result}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/recommend/${result.result_id}`}>
            <Button>ดูสินค้าแนะนำ</Button>
          </Link>
          <Link href="/draw">
            <Button variant="ghost">เริ่มดูดวงใหม่</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
