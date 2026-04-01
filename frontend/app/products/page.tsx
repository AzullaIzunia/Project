"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { getProductImage } from "@/lib/product-media"

export default function Products() {
  const [data, setData] = useState<any[]>([])
  const [notice, setNotice] = useState("")

  useEffect(() => {
    fetch(apiUrl("/api/products"))
      .then(res => res.json())
      .then(result => setData(result.data ?? []))
  }, [])

  const handleAddToCart = (product: any) => {
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

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>PRODUCTS</p>
            <h1 style={{ margin: "8px 0 10px", fontSize: 38 }}>Shop the Collection</h1>
            <p style={copyStyle}>เลือกสินค้าแล้วเพิ่มลงตะกร้า หรือเปิดดูรายละเอียดก่อนตัดสินใจ</p>
          </div>
          <Link href="/cart" style={primaryLinkStyle}>Open Cart</Link>
        </div>

        {notice ? <p style={noticeStyle}>{notice}</p> : null}

        <section style={gridStyle}>
          {data.map(p => (
            <article key={p.product_id} style={cardStyle}>
              <div>
                <img
                  src={getProductImage(p)}
                  alt={p.product_name}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 18,
                    border: "1px solid #ead7c8",
                    marginBottom: 14
                  }}
                />
                <div style={titleStyle}>{p.product_name}</div>
                <div style={metaStyle}>{p.category}</div>
                <div style={{ ...metaStyle, marginTop: 8 }}>{p.price} THB</div>
              </div>

              <div style={actionRowStyle}>
                <Link href={`/products/${p.product_id}`} style={secondaryLinkStyle}>
                  View Detail
                </Link>
                <button type="button" onClick={() => handleAddToCart(p)} style={buttonStyle}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
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

const shellStyle = {
  maxWidth: 1100,
  margin: "0 auto"
} as const

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap" as const,
  marginBottom: 20
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.16em",
  color: "#9b7458"
} as const

const copyStyle = {
  margin: 0,
  color: "#6e5848",
  lineHeight: 1.7
} as const

const gridStyle = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
} as const

const cardStyle = {
  background: "rgba(255,255,255,0.84)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 24,
  padding: 22,
  boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)",
  display: "grid",
  gap: 18
} as const

const titleStyle = {
  fontSize: 24,
  fontWeight: 700
} as const

const metaStyle = {
  color: "#6e5848",
  fontSize: 14
} as const

const actionRowStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const
} as const

const primaryLinkStyle = {
  display: "inline-block",
  textDecoration: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6"
} as const

const secondaryLinkStyle = {
  display: "inline-block",
  textDecoration: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#fff8f2",
  border: "1px solid #dbc5b4",
  color: "#5f4738"
} as const

const buttonStyle = {
  border: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#7c5234",
  color: "#fffaf6",
  cursor: "pointer",
  fontSize: 14
} as const

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginBottom: 16
} as const
