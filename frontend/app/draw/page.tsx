"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

type ChoiceOption = {
  id: string
  title: string
  description: string
  stat: string
  type: "plus" | "minus"
}

type Question = {
  id: string
  prompt: string
  subtitle: string
  options: ChoiceOption[]
}

const questions: Question[] = [
  {
    id: "desire",
    prompt: "ตอนนี้คุณอยากให้ชีวิตขยับไปทางไหนมากที่สุด",
    subtitle: "เลือกสิ่งที่อยากดึงเข้ามาในช่วงนี้",
    options: [
      {
        id: "desire-healing",
        title: "ใจที่เบาขึ้น",
        description: "อยากฟื้นตัว พักใจ และค่อย ๆ กลับมาสมดุล",
        stat: "Healing",
        type: "plus"
      },
      {
        id: "desire-wealth",
        title: "งานและเงินที่มั่นคง",
        description: "อยากให้โอกาส การเงิน และความมั่นใจไหลลื่นขึ้น",
        stat: "Wealth",
        type: "plus"
      },
      {
        id: "desire-creativity",
        title: "แรงบันดาลใจใหม่",
        description: "อยากปลุกไอเดีย ความสนุก และพลังสร้างสรรค์",
        stat: "Creativity",
        type: "plus"
      }
    ]
  },
  {
    id: "release",
    prompt: "พลังแบบไหนที่คุณอยากปล่อยวางออกไป",
    subtitle: "เลือกสิ่งที่รู้สึกว่ากำลังกดทับคุณอยู่",
    options: [
      {
        id: "release-purity",
        title: "ความคาดหวังที่กดดัน",
        description: "อยากเลิกกังวลกับภาพที่ต้องสมบูรณ์แบบ",
        stat: "Purity",
        type: "minus"
      },
      {
        id: "release-passion",
        title: "อารมณ์ที่ร้อนเกินไป",
        description: "อยากลดความหุนหัน ความเร่งรีบ หรือความสัมพันธ์ที่ปั่นป่วน",
        stat: "Passion",
        type: "minus"
      },
      {
        id: "release-wealth",
        title: "ความเครียดเรื่องทรัพยากร",
        description: "อยากปล่อยความกลัวเรื่องเงิน งาน หรือความมั่นคง",
        stat: "Wealth",
        type: "minus"
      }
    ]
  },
  {
    id: "focus",
    prompt: "ถ้าจักรวาลจะส่งข้อความมา คุณอยากให้แตะเรื่องไหนที่สุด",
    subtitle: "เลือกหัวข้อที่อยากได้รับคำตอบมากที่สุด",
    options: [
      {
        id: "focus-healing",
        title: "การเยียวยา",
        description: "อยากรู้ว่าควรดูแลใจและตัวเองอย่างไรต่อ",
        stat: "Healing",
        type: "plus"
      },
      {
        id: "focus-purity",
        title: "ความชัดเจนในใจ",
        description: "อยากเคลียร์ความสับสนและมองภาพให้ชัดขึ้น",
        stat: "Purity",
        type: "plus"
      },
      {
        id: "focus-passion",
        title: "ความสัมพันธ์และความรู้สึก",
        description: "อยากรู้ทิศทางของหัวใจและแรงดึงดูดที่กำลังเกิดขึ้น",
        stat: "Passion",
        type: "plus"
      }
    ]
  }
]

export default function DrawPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, ChoiceOption>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentQuestion.id]
  const isLastQuestion = currentIndex === questions.length - 1
  const canSubmit = questions.every(question => answers[question.id])

  const selectOption = (questionId: string, option: ChoiceOption) => {
    setAnswers(current => ({
      ...current,
      [questionId]: option
    }))
    setError("")
  }

  const submit = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    if (!canSubmit) {
      setError("กรุณาตอบคำถามให้ครบก่อนเริ่มดูดวง")
      return
    }

    setLoading(true)
    setError("")

    const selectedChoices = questions.map(question => {
      const option = answers[question.id]
      return {
        stat: option.stat,
        type: option.type
      }
    })

    try {
      const res = await fetch(apiUrl("/api/fate/draw"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          witch_id: 1,
          choices: selectedChoices
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "เริ่มดูดวงไม่สำเร็จ")
        setLoading(false)
        return
      }

      localStorage.setItem("draw", JSON.stringify(data))
      router.push("/choose")
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบดูดวงได้")
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background:
          "radial-gradient(circle at top, #f9e7cf 0%, #f5efe6 38%, #e7dccd 100%)",
        color: "#2d1f16",
        fontFamily: "Georgia, serif"
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(84, 54, 34, 0.12)",
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 22px 60px rgba(84, 54, 34, 0.12)",
          backdropFilter: "blur(10px)"
        }}
      >
        <p style={{ letterSpacing: "0.18em", fontSize: 12, margin: 0, color: "#8b5e3c" }}>
          FLORDER DIVINATION
        </p>
        <h1 style={{ fontSize: 36, margin: "12px 0 10px" }}>ตอบคำถามเพื่อเปิดคำทำนาย</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#5f4a3a" }}>
          เราจะใช้คำตอบ 3 ข้อของคุณเพื่อปรับพลังในการดูดวง แล้วคัดตัวเลือกคำทำนายที่เหมาะกับช่วงเวลานี้
        </p>

        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#7a634f",
              marginBottom: 8
            }}
          >
            <span>
              คำถาม {currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "#eadccf",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #b77542 0%, #d7a35e 100%)"
              }}
            />
          </div>
        </div>

        <section style={{ marginTop: 28 }}>
          <p style={{ margin: "0 0 8px", color: "#9c6d48", fontSize: 13, letterSpacing: "0.08em" }}>
            {currentQuestion.id.toUpperCase()}
          </p>
          <h2 style={{ margin: "0 0 8px", fontSize: 28 }}>{currentQuestion.prompt}</h2>
          <p style={{ margin: 0, color: "#6a5443", fontSize: 15 }}>
            {currentQuestion.subtitle}
          </p>

          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 22
            }}
          >
            {currentQuestion.options.map(option => {
              const active = currentAnswer?.id === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(currentQuestion.id, option)}
                  style={{
                    textAlign: "left",
                    padding: "18px 18px 18px 20px",
                    borderRadius: 20,
                    border: active ? "2px solid #b77542" : "1px solid #dbc5b3",
                    background: active ? "#fff5ea" : "rgba(255,255,255,0.88)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#3a281d" }}>
                    {option.title}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "#6d5544" }}>
                    {option.description}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 20,
            background: "#f7efe6",
            border: "1px solid #e4d4c5"
          }}
        >
          <div style={{ fontSize: 13, color: "#9c6d48", letterSpacing: "0.08em" }}>
            สรุปคำตอบ
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {questions.map((question, index) => (
              <div key={question.id} style={{ color: "#5e4a3b", fontSize: 14 }}>
                {index + 1}. {answers[question.id]?.title || "ยังไม่ได้เลือก"}
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <p style={{ marginTop: 18, color: "#b42318", fontSize: 14 }}>{error}</p>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            marginTop: 24,
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentIndex(index => Math.max(0, index - 1))}
            disabled={currentIndex === 0 || loading}
            style={{
              padding: "14px 18px",
              borderRadius: 999,
              border: "1px solid #d4bda9",
              background: currentIndex === 0 || loading ? "#efe4d9" : "#fff",
              color: "#6b5342",
              cursor: currentIndex === 0 || loading ? "not-allowed" : "pointer",
              minWidth: 120
            }}
          >
            ย้อนกลับ
          </button>

          {!isLastQuestion ? (
            <button
              type="button"
              onClick={() => {
                if (!currentAnswer) {
                  setError("เลือกคำตอบก่อน ไปข้อถัดไป")
                  return
                }
                setCurrentIndex(index => Math.min(questions.length - 1, index + 1))
              }}
              disabled={loading}
              style={{
                padding: "14px 22px",
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(90deg, #b77542 0%, #d79b57 100%)",
                color: "#fffdf8",
                cursor: loading ? "not-allowed" : "pointer",
                minWidth: 140
              }}
            >
              ข้อถัดไป
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit || loading}
              style={{
                padding: "14px 22px",
                borderRadius: 999,
                border: "none",
                background: !canSubmit || loading
                  ? "#d9c6b6"
                  : "linear-gradient(90deg, #8d5334 0%, #c47c44 100%)",
                color: "#fffdf8",
                cursor: !canSubmit || loading ? "not-allowed" : "pointer",
                minWidth: 180
              }}
            >
              {loading ? "กำลังเปิดคำทำนาย..." : "เริ่มดูดวง"}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
