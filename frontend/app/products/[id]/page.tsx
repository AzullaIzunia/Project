"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { getProductImage } from "@/lib/product-media"

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
    return <main style={pageStyle}><section style={cardStyle}>กำลังโหลดข้อมูลสินค้า...</section></main>
  }

  return (
    <main style={pageStyle}>
      <section style={{ ...cardStyle, maxWidth: 760, margin: "0 auto" }}>
        <Link href="/products" style={linkStyle}>← กลับไปหน้าสินค้า</Link>
        {error ? <p style={errorStyle}>{error}</p> : null}
        {notice ? <p style={noticeStyle}>{notice}</p> : null}
        {product ? (
          <>
            <p style={eyebrowStyle}>PRODUCT DETAIL</p>
            <h1 style={{ margin: "8px 0 12px", fontSize: 40 }}>{product.product_name}</h1>
            <img
              src={getProductImage(product)}
              alt={product.product_name}
              style={{
                width: "100%",
                height: 340,
                objectFit: "cover",
                borderRadius: 20,
                border: "1px solid #ead7c8",
                marginBottom: 18
              }}
            />
            <div style={metaStyle}>{product.category} • {product.price} THB • stock {product.stock_quantity}</div>
            {product.description ? <p style={copyStyle}>{product.description}</p> : null}
            <div style={{ marginTop: 18 }}>
              <div style={miniLabelStyle}>Main stats</div>
              <div style={chipWrapStyle}>
                {product.main_stat.map((stat: string) => (
                  <span key={stat} style={chipStyle}>{stat}</span>
                ))}
              </div>
            </div>
            <div style={actionRowStyle}>
              <button type="button" onClick={handleAddToCart} style={buttonStyle}>Add to Cart</button>
              <Link href="/cart" style={secondaryLinkStyle}>Go to Cart</Link>
            </div>
          </>
        ) : null}
      </section>
    </main>
  )
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px 60px",
  background: "linear-gradient(180deg, #f7efe6 0%, #efdfd2 100%)",
  fontFamily: "Georgia, serif",
  color: "#2a1f18"
} as const
const cardStyle = {
  background: "rgba(255,255,255,0.84)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)"
} as const
const linkStyle = { color: "#7b5234", textDecoration: "none" } as const
const eyebrowStyle = { margin: "12px 0 0", fontSize: 12, letterSpacing: "0.16em", color: "#9b7458" } as const
const metaStyle = { color: "#6e5848", fontSize: 15 } as const
const copyStyle = { color: "#4d3a2e", lineHeight: 1.8, marginTop: 18 } as const
const miniLabelStyle = { color: "#8b705d", fontSize: 12, letterSpacing: "0.06em" } as const
const chipWrapStyle = { display: "flex", gap: 8, flexWrap: "wrap" as const, marginTop: 10 } as const
const chipStyle = { padding: "8px 12px", borderRadius: 999, background: "#f1e3d8", color: "#684d3b", fontSize: 13 } as const
const actionRowStyle = { display: "flex", gap: 10, flexWrap: "wrap" as const, marginTop: 22 } as const
const buttonStyle = { border: "none", borderRadius: 999, padding: "12px 18px", background: "#7c5234", color: "#fffaf6", cursor: "pointer", fontSize: 14 } as const
const secondaryLinkStyle = { display: "inline-block", textDecoration: "none", borderRadius: 999, padding: "12px 18px", background: "#fff8f2", border: "1px solid #dbc5b4", color: "#5f4738" } as const
const noticeStyle = { padding: "12px 16px", borderRadius: 14, background: "#edf7ef", color: "#146c2e", marginTop: 14 } as const
const errorStyle = { padding: "12px 16px", borderRadius: 14, background: "#fdeeee", color: "#b42318", marginTop: 14 } as const
