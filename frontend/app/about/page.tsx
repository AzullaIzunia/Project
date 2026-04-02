import Link from "next/link"
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    number: "01",
    title: "ตอบคำถามเบื้องต้น",
    description:
      "เริ่มต้นด้วยคำถาม 3 ข้อ เพื่อให้ระบบเข้าใจพลังงาน ความกังวล และสิ่งที่คุณอยากได้รับคำแนะนำในช่วงเวลานี้",
  },
  {
    number: "02",
    title: "เลือกไพ่ที่ดึงดูดใจ",
    description:
      "หลังจากเปิดทางเลือก ระบบจะเผยไพ่ 3 ใบซึ่งสะท้อนเส้นทางที่ต่างกัน คุณเลือกใบที่รู้สึกเชื่อมโยงมากที่สุด",
  },
  {
    number: "03",
    title: "รับคำทำนายและหินมงคล",
    description:
      "ผลลัพธ์จะสรุปพลังหลักของคุณ พร้อมคำแนะนำหินมงคลและข้อความตีความที่อ่านต่อได้ทันที",
  },
  {
    number: "04",
    title: "ดูสินค้าแนะนำ",
    description:
      "ระบบจะคัดสินค้าที่สัมพันธ์กับผลดวงของคุณ ไม่ว่าจะเป็นหิน เสริมพลัง เครื่องประดับ หรือไอเท็มเฉพาะทาง",
  },
  {
    number: "05",
    title: "สั่งซื้อและติดตามออเดอร์",
    description:
      "เพิ่มสินค้าลงตะกร้า ชำระผ่านบัตรหรือ PromptPay แล้วกลับมาดูสถานะคำสั่งซื้อและประวัติดวงย้อนหลังได้",
  },
]

const energies = [
  { name: "การปกป้อง", stone: "แบล็กทัวร์มาลีน", description: "เสริมพลังปกป้อง ลดพลังลบ และสร้างเกราะให้ใจมั่นคง" },
  { name: "ความบริสุทธิ์", stone: "เคลียร์ควอตซ์", description: "ช่วยให้จิตใจปลอดโปร่ง มองทุกอย่างชัดขึ้น และตัดสินใจได้ดี" },
  { name: "การเยียวยา", stone: "กรีนอเวนเจอรีน", description: "เหมาะกับช่วงที่ต้องฟื้นฟูพลังใจ ร่างกาย หรือเริ่มต้นใหม่" },
  { name: "ความมั่งคั่ง", stone: "ซิทริน", description: "หนุนเรื่องโชคลาภ การเงิน โอกาสใหม่ และความมั่นใจในการลงมือทำ" },
  { name: "ความคิดสร้างสรรค์", stone: "คาร์เนเลียน", description: "จุดไฟให้ไอเดียและความกล้า เหมาะกับงานสร้างสรรค์และการเริ่มสิ่งใหม่" },
  { name: "ความอ่อนโยน", stone: "โรสควอตซ์", description: "เชื่อมพลังแห่งความรัก ความอ่อนโยน และความสัมพันธ์ที่อบอุ่น" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="px-4 pb-20 pt-20 sm:px-6 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm text-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-gold" />
            วิธีการใช้งานระบบดูดวงและร้านค้า
          </div>
          <h1 className="mt-8 text-4xl font-semibold leading-tight text-foreground md:text-6xl">
            เส้นทางตั้งแต่เปิดไพ่
            <br />
            <span className="text-neutral-500">ไปจนถึงสินค้าที่เหมาะกับคุณ</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-muted-foreground">
            หน้านี้สรุป flow หลักของระบบทั้งหมด ตั้งแต่เริ่มดูดวง เลือกไพ่ อ่านผล
            ไปจนถึงซื้อสินค้าและติดตามคำสั่งซื้อ เพื่อให้ใช้งานหรือพรีเซนต์ระบบได้ง่ายขึ้น
          </p>
        </div>
      </section>

      <section className="bg-card/35 px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-semibold text-foreground md:text-5xl">ระบบทำงานอย่างไร</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ขั้นตอนหลัก 5 ส่วนที่เชื่อมการดูดวงเข้ากับการเลือกซื้อสินค้าใน flow เดียว
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid items-center gap-6 rounded-[2rem] border border-border bg-card/80 p-6 shadow-[0_18px_48px_rgba(4,3,12,0.22)] md:grid-cols-[120px_1fr] md:p-8 ${
                  index % 2 === 1 ? "md:translate-x-6" : ""
                }`}
              >
                <div className="text-center md:text-left">
                  <div className="text-6xl font-semibold text-[#eadfc9]">{step.number}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-4xl font-semibold text-foreground md:text-5xl">พลังที่ระบบตีความให้คุณ</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ตัวอย่างพลังงานและหินมงคลที่อาจปรากฏในผลลัพธ์ของคุณ
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {energies.map((energy) => (
              <article key={energy.name} className="mystic-card p-6">
                <p className="text-xs tracking-[0.18em] text-gold">พลังงานหลัก</p>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">{energy.name}</h3>
                <p className="mt-2 text-sm font-medium text-[var(--gold-muted)]">{energy.stone}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{energy.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#15120d] px-6 py-16 text-center md:px-12 md:py-20">
          <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            พร้อมเริ่มดูดวง
            <br />
            และเลือกสินค้าที่ใช่หรือยัง?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/60">
            เริ่มจากการตอบคำถาม เปิดไพ่ และดูสินค้าที่คัดมาให้ตรงกับผลลัพธ์ของคุณได้เลย
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/draw">
              <Button variant="gold" size="lg">
                เริ่มดูดวง
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="ghost">
                <ShoppingBag className="h-4 w-4" />
                ไปหน้าร้านค้า
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
