"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth";
import { Sparkles, ShoppingBag, ChevronRight } from "lucide-react";

interface FateHistoryItem {
  result_id: string;
  stone: string;
  result: string;
  created_at: string;
}

export default function FateHistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<FateHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/fate/history", {
      headers: authHeaders() as Record<string, string>,
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setError(data.message || "โหลดประวัติไม่สำเร็จ");
      })
      .catch(() => setError("โหลดประวัติไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">ประวัติโชคชะตา</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">
              การเดินทางทางจิตวิญญาณของคุณ
            </p>
          </div>
          <Button onClick={() => router.push("/draw")} variant="secondary" size="sm">
            <Sparkles className="w-4 h-4" />
            ดูดวงใหม่
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground font-body">กำลังโหลด...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-300 font-body">{error}</p>
            <Button onClick={() => router.push("/login")} className="mt-4">เข้าสู่ระบบ</Button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-accent" />
            </div>
            <p className="text-muted-foreground font-body mb-4">ยังไม่มีประวัติดูดวง</p>
            <Button onClick={() => router.push("/draw")}>เริ่มดูดวงครั้งแรก</Button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.result_id} className="mystic-card p-5 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent">✦</span>
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-foreground text-sm">
                      {item.stone}
                    </p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      {new Date(item.created_at).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    router.push(`/products?result_id=${item.result_id}`)
                  }
                  className="flex-shrink-0"
                >
                  <ShoppingBag className="w-4 h-4" />
                  สินค้า
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground font-body mt-3 leading-relaxed line-clamp-2">
                {item.result}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
