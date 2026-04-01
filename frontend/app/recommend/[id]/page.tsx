"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"

type RecommendedProduct = {
  product_id: number
  product_name: string
  category: string
  price: number
  image_url?: string | null
  main_stat?: string[]
}

export default function RecommendPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [products, setProducts] = useState<RecommendedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      try {
        const res = await fetch(apiUrl(`/api/fate/recommend/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "โหลดสินค้าแนะนำไม่สำเร็จ")
        }

        setProducts(result.recommended_products || [])
      } catch (err: any) {
        setError(err.message || "โหลดสินค้าแนะนำไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  const createOrder = async (
    productId: number,
    paymentMethod: "credit_card" | "promptpay"
  ) => {
    const token = localStorage.getItem("token")

    const res = await fetch(apiUrl("/api/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_method: paymentMethod,
        items: [{ product_id: productId, quantity: 1 }],
      }),
    })

    return res.json()
  }

  const goToPayment = (orderId: number) => {
    localStorage.setItem("pending_order_id", String(orderId))
    router.push("/payment")
  }

  const handleBuy = async (
    productId: number,
    paymentMethod: "credit_card" | "promptpay"
  ) => {
    setError("")
    const order = await createOrder(productId, paymentMethod)

    if (!order?.order_id) {
      setError(order?.error || "สร้างออเดอร์ไม่สำเร็จ")
      return
    }

    goToPayment(order.order_id)
  }

  const handleAddToCart = (product: RecommendedProduct) => {
    addToCart({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      category: product.category,
      quantity: 1,
    })
    setNotice(`เพิ่ม ${product.product_name} ลงตะกร้าแล้ว`)
    setTimeout(() => setNotice(""), 1800)
  }

  return (
    <main className="min-h-screen bg-background star-bg">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mystic-card p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="text-xs tracking-[0.18em] text-gold font-body">
                  RECOMMENDED FOR YOUR READING
                </div>
                <h1 className="mt-3 text-4xl font-serif font-bold text-foreground sm:text-5xl">
                  สินค้าที่เหมาะกับคำทำนายของคุณ
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground font-body">
                  หน้านี้รวบรวมสินค้าแนะนำจากผลดูดวงโดยตรง คุณสามารถดูรายละเอียดสินค้า
                  หยิบใส่ตะกร้า หรือสร้างออเดอร์เพื่อไปจ่ายเงินต่อได้ทันที
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/shop">
                    <Button variant="gold">ดูร้านทั้งหมด</Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="ghost">
                      <ShoppingBag className="h-4 w-4" />
                      เปิดตะกร้า
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-secondary/25 p-4">
                  <div className="text-xs tracking-[0.16em] text-gold">FAST ACTION</div>
                  <div className="mt-3 text-lg font-semibold text-foreground">Buy Now</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    ซื้อด้วยบัตรหรือ PromptPay แล้วไปต่อหน้า payment ได้ทันที
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/25 p-4">
                  <div className="text-xs tracking-[0.16em] text-gold">SAVE FOR LATER</div>
                  <div className="mt-3 text-lg font-semibold text-foreground">Add to Cart</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    เพิ่มสินค้าเก็บไว้ในตะกร้าแล้วค่อย checkout ทีเดียวก็ได้
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-800/50 bg-red-900/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="mt-6 rounded-xl border border-green-800/50 bg-green-900/30 px-4 py-3 text-sm text-green-300">
              {notice}
            </div>
          ) : null}

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground font-body">กำลังโหลดสินค้าแนะนำ...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-border bg-card/70 p-10 text-center">
              <p className="text-muted-foreground font-body">ยังไม่มีสินค้าแนะนำสำหรับผลลัพธ์นี้</p>
            </div>
          ) : (
            <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.product_id}
                  className="mystic-card overflow-hidden p-4 sm:p-5"
                >
                  <img
                    src={getProductImage(product)}
                    alt={product.product_name}
                    className="h-56 w-full rounded-2xl border border-border object-cover"
                  />
                  <div className="mt-5">
                    <div className="text-xs tracking-[0.16em] text-gold">{product.category}</div>
                    <h2 className="mt-2 text-2xl font-serif font-semibold text-foreground">
                      {product.product_name}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground font-body">
                      {product.price} THB
                    </p>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <Link href={`/products/${product.product_id}`}>
                      <Button className="w-full justify-center">ดูหน้าสินค้า</Button>
                    </Link>
                    <Button
                      variant="gold"
                      className="w-full justify-center"
                      onClick={() => handleBuy(product.product_id, "credit_card")}
                    >
                      ซื้อด้วยบัตร
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => handleBuy(product.product_id, "promptpay")}
                    >
                      ซื้อด้วย PromptPay
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-center"
                      onClick={() => handleAddToCart(product)}
                    >
                      ใส่ตะกร้า
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </section>
    </main>
  )
}
