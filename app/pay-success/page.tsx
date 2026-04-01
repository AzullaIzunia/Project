import Navbar from "@/components/navbar";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaySuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background star-bg">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-green-900/30 border-2 border-green-700/50 flex items-center justify-center mx-auto mb-6 animate-float">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            ชำระเงินสำเร็จ!
          </h1>
          <p className="text-muted-foreground font-body mb-2">
            จักรวาลได้รับพลังงานของคุณแล้ว
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            ของมูจะถูกเตรียมและส่งให้คุณโดยเร็ว
          </p>
          <div className="mystic-card p-6 mb-6">
            <p className="text-gold font-serif italic">
              &ldquo;พลังงานดีๆ กำลังเดินทางมาหาคุณ ✦&rdquo;
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/orders"
              className="glow-btn px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium font-body text-sm border border-primary/50 hover:bg-primary/90 transition-all"
            >
              ดูคำสั่งซื้อ
            </Link>
            <Link
              href="/shop"
              className="glow-btn px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium font-body text-sm border border-border hover:bg-secondary/80 transition-all"
            >
              ช้อปต่อ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
