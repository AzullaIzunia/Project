"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { formatPrice, statLabel } from "@/lib/display"
import { getProductImage } from "@/lib/product-media"

type DrawChoice = {
  stat: string
  value: number
}

type ChosenResult = {
  result_id: number
  stone: string
  result: string
}

type RecommendedProduct = {
  product_id: number
  product_name: string
  category: string
  price: number
  image_url?: string | null
  main_stat?: string[]
}

export default function ChoosePage() {
  const router = useRouter()
  const [data, setData] = useState<{ session_id: number; choices: DrawChoice[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedStat, setSelectedStat] = useState("")
  const [result, setResult] = useState<ChosenResult | null>(null)
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const storedDraw = localStorage.getItem("draw")
    if (!storedDraw) {
      router.push("/draw")
      return
    }
    setData(JSON.parse(storedDraw))
  }, [router])

  const chooseCard = async (stat: string) => {
    const token = localStorage.getItem("token")

    if (!token || !data) {
      router.push("/login")
      return
    }

    setLoading(true)
    setError("")
    setSelectedStat(stat)

    try {
      const res = await fetch(apiUrl("/api/fate/choose"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: data.session_id,
          chosen_stat: stat
        })
      })

      const chosen = await res.json()

      if (!res.ok) {
        throw new Error(chosen.error || "เลือกไพ่ไม่สำเร็จ")
      }

      setResult(chosen)
      localStorage.setItem("result", JSON.stringify(chosen))

      const recommendRes = await fetch(apiUrl(`/api/fate/recommend/${chosen.result_id}`), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const recommendData = await recommendRes.json()

      if (!recommendRes.ok) {
        throw new Error(recommendData.error || "โหลดสินค้าแนะนำไม่สำเร็จ")
      }

      setRecommendedProducts(recommendData.recommended_products || [])
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: RecommendedProduct) => {
    addToCart({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      category: product.category,
      quantity: 1
    })
    setNotice(`เพิ่ม ${product.product_name} ลงตะกร้าแล้ว`)
    setTimeout(() => setNotice(""), 1800)
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background star-bg flex items-center justify-center px-4">
        <div className="text-muted-foreground font-body">กำลังเตรียมไพ่ทาโรต์...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background star-bg">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="mystic-card p-6 sm:p-8 lg:p-10">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
              <div>
                <p className="text-xs tracking-[0.18em] text-gold font-body">เลือกไพ่ของคุณ</p>
                <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                  เลือกไพ่เพื่อเปิดคำทำนาย
                </h1>
                <p className="mt-4 text-muted-foreground font-body text-base sm:text-lg leading-8 max-w-2xl">
                  ไพ่ทั้งสามใบนี้สะท้อนพลังที่กำลังเคลื่อนไหวรอบตัวคุณในตอนนี้
                  เลือกใบที่ดึงดูดใจที่สุด แล้วเราจะเปิดคำทำนายพร้อมสินค้าแนะนำให้ในหน้าเดียว
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="mystic-badge bg-primary/10 text-accent border-primary/30">
                    3 ไพ่ 3 ทางเลือก
                  </span>
                  <span className="mystic-badge bg-gold/10 text-gold border-gold/30">
                    อ่านผลทันที
                  </span>
                  <span className="mystic-badge bg-secondary text-secondary-foreground border-border">
                    เพิ่มสินค้าเข้าตะกร้าได้เลย
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {data.choices.map((choice, index) => (
                  <div
                    key={`preview-${choice.stat}`}
                    className="rounded-2xl border border-border bg-secondary/25 p-3 text-center"
                  >
                    <div className="text-[10px] tracking-[0.16em] text-gold font-body">
                      ไพ่ใบที่ {index + 1}
                    </div>
                    <div className="mt-6 mb-6 text-3xl text-accent">✦</div>
                    <div className="text-sm font-serif text-foreground">{statLabel(choice.stat)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="max-w-5xl mx-auto mt-6 px-4 py-3 rounded-xl bg-red-500/12 border border-red-500/30 text-red-200 text-sm font-body">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="max-w-5xl mx-auto mt-6 px-4 py-3 rounded-xl bg-emerald-500/12 border border-emerald-500/30 text-emerald-200 text-sm font-body">
            {notice}
          </div>
        ) : null}

        <section className="max-w-6xl mx-auto mt-10">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <div>
              <div className="text-xs tracking-[0.18em] text-gold font-body">ไพ่ที่ปรากฏต่อหน้า</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-foreground">
                ไพ่ที่เปิดอยู่ตรงหน้าคุณ
              </h2>
            </div>
            <Link
              href="/draw"
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border font-body no-underline"
            >
              กลับไปตอบคำถามใหม่
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.choices.map((choice, index) => {
              const isActive = selectedStat === choice.stat

              return (
                <button
                  key={choice.stat}
                  type="button"
                  onClick={() => chooseCard(choice.stat)}
                  disabled={loading || Boolean(result)}
                  className={`mystic-card p-4 sm:p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-gold/50 shadow-[0_14px_30px_rgba(202,162,77,0.18)] -translate-y-1"
                      : "hover:border-black/20 hover:-translate-y-1"
                  } ${result ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div className="rounded-[22px] border border-border bg-gradient-to-b from-secondary/35 to-background/30 p-4 h-full min-h-[380px] flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="mystic-badge bg-gold/10 text-gold border-gold/30">
                        ไพ่ {index + 1}
                      </span>
                      <span className="text-accent text-xl">✦</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-[#f5ecda] border border-[#ecd9ad] flex items-center justify-center text-accent text-2xl">
                        ✦
                      </div>
                      <div className="mt-8 text-2xl font-serif font-semibold text-foreground">
                        {statLabel(choice.stat)}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground font-body max-w-[14rem] leading-6">
                        ไพ่ใบนี้สะท้อนพลังระดับ {choice.value} และพร้อมเปิดเผยเส้นทางที่ต่างออกไปให้คุณ
                      </p>
                    </div>

                    <div className="rounded-xl bg-background/40 border border-border px-3 py-3 text-xs text-muted-foreground font-body text-center">
                      {result ? (isActive ? "ไพ่ที่คุณเลือก" : "ไพ่ใบนี้ไม่ได้ถูกเลือก") : "กดเพื่อเปิดคำทำนาย"}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-14">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground font-body">กำลังเปิดคำทำนาย...</p>
          </div>
        ) : null}

        {result ? (
          <section className="max-w-6xl mx-auto mt-12 grid xl:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
            <div className="xl:sticky xl:top-24">
              <div className="mystic-card p-6 sm:p-7">
                <div className="text-xs tracking-[0.18em] text-gold font-body">ผลการเปิดไพ่ของคุณ</div>
                <div className="mt-4 rounded-2xl border border-border bg-secondary/30 p-5">
                  <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-2xl">
                    ✦
                  </div>
                  <h2 className="mt-5 text-3xl font-serif font-bold text-foreground">{result.stone}</h2>
                  <p className="mt-2 text-sm text-accent font-body">พลังที่เลือก: {statLabel(selectedStat)}</p>
                  <p className="mt-5 text-muted-foreground font-body leading-8">{result.result}</p>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Link href={`/recommend/${result.result_id}`}>
                    <Button>
                      เปิดหน้าสินค้าเพิ่มเติม
                    </Button>
                  </Link>
                  <Link href="/draw" className="no-underline">
                    <Button variant="ghost">ดูดวงใหม่</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mystic-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs tracking-[0.18em] text-gold font-body">สินค้าแนะนำจากคำทำนาย</div>
                  <h2 className="mt-2 text-3xl font-serif font-bold text-foreground">สินค้าแนะนำ</h2>
                  <p className="mt-2 text-sm text-muted-foreground font-body">
                    สินค้าเหล่านี้คัดจากพลังของไพ่ที่คุณเลือก สามารถเปิดดูรายละเอียดหรือหยิบใส่ตะกร้าได้ทันที
                  </p>
                </div>
                <Link href="/shop" className="text-sm text-[var(--gold-muted)] no-underline font-body">
                  ไปหน้าร้านทั้งหมด
                </Link>
              </div>

              {recommendedProducts.length === 0 ? (
                <p className="mt-6 text-muted-foreground font-body">ยังไม่มีสินค้าแนะนำสำหรับผลลัพธ์นี้</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {recommendedProducts.map((product) => (
                    <article
                      key={product.product_id}
                      className="rounded-2xl border border-border bg-background/45 p-4 flex flex-col"
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.product_name}
                        className="w-full h-48 object-cover rounded-xl border border-border"
                      />
                      <h3 className="mt-4 text-xl font-serif font-semibold text-foreground">
                        {product.product_name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground font-body">
                        {product.category} • {formatPrice(product.price)}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link href={`/products/${product.product_id}`} className="no-underline">
                          <Button className="text-sm">ดูหน้าสินค้า</Button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border font-body text-sm"
                        >
                          ใส่ตะกร้า
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {recommendedProducts.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-4">
                  <p className="text-sm text-muted-foreground font-body leading-7">
                    ถ้าต้องการดูหน้าแนะนำแบบเต็มพร้อมปุ่มซื้อผ่านบัตรหรือ PromptPay
                    สามารถเปิดต่อได้จากปุ่ม "เปิดหน้าสินค้าเพิ่มเติม"
                  </p>
                </div>
              ) : null}

              <div className="mt-6 pt-5 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  ย้อนกลับ
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  )
}
