"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api"
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

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  const handleSubmit = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    const choices = questions.map((question) => {
      const selectedOption = question.options.find((option) => option.id === answers[question.id])
      return selectedOption?.choice
    }).filter(Boolean)

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
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
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
        </div>

        <div className="mystic-card rounded-[2rem] p-6 sm:p-8">
          <div className="text-xs tracking-[0.18em] text-gold">FORTUNE QUESTIONS</div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            {currentQuestion.question}
          </h1>

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
                    "w-full rounded-2xl border-2 p-5 text-left transition-all duration-200",
                    isSelected
                      ? "border-gold bg-gold/15 text-foreground"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-medium">{option.label}</span>
                    {isSelected ? <CheckCircle className="h-5 w-5 text-gold" /> : null}
                  </div>
                </button>
              )
            })}
          </div>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
      </div>
    </main>
  )
}
