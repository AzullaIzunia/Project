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

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 md:pb-32 md:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_16%,rgba(212,176,98,0.18),transparent_35%)]" />
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-gold" />
              ดูดวงออนไลน์ที่แม่นยำที่สุด
            </div>
            <h1 className="mt-8 text-5xl font-semibold leading-tight text-foreground md:text-7xl">
              ค้นพบชะตากรรม
              <br />
              <span className="text-neutral-500">ที่รอคุณอยู่</span>
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
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-semibold text-foreground md:text-5xl">วิธีการใช้งาน</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              ขั้นตอนง่าย ๆ เพียง 3 ขั้นตอน เพื่อค้นพบดวงชะตาของคุณ
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.number} className="mystic-card p-8 md:p-10">
                <div className="text-6xl font-semibold text-[#eadfc9]">{feature.number}</div>
                <h3 className="mt-8 text-3xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-4 text-base leading-8 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#15120d] px-6 py-16 text-center md:px-12 md:py-20">
          <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            พร้อมที่จะค้นพบ
            <br />
            ชะตากรรมของคุณหรือยัง?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/60">
            เริ่มต้นการเดินทางสู่การรู้จักตัวเองอย่างลึกซึ้ง พร้อมรับคำแนะนำที่จะช่วยให้ชีวิตของคุณดีขึ้น
          </p>
          <div className="mt-10">
            <Link href="/draw">
              <Button variant="gold" size="lg">
                เริ่มดูดวงฟรี
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
