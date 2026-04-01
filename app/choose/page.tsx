"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DrawResult {
  session_id: string;
  options: { id: string; label: string; preview?: string }[];
}

export default function ChoosePage() {
  const router = useRouter();
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("draw_result");
    if (!raw) { router.push("/draw"); return; }
    setDrawResult(JSON.parse(raw));
  }, [router]);

  const handleChoose = async () => {
    if (!selected || !drawResult) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/fate/choose", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ session_id: drawResult.session_id, choice_id: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เลือกผลไม่สำเร็จ");
      router.push(`/result?result_id=${data.result_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const stoneSymbols = ["◈", "✦", "❋"];
  const stoneColors = [
    "from-blue-900/40 to-indigo-900/40 border-blue-700/50",
    "from-violet-900/40 to-purple-900/40 border-violet-700/50",
    "from-fuchsia-900/40 to-pink-900/40 border-fuchsia-700/50",
  ];

  if (!drawResult) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-2xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center mx-auto mb-4 animate-float">
            <span className="text-2xl text-accent">✦</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            เลือกผลลัพธ์ของคุณ
          </h1>
          <p className="text-muted-foreground font-body">
            จักรวาลเตรียมหินพลังงาน 3 ดวงไว้ให้คุณ เลือกสิ่งที่สั่นสะเทือนหัวใจ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {drawResult.options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "relative rounded-xl border bg-gradient-to-b p-6 flex flex-col items-center gap-3 transition-all duration-300",
                stoneColors[i % stoneColors.length],
                selected === opt.id
                  ? "ring-2 ring-accent scale-105 shadow-lg shadow-accent/20"
                  : "hover:scale-102 hover:shadow-md"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all",
                selected === opt.id ? "bg-accent/30 border-2 border-accent" : "bg-white/5 border border-white/10"
              )}>
                {stoneSymbols[i % stoneSymbols.length]}
              </div>
              <p className="text-sm font-body text-foreground text-center">{opt.label}</p>
              {selected === opt.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <Button size="lg" onClick={handleChoose} disabled={!selected} loading={loading} className="px-12">
            <Sparkles className="w-4 h-4" />
            เปิดเผยผลดวง
          </Button>
        </div>
      </main>
    </div>
  );
}
