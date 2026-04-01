import Navbar from "@/components/navbar";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, BookOpen } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "ดูดวงอย่างแม่นยำ",
    desc: "ตอบคำถามเพื่อให้จักรวาลเปิดเผยเส้นทางโชคชะตาของคุณ",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "คริสตัลและหินพลัง",
    desc: "เลือกสรรหินพลังงาน คริสตัล และของมูคุณภาพจากทั่วโลก",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "สินค้าแนะนำตามดวง",
    desc: "รับคำแนะนำสินค้ามูที่เหมาะกับดวงชะตาของคุณโดยเฉพาะ",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "ประวัติโชคชะตา",
    desc: "ย้อนดูผลดูดวงทุกครั้งและติดตามการเดินทางจิตวิญญาณ",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 px-4 sm:px-6 text-center star-bg">
          {/* Background glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center gap-6">
            {/* Decorative moon */}
            <div className="animate-float">
              <div className="w-20 h-20 rounded-full border-2 border-gold/40 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                <span className="text-3xl text-gold" aria-hidden="true">
                  ☽
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="mystic-badge self-center border-gold/40 text-gold-muted text-xs tracking-widest uppercase">
                ✦ โชคชะตาเรียกหาคุณ ✦
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-balance leading-tight">
                <span className="gold-text">ขายวิญญาณ</span>
                <br />
                <span className="text-foreground">รับพรจักรวาล</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body leading-relaxed">
                ดูดวงออนไลน์ เลือกสรรของมูพลังงานสูง และรับคำแนะนำจากจักรวาลที่ตรงกับโชคชะตาของคุณ
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/draw"
                className="glow-btn px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium font-body text-base border border-primary/50 hover:bg-primary/90 transition-all"
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                เริ่มดูดวง
              </Link>
              <Link
                href="/shop"
                className="glow-btn px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium font-body text-base border border-border hover:bg-secondary/80 transition-all"
              >
                <ShoppingBag className="w-4 h-4 inline mr-2" />
                ดูของมู
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-6 py-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-gold text-sm">✦</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-3">
              พลังแห่งจักรวาลในมือคุณ
            </h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">
              ทุกอย่างที่คุณต้องการเพื่อเชื่อมต่อกับพลังงานจักรวาล
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="mystic-card p-6 flex flex-col gap-3 hover:border-primary/60 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-accent">
                  {f.icon}
                </div>
                <h3 className="font-serif font-semibold text-foreground text-base">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto mystic-card p-10 text-center">
            <p className="text-gold text-sm tracking-widest uppercase mb-3 font-body">
              ✦ เริ่มต้นวันนี้ ✦
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4 text-balance">
              พร้อมรับฟังเสียงจักรวาลแล้วหรือยัง?
            </h2>
            <p className="text-muted-foreground font-body mb-6 max-w-md mx-auto">
              สมัครสมาชิกฟรีเพื่อดูดวงและรับคำแนะนำสินค้ามูที่ตรงกับดวงของคุณ
            </p>
            <Link
              href="/register"
              className="glow-btn inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-accent text-accent-foreground font-medium font-body text-base border border-accent/50 hover:bg-accent/90 transition-all"
            >
              สมัครสมาชิกฟรี
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent">✦</span>
            <span className="font-serif text-sm text-muted-foreground">
              SellYourSoul &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            ของมูคุณภาพ ดูดวงแม่นยำ พลังงานจักรวาลส่งตรงถึงคุณ
          </p>
        </div>
      </footer>
    </div>
  );
}
