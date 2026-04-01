"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth";
import { StatusBadge } from "@/components/ui/status-badge";
import { CreditCard, QrCode, Package } from "lucide-react";

interface Order {
  id: string;
  total: number;
  payment_method: string;
  status: string;
  items: { name: string; quantity: number; price: number }[];
}

export default function PaymentPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const orderId = localStorage.getItem("pending_order_id");
    if (!orderId) { router.push("/cart"); return; }
    fetch(`/api/orders/${orderId}`, {
      headers: authHeaders() as Record<string, string>,
    })
      .then((r) => r.json())
      .then((data) => setOrder(data))
      .catch(() => setError("โหลดออเดอร์ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleCreditCardPay = async () => {
    if (!order) return;
    setPaying(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${order.id}/pay`, {
        method: "POST",
        headers: authHeaders() as Record<string, string>,
      });
      if (!res.ok) throw new Error("ชำระเงินไม่สำเร็จ");
      router.push("/pay-success");
    } catch {
      router.push("/pay-fail");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground font-body">{error || "ไม่พบออเดอร์"}</p>
          <Button onClick={() => router.push("/cart")}>กลับไปตะกร้า</Button>
        </div>
      </div>
    );
  }

  const isPromptPay = order.payment_method === "promptpay";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4">
            {isPromptPay ? <QrCode className="w-6 h-6 text-accent" /> : <CreditCard className="w-6 h-6 text-accent" />}
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">ชำระเงิน</h1>
        </div>

        <div className="mystic-card p-6 flex flex-col gap-5">
          {/* Order summary */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-body mb-3">รายการสินค้า</p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm font-body py-1.5 border-b border-border last:border-0">
                <span className="text-muted-foreground">{item.name} ×{item.quantity}</span>
                <span className="text-foreground">฿{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-body font-semibold">
            <span className="text-foreground">ยอดรวมทั้งหมด</span>
            <span className="text-gold text-lg">฿{order.total?.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-body">วิธีชำระ</span>
            <span className="text-sm text-foreground font-body">
              {isPromptPay ? "PromptPay" : "Credit Card"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-body">สถานะ</span>
            <StatusBadge status={order.status} />
          </div>

          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
              {error}
            </div>
          )}

          {/* Actions */}
          {isPromptPay ? (
            <div className="flex flex-col gap-3">
              {/* Mock QR */}
              <div className="flex flex-col items-center gap-3 py-4 border border-border rounded-lg">
                <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? "bg-gray-900" : "bg-white"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-body text-center">
                  สแกน QR Code เพื่อชำระ ฿{order.total?.toLocaleString()}
                </p>
              </div>
              <Button onClick={() => router.push("/upload-slip")} className="w-full" size="lg">
                <Package className="w-4 h-4" />
                อัปโหลดสลิปการโอน
              </Button>
            </div>
          ) : (
            <Button onClick={handleCreditCardPay} loading={paying} className="w-full" size="lg">
              <CreditCard className="w-4 h-4" />
              ชำระเงินด้วยบัตรเครดิต
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
