"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { authHeaders } from "@/lib/auth";
import { Package, ChevronRight } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items_count?: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders/my", {
      headers: authHeaders() as Record<string, string>,
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setError(data.message || "โหลดคำสั่งซื้อไม่สำเร็จ");
      })
      .catch(() => setError("โหลดคำสั่งซื้อไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">คำสั่งซื้อของฉัน</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">ติดตามการจัดส่งของมูของคุณ</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-300 font-body mb-4">{error}</p>
            <Button onClick={() => router.push("/login")}>เข้าสู่ระบบ</Button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-body mb-4">ยังไม่มีคำสั่งซื้อ</p>
            <Button onClick={() => router.push("/shop")}>เลือกซื้อของมู</Button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="mystic-card p-5 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground text-sm">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      {new Date(order.created_at).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <div className="text-right">
                    <p className="text-gold font-body font-semibold text-sm">
                      ฿{order.total?.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      {order.payment_method === "promptpay" ? "PromptPay" : "Credit Card"}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Actions for pending */}
              {order.status === "pending" && (
                <div className="mt-3 pt-3 border-t border-border flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem("pending_order_id", order.id);
                      router.push("/payment");
                    }}
                  >
                    ชำระเงิน
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch(`/api/orders/${order.id}/cancel`, {
                        method: "POST",
                        headers: authHeaders() as Record<string, string>,
                      });
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === order.id ? { ...o, status: "cancelled" } : o
                        )
                      );
                    }}
                  >
                    ยกเลิก
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
