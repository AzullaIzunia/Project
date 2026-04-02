"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { formatPrice, statLabel } from "@/lib/display"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"

type Product = {
  product_id: number
  product_name: string
  category: string
  price: number
  stock_quantity: number
  description?: string | null
  image_url?: string | null
  main_stat: string[]
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
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

        const listRes = await fetch(apiUrl("/api/products?limit=100"))
        const listPayload = await listRes.json()
        const related =
          (listPayload.data || []).filter((item: Product) => {
            if (item.product_id === data.product_id) return false
            return item.main_stat?.some((stat) => data.main_stat?.includes(stat))
          }).slice(0, 4)

        setRelatedProducts(related)
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
        <section className="mx-auto max-w-7xl animate-pulse">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-[2rem] bg-muted" />
            <div className="space-y-4">
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="h-12 w-2/3 rounded bg-muted" />
              <div className="h-6 w-1/3 rounded bg-muted" />
              <div className="h-32 rounded bg-muted" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <section className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/shop" className="no-underline hover:text-foreground">
            ร้านค้า
          </Link>
          <span>/</span>
          <span className="text-foreground">{product?.product_name || "รายละเอียดสินค้า"}</span>
        </nav>

        {error ? <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">{error}</p> : null}
        {notice ? <p className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">{notice}</p> : null}
        {product ? (
          <>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card/80">
                <img
                  src={getProductImage(product)}
                  alt={product.product_name}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="mystic-card p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {product.main_stat.map((stat) => (
                    <span
                      key={stat}
                      className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm text-[var(--gold-muted)]"
                    >
                      {statLabel(stat)}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-xs tracking-[0.16em] text-gold">รายละเอียดสินค้า</div>
                <h1 className="mt-3 text-4xl font-semibold text-foreground">{product.product_name}</h1>
                <p className="mt-2 text-base text-muted-foreground">{product.category}</p>

                <div className="mt-6 text-3xl font-semibold text-foreground">{formatPrice(product.price)}</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {product.stock_quantity > 0 ? `มีสินค้า ${product.stock_quantity} ชิ้น` : "สินค้าหมดชั่วคราว"}
                </div>

                {product.description ? (
                  <p className="mt-6 text-base leading-8 text-muted-foreground">{product.description}</p>
                ) : null}

                <div className="mt-8">
                  <div className="text-xs tracking-[0.16em] text-gold">พลังงานที่สอดคล้อง</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.main_stat.map((stat: string) => (
                      <Link
                        key={stat}
                        href={`/shop?stat=${stat}`}
                        className="rounded-full border border-border bg-background/55 px-4 py-2 text-sm text-muted-foreground no-underline hover:text-foreground"
                      >
                        {statLabel(stat)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0}>
                    ใส่ตะกร้า
                  </Button>
                  <Link href="/cart">
                    <Button variant="gold">ไปที่ตะกร้า</Button>
                  </Link>
                  <Link href="/shop">
                    <Button variant="ghost">กลับไปร้านค้า</Button>
                  </Link>
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 ? (
              <section className="mt-16">
                <div className="mb-6">
                  <div className="text-xs tracking-[0.16em] text-gold">สินค้าใกล้เคียง</div>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">สินค้าใกล้เคียง</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {relatedProducts.map((related) => (
                    <article
                      key={related.product_id}
                      className="overflow-hidden rounded-[1.75rem] border border-border bg-card/80 shadow-[0_18px_48px_rgba(4,3,12,0.22)] transition-transform hover:-translate-y-1"
                    >
                      <Link href={`/products/${related.product_id}`} className="no-underline">
                        <img
                          src={getProductImage(related)}
                          alt={related.product_name}
                          className="aspect-square w-full object-cover"
                        />
                      </Link>
                      <div className="p-4">
                        <div className="text-xs tracking-[0.16em] text-gold">{related.category}</div>
                        <Link href={`/products/${related.product_id}`} className="no-underline">
                          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
                            {related.product_name}
                          </h3>
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">{formatPrice(related.price)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  )
}
