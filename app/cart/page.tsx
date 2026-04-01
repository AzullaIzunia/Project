"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getCart, updateQty, removeFromCart, CartItem } from "@/lib/cart";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { authHeaders } from "@/lib/auth";

type PayMethod = "promptpay" | "credit_card";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>("promptpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const refresh = () => {
    setItems(getCart());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQty = (id: string, qty: number) => {
    updateQty(id, qty);
    refresh();
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    refresh();
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
          payment_method: payMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "สร้างออเดอร์ไม่สำเร็จ");
      localStorage.setItem("pending_order_id", data.order_id);
      router.push("/confirm");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-accent" />
          ตะกร้าสินค้า
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-body mb-4">ตะกร้าของคุณว่างเปล่า</p>
            <Button onClick={() => router.push("/shop")}>ไปดูของมู</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="mystic-card p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted/30 relative overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl text-muted-foreground/30">◈</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-semibold text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-gold font-body text-sm">฿{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden flex-shrink-0">
                    <button onClick={() => handleQty(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-body text-foreground">{item.quantity}</span>
                    <button onClick={() => handleQty(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-body font-semibold text-foreground text-sm w-20 text-right flex-shrink-0">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button onClick={() => handleRemove(item.id)} className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mystic-card p-5 h-fit flex flex-col gap-4">
              <h2 className="font-serif font-semibold text-foreground">สรุปคำสั่งซื้อ</h2>

              <div className="flex flex-col gap-2 text-sm font-body">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate mr-2">{i.name} ×{i.quantity}</span>
                    <span>฿{(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 flex justify-between font-body font-semibold text-foreground">
                <span>ยอดรวม</span>
                <span className="text-gold">฿{total.toLocaleString()}</span>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">วิธีชำระเงิน</p>
                <div className="flex flex-col gap-2">
                  {(["promptpay", "credit_card"] as PayMethod[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-body transition-colors",
                        payMethod === m
                          ? "bg-primary/20 border-primary text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full border-2 flex-shrink-0", payMethod === m ? "border-accent bg-accent/40" : "border-muted-foreground")} />
                      {m === "promptpay" ? "PromptPay (QR Code)" : "Credit Card"}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-xs font-body">
                  {error}
                </div>
              )}

              <Button onClick={handleCheckout} loading={loading} className="w-full" size="lg">
                ดำเนินการชำระเงิน
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
