"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: "q1",
    question: "ช่วงนี้คุณรู้สึกอย่างไรกับชีวิต?",
    choices: ["รู้สึกสับสน ต้องการทิศทาง", "รู้สึกดี พร้อมรับความท้าทาย", "รู้สึกเหนื่อย ต้องการการพักผ่อน"],
  },
  {
    id: "q2",
    question: "สิ่งที่คุณให้ความสำคัญที่สุดตอนนี้คืออะไร?",
    choices: ["ความรักและความสัมพันธ์", "การเงินและงาน", "สุขภาพและจิตใจ"],
  },
  {
    id: "q3",
    question: "คุณเลือกธาตุพลังงานใด?",
    choices: ["ไฟ — ความกล้าและหลงใหล", "น้ำ — ความลึกและสัญชาตญาณ", "ดิน — ความมั่นคงและปัญญา"],
  },
];

export default function DrawPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const choices = questions.map((q) => answers[q.id]);
      const res = await fetch("/api/fate/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ choices }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "ดูดวงไม่สำเร็จ");
      localStorage.setItem("draw_result", JSON.stringify(data));
      router.push("/choose");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4 animate-float">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            ดูดวงโชคชะตา
          </h1>
          <p className="text-muted-foreground font-body">
            ตอบคำถาม 3 ข้อ เพื่อให้จักรวาลอ่านพลังงานของคุณ
          </p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-8">
          {questions.map((q, qi) => (
            <div key={q.id} className="mystic-card p-6">
              <p className="text-sm text-gold font-body mb-1">ข้อที่ {qi + 1}</p>
              <h2 className="text-base font-serif font-semibold text-foreground mb-4">
                {q.question}
              </h2>
              <div className="flex flex-col gap-3">
                {q.choices.map((choice, ci) => (
                  <button
                    key={ci}
                    onClick={() => setAnswers({ ...answers, [q.id]: ci })}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border text-sm font-body transition-all duration-200",
                      answers[q.id] === ci
                        ? "bg-primary/20 border-primary text-accent"
                        : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <span className="text-gold mr-2">{["✦", "◈", "❋"][ci]}</span>
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
            loading={loading}
            className="px-12"
          >
            <Sparkles className="w-4 h-4" />
            เปิดเผยโชคชะตา
          </Button>
        </div>
      </main>
    </div>
  );
}
