"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`))
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "โหลดข้อมูลสินค้าไม่สำเร็จ")
        }

        setProduct(data)
      } catch (err: any) {
        setError(err.message || "โหลดข้อมูลสินค้าไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      category: product.category,
      quantity: 1
    })
    setNotice("เพิ่มสินค้าลงตะกร้าแล้ว")
    setTimeout(() => setNotice(""), 1800)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <section className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
          กำลังโหลดข้อมูลสินค้า...
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8">
        <Link href="/shop" className="text-sm text-muted-foreground no-underline hover:text-foreground">
          ← กลับไปหน้าร้าน
        </Link>
        {error ? <p className="mt-4 rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">{error}</p> : null}
        {notice ? <p className="mt-4 rounded-xl border border-green-800/50 bg-green-900/20 px-4 py-3 text-sm text-green-300">{notice}</p> : null}
        {product ? (
          <>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <img
                src={getProductImage(product)}
                alt={product.product_name}
                className="h-full min-h-80 w-full rounded-[1.75rem] border border-border object-cover"
              />
              <div>
                <div className="text-xs tracking-[0.16em] text-gold">PRODUCT DETAIL</div>
                <h1 className="mt-3 text-4xl font-semibold text-foreground">{product.product_name}</h1>
                <div className="mt-4 text-base text-muted-foreground">
                  {product.category} • {product.price} THB • stock {product.stock_quantity}
                </div>
                {product.description ? (
                  <p className="mt-5 text-base leading-8 text-muted-foreground">{product.description}</p>
                ) : null}
                <div className="mt-6">
                  <div className="text-xs tracking-[0.16em] text-gold">MAIN STATS</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                {product.main_stat.map((stat: string) => (
                    <span
                      key={stat}
                      className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm text-gold"
                    >
                      {stat}
                    </span>
                ))}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={handleAddToCart}>ใส่ตะกร้า</Button>
                  <Link href="/cart">
                    <Button variant="gold">ไปที่ตะกร้า</Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  )
}
