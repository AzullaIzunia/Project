"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedGate from "@/components/protected-gate"
import { apiUrl } from "@/lib/api"
import { statLabel } from "@/lib/display"
import { cn } from "@/lib/utils"

const questions = [
  {
    id: 1,
    question: "ตอนนี้คุณรู้สึกอย่างไรกับช่วงชีวิตนี้",
    options: [
      { id: "a", label: "นิ่งและชัดเจน", choice: { stat: "Purity", type: "plus" as const } },
      { id: "b", label: "กำลังค้นหาทิศทาง", choice: { stat: "Healing", type: "plus" as const } },
      { id: "c", label: "อยากเปลี่ยนแปลงบางอย่าง", choice: { stat: "Passion", type: "plus" as const } },
      { id: "d", label: "กังวลเรื่องความมั่นคง", choice: { stat: "Wealth", type: "plus" as const } },
    ],
  },
  {
    id: 2,
    question: "สิ่งที่คุณอยากให้ชีวิตดีขึ้นมากที่สุดคืออะไร",
    options: [
      { id: "a", label: "ความรักและความสัมพันธ์", choice: { stat: "Charm", type: "plus" as const } },
      { id: "b", label: "งานและโอกาสใหม่", choice: { stat: "Creativity", type: "plus" as const } },
      { id: "c", label: "โชคลาภและการเงิน", choice: { stat: "Abundance", type: "plus" as const } },
      { id: "d", label: "พลังใจและการฟื้นตัว", choice: { stat: "Healing", type: "plus" as const } },
    ],
  },
  {
    id: 3,
    question: "วันนี้คุณอยากเปิดไพ่เพื่อถามเรื่องอะไร",
    options: [
      { id: "a", label: "ทางเลือกที่ดีที่สุดตอนนี้", choice: { stat: "Purity", type: "minus" as const } },
      { id: "b", label: "โอกาสที่กำลังเข้ามา", choice: { stat: "Wealth", type: "plus" as const } },
      { id: "c", label: "สิ่งที่ควรปล่อยวาง", choice: { stat: "Passion", type: "minus" as const } },
      { id: "d", label: "พลังที่ควรดึงมาใช้", choice: { stat: "Charm", type: "plus" as const } },
    ],
  },
]

export default function DrawPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/draw"
        description="กรุณาเข้าสู่ระบบก่อน เพื่อเริ่มตอบคำถามและเปิดไพ่ในประสบการณ์ดูดวงของคุณ"
      />
    )
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    const choices = questions
      .map((question) => {
        const selectedOption = question.options.find((option) => option.id === answers[question.id])
        return selectedOption?.choice
      })
      .filter(Boolean)

    if (choices.length !== questions.length) {
      setError("กรุณาตอบคำถามให้ครบก่อนเปิดไพ่")
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch(apiUrl("/api/fate/draw"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        witch_id: 1,
        choices,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "ไม่สามารถเปิดทางเลือกไพ่ได้")
      setLoading(false)
      return
    }

    localStorage.setItem("draw", JSON.stringify(data))
    router.push("/choose")
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
          <section className="xl:sticky xl:top-24 xl:self-start">
            <div className="mystic-card p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm text-foreground shadow-sm">
                <Sparkles className="h-4 w-4 text-gold" />
                คำถามนำทางก่อนเปิดไพ่
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                เริ่มต้นด้วย
                <br />
                <span className="text-neutral-500">การสำรวจใจตัวเอง</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                ตอบคำถาม 3 ข้อเพื่อให้ระบบตีความพลังงานที่กำลังเด่นในช่วงเวลานี้
                แล้วค่อยไปเลือกไพ่ที่สะท้อนเส้นทางของคุณมากที่สุด
              </p>

              <div className="mt-8 rounded-[1.5rem] border border-border bg-background/40 p-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    คำถามที่ {step + 1} จาก {questions.length}
                  </span>
                  <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm transition-colors",
                        index === step
                          ? "border-black bg-black text-white"
                          : answers[question.id]
                            ? "border-gold/30 bg-gold/10 text-foreground"
                            : "border-border bg-background/50 text-muted-foreground"
                      )}
                    >
                      คำถาม {index + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-border bg-[#15120d] p-5 text-white">
                <div className="text-xs tracking-[0.16em] text-[#d9b66a]">ขั้นตอนถัดไป</div>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  หลังตอบครบ ระบบจะสร้างไพ่ 3 ใบให้คุณเลือกต่อในหน้า `choose`
                  พร้อมเปิดคำทำนายและแนะนำสินค้าที่เชื่อมกับผลลัพธ์ใน flow เดียว
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="mystic-card rounded-[2rem] p-6 sm:p-8">
              <div className="text-xs tracking-[0.18em] text-gold">คำถามเปิดไพ่</div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                {currentQuestion.question}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                เลือกคำตอบที่ใกล้ความรู้สึกของคุณที่สุด เพื่อให้ระบบอ่านภาพรวมของพลังงานในตอนนี้ได้แม่นยำขึ้น
              </p>

              <div className="mt-8 space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))
                        setError("")
                      }}
                      className={cn(
                        "w-full rounded-[1.5rem] border-2 p-5 text-left transition-all duration-200",
                        isSelected
                          ? "border-gold bg-gold/15 text-foreground shadow-[0_14px_30px_rgba(202,162,77,0.12)]"
                          : "border-border bg-background/60 hover:border-gold/30 hover:-translate-y-0.5"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs tracking-[0.16em] text-gold">
                            ตัวเลือก {option.id.toUpperCase()} · {statLabel(option.choice.stat)}
                          </div>
                          <span className="mt-2 block text-base font-medium">{option.label}</span>
                        </div>
                        {isSelected ? <CheckCircle className="h-5 w-5 text-gold" /> : null}
                      </div>
                    </button>
                  )
                })}
              </div>

              {error ? (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="mt-8 flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep((current) => Math.max(current - 1, 0))}
                  disabled={step === 0 || loading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  ย้อนกลับ
                </Button>
                <Button
                  onClick={() => {
                    if (step < questions.length - 1) {
                      setStep((current) => current + 1)
                      return
                    }
                    handleSubmit()
                  }}
                  disabled={!answers[currentQuestion.id] || loading}
                  loading={loading}
                >
                  {step === questions.length - 1 ? "เปิดไพ่" : "ถัดไป"}
                  {step < questions.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
