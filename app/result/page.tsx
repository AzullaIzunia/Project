"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Suspense } from "react";

interface FateResult {
  result_id: string;
  stone: string;
  result: string;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const [result, setResult] = useState<FateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resultId) { router.push("/draw"); return; }
    fetch(`/api/fate/result/${resultId}`, {
      headers: authHeaders() as Record<string, string>,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setResult(data);
      })
      .catch(() => setError("โหลดผลดูดวงไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [resultId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground font-body">กำลังเปิดเผยโชคชะตา...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-20">
        <p className="text-red-300 font-body">{error || "ไม่พบผลดูดวง"}</p>
        <Button onClick={() => router.push("/draw")} className="mt-4">ดูดวงใหม่</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center mx-auto mb-4 animate-float">
          <span className="text-4xl">✦</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          ผลโชคชะตาของคุณ
        </h1>
        <span className="mystic-badge border-gold/40 text-gold">
          หิน: {result.stone}
        </span>
      </div>

      <div className="mystic-card p-8 text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">◈</span>
        </div>
        <h2 className="text-lg font-serif font-semibold text-gold mb-4">{result.stone}</h2>
        <p className="text-muted-foreground font-body leading-relaxed text-base">
          {result.result}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="gold"
          size="lg"
          onClick={() => router.push(`/products?result_id=${result.result_id}`)}
        >
          <ShoppingBag className="w-4 h-4" />
          ดูสินค้าแนะนำ
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push("/draw")}
        >
          <Sparkles className="w-4 h-4" />
          ดูดวงอีกครั้ง
        </Button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background star-bg">
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        }>
          <ResultContent />
        </Suspense>
      </main>
    </div>
  );
}
