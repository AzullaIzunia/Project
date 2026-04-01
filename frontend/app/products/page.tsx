"use client"

import { useEffect, useState } from "react"
import ProductCard from "@/components/product-card"
import { apiUrl } from "@/lib/api"
import { Input } from "@/components/ui/input"

type Product = {
  product_id: number
  product_name: string
  category: string
  price: number
  main_stat?: string[]
  image_url?: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(apiUrl("/api/products"))
      .then((res) => res.json())
      .then((payload) => setProducts(payload.data || []))
      .catch(() => setError("โหลดสินค้าไม่สำเร็จ"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((product) =>
    product.product_name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="text-xs tracking-[0.18em] text-gold">SHOP</div>
          <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">ร้านค้าของ Florder</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            ดูสินค้ามงคล สินค้าที่แนะนำจากผลดูดวง หรือเลือกเพิ่มลงตะกร้าเพื่อไป checkout ต่อได้ทันที
          </p>
        </div>

        <div className="mb-8 max-w-md">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
          />
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-border bg-card/60 p-10 text-center text-muted-foreground">
            กำลังโหลดสินค้า...
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
