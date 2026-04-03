import Link from "next/link"
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    number: "01",
    title: "เลือกคำถาม",
    description: "ตอบคำถาม 3 ข้อเพื่อให้เราเข้าใจตัวตนและความต้องการของคุณ",
  },
  {
    number: "02",
    title: "จับไพ่ดวง",
    description: "เลือกไพ่ที่ดึงดูดใจคุณมากที่สุดเพื่อเปิดเผยคำทำนาย",
  },
  {
    number: "03",
    title: "รับผลดวง",
    description: "ค้นพบคำทำนายพร้อมสินค้าที่เหมาะสมกับดวงของคุณ",
  },
]

const highlights = [
  { label: "การเปิดดวงแบบอินเทอร์แอคทีฟ", value: "3 ขั้นตอน" },
  { label: "สินค้าแนะนำ", value: "ร้านค้าที่คัดให้" },
  { label: "การติดตามคำสั่งซื้อ", value: "ผู้ใช้ + แอดมิน" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 md:pb-32 md:pt-28" data-reveal>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_14%,rgba(212,176,98,0.18),transparent_34%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(139,92,246,0.16),transparent_30%)]" />
        <div className="absolute left-10 top-24 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-36 w-36 rounded-full bg-gold/10 blur-3xl" />
        <div className="mx-auto max-w-7xl text-center relative">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/90 px-4 py-2 text-sm text-foreground shadow-[0_8px_30px_rgba(6,5,16,0.28)]">
              <Sparkles className="h-4 w-4 text-gold" />
              ดูดวงออนไลน์ที่แม่นยำที่สุด
            </div>
            <h1 className="mt-8 text-5xl font-semibold leading-tight text-foreground md:text-7xl">
              ค้นพบชะตากรรม
              <br />
              <span className="bg-gradient-to-r from-white via-white to-white/45 bg-clip-text text-transparent">
                ที่รอคุณอยู่
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-muted-foreground">
              เปิดประตูสู่อนาคตด้วยการดูดวงแบบ Interactive พร้อมรับคำแนะนำ
              หินมงคลและสินค้าที่เหมาะกับดวงชะตาของคุณ
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/draw">
                <Button size="lg" className="min-w-44 justify-center">
                  เริ่มดูดวงเลย
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="ghost" className="min-w-44 justify-center">
                  <ShoppingBag className="h-4 w-4" />
                  เลือกซื้อสินค้า
                </Button>
              </Link>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-[1.6rem] border border-white/10 bg-card/80 px-5 py-6 shadow-[0_20px_60px_rgba(5,4,14,0.28)] backdrop-blur"
                  data-reveal
                >
                  <p className="text-xs tracking-[0.18em] text-gold/90">{highlight.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{highlight.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28" data-reveal>
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-semibold text-foreground md:text-5xl">วิธีการใช้งาน</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              ขั้นตอนง่าย ๆ เพียง 3 ขั้นตอน เพื่อค้นพบดวงชะตาของคุณ
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-[1.8rem] border border-white/10 bg-card/80 p-8 shadow-[0_20px_60px_rgba(5,4,14,0.24)] backdrop-blur md:p-10"
                data-reveal
              >
                <div className="text-6xl font-semibold text-gold/35">{feature.number}</div>
                <h3 className="mt-8 text-3xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-4 text-base leading-8 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-28" data-reveal>
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1a1627] via-[#11111a] to-[#17121c] px-6 py-16 text-center shadow-[0_25px_80px_rgba(4,3,12,0.32)] md:px-12 md:py-20">
          <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            พร้อมที่จะค้นพบ
            <br />
            ชะตากรรมของคุณหรือยัง?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/60">
            เริ่มต้นการเดินทางสู่การรู้จักตัวเองอย่างลึกซึ้ง พร้อมรับคำแนะนำที่จะช่วยให้ชีวิตของคุณดีขึ้น
          </p>
          <div className="mt-10">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/draw">
                <Button variant="gold" size="lg">
                  เริ่มดูดวงฟรี
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="border-white/10 bg-white/5 text-white hover:bg-white hover:text-black">
                  ดูวิธีการใช้งาน
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
