"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, Filter, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import ProtectedGate from "@/components/protected-gate"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { formatPrice, statLabel } from "@/lib/display"
import { isAdmin } from "@/lib/auth"
import { getProductImage } from "@/lib/product-media"

type Product = {
  product_id: number
  product_name: string
  category: string
  price: number
  stock_quantity: number
  main_stat: string[]
  isActive: boolean
  description?: string | null
  image_url?: string | null
}

type ProductResponse = {
  data: Product[]
}

const allowedStats = [
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
  "Charm",
]

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [showInactive, setShowInactive] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [query, setQuery] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(localStorage.getItem("token"))
  })
  const [hasAdminAccess] = useState(() => {
    if (typeof window === "undefined") return false
    return isAdmin()
  })
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    price: "",
    stock_quantity: "",
    main_stat: "",
    description: "",
  })
  const [editForm, setEditForm] = useState({
    product_name: "",
    category: "",
    price: "",
    stock_quantity: "",
    main_stat: "",
    description: "",
  })
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback

  const authToken = typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      if (showInactive) {
        const [activeRes, inactiveRes] = await Promise.all([
          fetch(apiUrl("/api/products?active=true&limit=100")),
          fetch(apiUrl("/api/products?active=false&limit=100")),
        ])

        const activePayload: ProductResponse = await activeRes.json()
        const inactivePayload: ProductResponse = await inactiveRes.json()

        const merged = [...(activePayload.data || []), ...(inactivePayload.data || [])]
        const dedup = Array.from(new Map(merged.map((item) => [item.product_id, item])).values())
        setProducts(dedup)
      } else {
        const res = await fetch(apiUrl("/api/products?active=true&limit=100"))
        const payload: ProductResponse = await res.json()
        setProducts(payload.data || [])
      }
    } catch {
      setError("โหลดรายการสินค้าไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }, [showInactive])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

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

  const toggleActive = async (product: Product) => {
    if (!authToken) return
    setUpdatingId(product.product_id)
    setError("")
    setNotice("")

    try {
      const res = await fetch(apiUrl(`/api/products/${product.product_id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ isActive: !product.isActive }),
      })

      if (!res.ok) {
        throw new Error("อัปเดตสถานะสินค้าไม่สำเร็จ")
      }

      setNotice(`อัปเดตสถานะสินค้า "${product.product_name}" เรียบร้อยแล้ว`)
      setProducts((current) =>
        current.map((item) =>
          item.product_id === product.product_id ? { ...item, isActive: !item.isActive } : item
        )
      )
    } catch (error: unknown) {
      setError(getErrorMessage(error, "อัปเดตสถานะสินค้าไม่สำเร็จ"))
    } finally {
      setUpdatingId(null)
    }
  }

  const updateStock = async (product: Product, stock: number) => {
    if (!authToken || stock < 0) return
    setUpdatingId(product.product_id)
    setError("")

    try {
      const res = await fetch(apiUrl(`/api/products/${product.product_id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ stock_quantity: stock }),
      })

      if (!res.ok) {
        throw new Error("อัปเดตสต็อกไม่สำเร็จ")
      }

      setProducts((current) =>
        current.map((item) =>
          item.product_id === product.product_id ? { ...item, stock_quantity: stock } : item
        )
      )
    } catch (error: unknown) {
      setError(getErrorMessage(error, "อัปเดตสต็อกไม่สำเร็จ"))
    } finally {
      setUpdatingId(null)
    }
  }

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authToken) return

    setError("")
    setNotice("")
    setSubmitting(true)

    const stats = form.main_stat
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)

    try {
      const res = await fetch(apiUrl("/api/products"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          product_name: form.product_name,
          category: form.category,
          price: Number(form.price),
          stock_quantity: Number(form.stock_quantity),
          description: form.description || undefined,
          main_stat: stats,
        }),
      })

      const payload = await res.json()
      if (!res.ok) {
        throw new Error(payload.error || "เพิ่มสินค้าไม่สำเร็จ")
      }

      setNotice(`เพิ่มสินค้า "${payload.product_name}" เรียบร้อยแล้ว`)
      setForm({
        product_name: "",
        category: "",
        price: "",
        stock_quantity: "",
        main_stat: "",
        description: "",
      })
      fetchProducts()
    } catch (error: unknown) {
      setError(getErrorMessage(error, "เพิ่มสินค้าไม่สำเร็จ"))
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (product: Product) => {
    setEditingId(product.product_id)
    setEditForm({
      product_name: product.product_name,
      category: product.category,
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      main_stat: product.main_stat.join(", "),
      description: product.description || "",
    })
    setError("")
    setNotice("")
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (productId: number) => {
    if (!authToken) return

    setUpdatingId(productId)
    setError("")
    setNotice("")

    try {
      const stats = editForm.main_stat
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)

      const res = await fetch(apiUrl(`/api/products/${productId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          product_name: editForm.product_name,
          category: editForm.category,
          price: Number(editForm.price),
          stock_quantity: Number(editForm.stock_quantity),
          main_stat: stats,
          description: editForm.description || null,
        }),
      })

      const payload = await res.json()
      if (!res.ok) {
        throw new Error(payload.error || "แก้ไขสินค้าไม่สำเร็จ")
      }

      setProducts((current) =>
        current.map((item) => (item.product_id === productId ? { ...item, ...payload } : item))
      )
      setNotice(`อัปเดตสินค้า "${payload.product_name}" เรียบร้อยแล้ว`)
      setEditingId(null)
    } catch (error: unknown) {
      setError(getErrorMessage(error, "แก้ไขสินค้าไม่สำเร็จ"))
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteProduct = async (product: Product) => {
    if (!authToken) return
    setUpdatingId(product.product_id)
    setError("")
    setNotice("")

    try {
      const res = await fetch(apiUrl(`/api/products/${product.product_id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const payload = await res.json()
      if (!res.ok) {
        throw new Error(payload.error || "ลบสินค้าไม่สำเร็จ")
      }

      setNotice(`ลบสินค้า "${product.product_name}" เรียบร้อยแล้ว`)
      if (showInactive) {
        setProducts((current) =>
          current.map((item) =>
            item.product_id === product.product_id ? { ...item, isActive: false } : item
          )
        )
      } else {
        setProducts((current) => current.filter((item) => item.product_id !== product.product_id))
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error, "ลบสินค้าไม่สำเร็จ"))
    } finally {
      setUpdatingId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <ProtectedGate
        redirectTo="/admin/products"
        description="กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินเพื่อจัดการข้อมูลสินค้า"
      />
    )
  }

  if (!hasAdminAccess) {
    return (
      <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
        <section className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-[#15121b] px-6 py-20 text-center shadow-[0_30px_80px_rgba(10,8,20,0.28)] sm:px-10">
            <h1 className="text-4xl font-semibold text-white md:text-5xl">สำหรับแอดมินเท่านั้น</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-white/60">
              หน้านี้เปิดให้ใช้งานเฉพาะบัญชีแอดมิน กรุณาเข้าสู่ระบบด้วยบัญชีที่ถูกต้อง
            </p>
            <div className="mt-10">
              <Button size="lg" onClick={() => router.push("/")}>
                กลับหน้าแรก
              </Button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.18em] text-gold">จัดการสินค้า</div>
            <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">Products Management</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              ค้นหา ปรับสต็อก ซ่อนหรือเปิดสินค้า และเพิ่มสินค้าใหม่จากหน้าเดียว
            </p>
          </div>
          <Button variant="ghost" onClick={fetchProducts} disabled={loading}>
            <Sparkles className="h-4 w-4" />
            รีเฟรชรายการ
          </Button>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        ) : null}

        <section className="mb-6 rounded-[1.75rem] border border-border bg-card/80 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Plus className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-semibold text-foreground">เพิ่มสินค้าใหม่</h2>
          </div>

          <form onSubmit={createProduct} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Input
                id="product-name"
                label="ชื่อสินค้า"
                value={form.product_name}
                onChange={(event) => setForm((current) => ({ ...current, product_name: event.target.value }))}
                placeholder="ชื่อสินค้า"
                required
              />
              <Input
                id="category"
                label="หมวดหมู่"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="หมวดหมู่"
                required
              />
              <Input
                id="price"
                label="ราคา"
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                placeholder="0"
                required
              />
              <Input
                id="stock"
                label="จำนวนสต็อก"
                type="number"
                min={0}
                value={form.stock_quantity}
                onChange={(event) => setForm((current) => ({ ...current, stock_quantity: event.target.value }))}
                placeholder="0"
                required
              />
            </div>

            <Input
              id="main-stat"
              label="พลังงานหลัก (คั่นด้วย ,)"
              value={form.main_stat}
              onChange={(event) => setForm((current) => ({ ...current, main_stat: event.target.value }))}
              placeholder="Protection, Wealth"
              required
            />
            <p className="text-xs text-muted-foreground">
              ตัวอย่างพลังที่รองรับ: {allowedStats.join(", ")}
            </p>

            <Textarea
              id="description"
              label="คำอธิบายสินค้า"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="รายละเอียดสินค้าเพิ่มเติม"
              rows={3}
            />

            <div>
              <Button type="submit" loading={submitting}>
                เพิ่มสินค้า
              </Button>
            </div>
          </form>
        </section>

        <section className="mb-6 rounded-[1.75rem] border border-border bg-card/80 p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">ค้นหาสินค้า</label>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  className="mystic-input w-full pl-10"
                  placeholder="ค้นหาจากชื่อสินค้า หมวดหมู่ หรือพลังงาน"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(event) => setShowInactive(event.target.checked)}
              />
              แสดงสินค้าที่ปิดการขายด้วย
            </label>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[2rem] border border-border bg-card/70 p-10 text-center text-muted-foreground">
            กำลังโหลดรายการสินค้า...
          </div>
        ) : (
          <section className="rounded-[2rem] border border-border bg-card/80 p-6">
            <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="สินค้าทั้งหมด" value={products.length} />
              <StatCard label="กำลังขาย" value={products.filter((item) => item.isActive).length} />
              <StatCard label="ปิดการขาย" value={products.filter((item) => !item.isActive).length} />
              <StatCard label="สต็อกต่ำ (<10)" value={products.filter((item) => item.stock_quantity < 10).length} />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-border bg-background/40 p-8 text-center text-muted-foreground">
                ไม่พบสินค้าที่ตรงกับเงื่อนไข
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <article
                    key={product.product_id}
                    className={`rounded-2xl border border-border bg-background/30 p-4 transition-opacity ${
                      product.isActive ? "opacity-100" : "opacity-65"
                    }`}
                  >
                    <div className="grid gap-4 lg:grid-cols-[120px_1fr_auto] lg:items-center">
                      <Image
                        src={getProductImage(product)}
                        alt={product.product_name}
                        width={96}
                        height={96}
                        unoptimized
                        className="h-24 w-24 rounded-xl border border-border object-cover"
                      />

                      <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{product.product_name}</h3>
                          {product.isActive ? (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 text-xs text-emerald-200">
                              กำลังขาย
                            </span>
                          ) : (
                            <span className="rounded-full border border-red-500/30 bg-red-500/12 px-2 py-0.5 text-xs text-red-200">
                              ปิดการขาย
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          หมวดหมู่: {product.category} · ราคา: {formatPrice(product.price)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {product.main_stat.map((stat) => (
                            <span
                              key={`${product.product_id}-${stat}`}
                              className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs text-[var(--gold-muted)]"
                            >
                              {statLabel(stat)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <div className="mr-1 flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1">
                          <button
                            type="button"
                            className="rounded-md px-2 py-1 text-sm text-foreground hover:bg-background/60"
                            disabled={updatingId === product.product_id || product.stock_quantity <= 0}
                            onClick={() => updateStock(product, product.stock_quantity - 1)}
                          >
                            -
                          </button>
                          <span className="min-w-12 text-center text-sm text-foreground">{product.stock_quantity}</span>
                          <button
                            type="button"
                            className="rounded-md px-2 py-1 text-sm text-foreground hover:bg-background/60"
                            disabled={updatingId === product.product_id}
                            onClick={() => updateStock(product, product.stock_quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          disabled={updatingId === product.product_id}
                          onClick={() => toggleActive(product)}
                        >
                          {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {product.isActive ? "ปิดการขาย" : "เปิดการขาย"}
                        </Button>
                        {editingId === product.product_id ? (
                          <>
                            <Button
                              disabled={updatingId === product.product_id}
                              onClick={() => saveEdit(product.product_id)}
                            >
                              บันทึก
                            </Button>
                            <Button variant="ghost" onClick={cancelEdit}>
                              ยกเลิก
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="secondary"
                            disabled={updatingId === product.product_id}
                            onClick={() => startEdit(product)}
                          >
                            แก้ไขสินค้า
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          disabled={updatingId === product.product_id}
                          onClick={() => deleteProduct(product)}
                        >
                          ลบสินค้า
                        </Button>
                      </div>
                    </div>

                    {editingId === product.product_id ? (
                      <div className="mt-4 rounded-xl border border-border bg-card/70 p-4">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <Input
                            id={`edit-name-${product.product_id}`}
                            label="ชื่อสินค้า"
                            value={editForm.product_name}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, product_name: event.target.value }))
                            }
                          />
                          <Input
                            id={`edit-category-${product.product_id}`}
                            label="หมวดหมู่"
                            value={editForm.category}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, category: event.target.value }))
                            }
                          />
                          <Input
                            id={`edit-price-${product.product_id}`}
                            label="ราคา"
                            type="number"
                            min={0}
                            value={editForm.price}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, price: event.target.value }))
                            }
                          />
                          <Input
                            id={`edit-stock-${product.product_id}`}
                            label="จำนวนสต็อก"
                            type="number"
                            min={0}
                            value={editForm.stock_quantity}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, stock_quantity: event.target.value }))
                            }
                          />
                        </div>
                        <div className="mt-4 grid gap-4">
                          <Input
                            id={`edit-stat-${product.product_id}`}
                            label="พลังงานหลัก (คั่นด้วย ,)"
                            value={editForm.main_stat}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, main_stat: event.target.value }))
                            }
                          />
                          <Textarea
                            id={`edit-desc-${product.product_id}`}
                            label="คำอธิบายสินค้า"
                            rows={3}
                            value={editForm.description}
                            onChange={(event) =>
                              setEditForm((current) => ({ ...current, description: event.target.value }))
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="text-xs tracking-[0.14em] text-gold">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  )
}
