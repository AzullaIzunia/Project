"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { formatPrice, statLabel } from "@/lib/display"
import { getProductImage } from "@/lib/product-media"

type Product = {
  product_id: number
  product_name: string
  category: string
  price: number
  description?: string | null
  main_stat: string[]
  stock_quantity: number
  image_url?: string | null
}

type ProductResponse = {
  data: Product[]
  pagination?: {
    page: number
    totalPages: number
  }
}

const stats = [
  "Protection",
  "Purity",
  "Telluric",
  "Ethereality",
  "Omniscience",
  "Healing",
  "Wealth",
  "Abundance",
  "Intelligence",
  "Creativity",
  "Affection",
  "Passion",
]

const sortOptions = [
  { value: "newest", label: "ใหม่ล่าสุด" },
  { value: "oldest", label: "เก่าที่สุด" },
  { value: "price_asc", label: "ราคาน้อยไปมาก" },
  { value: "price_desc", label: "ราคามากไปน้อย" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedStat, setSelectedStat] = useState("")
  const [sort, setSort] = useState("newest")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stat = params.get("stat") || ""
    setSelectedStat(stat)
    setPage(1)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError("")

      try {
        const params = new URLSearchParams()
        if (selectedStat) params.set("stat", selectedStat)
        if (sort) params.set("sort", sort)
        params.set("page", String(page))
        params.set("limit", "12")

        const res = await fetch(apiUrl(`/api/products?${params.toString()}`))
        const payload: ProductResponse = await res.json()

        if (!res.ok) {
          throw new Error("โหลดสินค้าไม่สำเร็จ")
        }

        setProducts(payload.data || [])
        setTotalPages(payload.pagination?.totalPages || 1)
      } catch (error: unknown) {
        setError(getErrorMessage(error, "โหลดสินค้าไม่สำเร็จ"))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedStat, sort, page])

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return products
    return products.filter((product) => {
      return (
        product.product_name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.main_stat.some((stat) => stat.toLowerCase().includes(normalized))
      )
    })
  }, [products, query])

  const handleAddToCart = (product: Product) => {
    addToCart({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      category: product.category,
      quantity: 1,
    })
    setNotice(`เพิ่ม ${product.product_name} ลงตะกร้าแล้ว`)
    window.setTimeout(() => setNotice(""), 1800)
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="text-xs tracking-[0.18em] text-gold">ร้านค้าแนะนำ</div>
          <h1 className="mt-3 text-4xl font-semibold text-foreground md:text-5xl">เลือกสินค้าที่สอดคล้องกับพลังของคุณ</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
            ค้นหาสินค้ามงคล หินเสริมพลัง และไอเท็มที่คัดมาให้สอดคล้องกับผลดูดวงของคุณ
            จะมาจากหน้าร้านโดยตรงหรือจากคำแนะนำหลังเปิดไพ่ก็ไปต่อที่ตะกร้าได้ทันที
          </p>
        </div>

        {notice ? (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <div className="mystic-card p-5">
              <div className="text-xs tracking-[0.18em] text-gold">ค้นหาสินค้า</div>
              <div className="mt-4">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ค้นหาชื่อสินค้า หมวดหมู่ หรือพลังงาน"
                />
              </div>
            </div>

            <div className="mystic-card p-5">
              <div className="text-xs tracking-[0.18em] text-gold">เรียงลำดับ</div>
              <div className="mt-4 space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value)
                      setPage(1)
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      sort === option.value
                        ? "border-black bg-black text-white"
                        : "border-border bg-background/55 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mystic-card p-5">
              <div className="text-xs tracking-[0.18em] text-gold">ประเภทพลังงาน</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStat("")
                    setPage(1)
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selectedStat === ""
                      ? "border-black bg-black text-white"
                      : "border-border bg-background/55 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ทั้งหมด
                </button>
                {stats.map((stat) => (
                  <button
                    key={stat}
                    type="button"
                    onClick={() => {
                      setSelectedStat(stat)
                      setPage(1)
                    }}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      selectedStat === stat
                        ? "border-black bg-black text-white"
                        : "border-border bg-background/55 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {statLabel(stat)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="mystic-card overflow-hidden p-4 animate-pulse">
                    <div className="aspect-square rounded-[1.25rem] bg-muted" />
                    <div className="mt-4 h-5 w-2/3 rounded bg-muted" />
                    <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
                    <div className="mt-6 h-10 rounded-xl bg-muted" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="mystic-card p-12 text-center">
                <h2 className="text-2xl font-semibold text-foreground">ยังไม่พบสินค้าที่ตรงกับการค้นหา</h2>
                <p className="mt-3 text-muted-foreground">
                  ลองเปลี่ยนคำค้นหา หรือเลือกพลังงานประเภทอื่นเพื่อดูสินค้าเพิ่มเติม
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    แสดงสินค้า {filteredProducts.length} รายการ{selectedStat ? ` สำหรับ ${statLabel(selectedStat)}` : ""}
                  </p>
                  <Link href="/cart" className="text-sm text-[var(--gold-muted)] no-underline">
                    ไปที่ตะกร้า
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.product_id}
                      className="overflow-hidden rounded-[1.75rem] border border-border bg-card/80 shadow-[0_18px_48px_rgba(4,3,12,0.22)] transition-transform hover:-translate-y-1"
                    >
                      <Link href={`/products/${product.product_id}`} className="no-underline">
                        <Image
                          src={getProductImage(product)}
                          alt={product.product_name}
                          width={800}
                          height={800}
                          unoptimized
                          className="aspect-square w-full object-cover"
                        />
                      </Link>
                      <div className="p-5">
                        <div className="flex flex-wrap gap-2">
                          {product.main_stat.slice(0, 2).map((stat) => (
                            <span
                              key={stat}
                              className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-[var(--gold-muted)]"
                            >
                              {statLabel(stat)}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 text-xs tracking-[0.16em] text-gold">{product.category}</div>
                        <Link href={`/products/${product.product_id}`} className="no-underline">
                          <h2 className="mt-2 line-clamp-2 text-xl font-semibold text-foreground">
                            {product.product_name}
                          </h2>
                        </Link>
                        <div className="mt-2 text-base text-muted-foreground">{formatPrice(product.price)}</div>
                        <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">
                          {product.description || "สินค้าเสริมพลังที่คัดให้เหมาะกับการใช้งานและผลลัพธ์ดวงของคุณ"}
                        </p>

                        <div className="mt-5 flex gap-2">
                          <Link href={`/products/${product.product_id}`} className="flex-1">
                            <Button variant="ghost" className="w-full justify-center">
                              ดูสินค้า
                            </Button>
                          </Link>
                          <Button
                            className="flex-1 justify-center"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock_quantity === 0}
                          >
                            ใส่ตะกร้า
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      disabled={page === 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      ก่อนหน้า
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      หน้า {page} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      disabled={page === totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      ถัดไป
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
