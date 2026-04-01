import Navbar from "@/components/navbar";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PayFailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background star-bg">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-red-900/30 border-2 border-red-700/50 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            ชำระเงินไม่สำเร็จ
          </h1>
          <p className="text-muted-foreground font-body mb-2">
            พลังงานไม่ไหลผ่านในครั้งนี้
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            กรุณาลองใหม่อีกครั้งหรือเลือกวิธีชำระอื่น
          </p>
          <div className="mystic-card p-6 mb-6">
            <p className="text-muted-foreground font-body text-sm italic">
              &ldquo;ทุกอุปสรรคคือบทเรียน จักรวาลยังรออยู่เสมอ ✦&rdquo;
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/payment"
              className="glow-btn px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium font-body text-sm border border-primary/50 hover:bg-primary/90 transition-all"
            >
              ลองชำระอีกครั้ง
            </Link>
            <Link
              href="/orders"
              className="glow-btn px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium font-body text-sm border border-border hover:bg-secondary/80 transition-all"
            >
              ดูคำสั่งซื้อ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
