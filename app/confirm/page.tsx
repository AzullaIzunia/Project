"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { authHeaders } from "@/lib/auth";
import { MapPin } from "lucide-react";

export default function ConfirmPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("pending_order_id");
    if (!id) { router.push("/cart"); return; }
    setOrderId(id);
  }, [router]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) { setError("กรุณากรอกที่อยู่จัดส่ง"); return; }
    if (!orderId) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ address, order_note: note }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "เกิดข้อผิดพลาด");
      }
      router.push("/payment");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">ยืนยันที่อยู่</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            กรุณากรอกที่อยู่สำหรับจัดส่งของมู
          </p>
        </div>

        <div className="mystic-card p-6 sm:p-8">
          <form onSubmit={handleConfirm} className="flex flex-col gap-5">
            <Textarea
              id="address"
              label="ที่อยู่จัดส่ง"
              placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              error={error && !address.trim() ? error : undefined}
            />
            <Textarea
              id="note"
              label="หมายเหตุ (ไม่บังคับ)"
              placeholder="ข้อความพิเศษถึงแม่มด..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            {error && address.trim() && (
              <div className="px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
                {error}
              </div>
            )}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              ดำเนินการต่อ
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
