import Link from "next/link"

export default function Home() {
  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>FLORDER</p>
        <h1 style={{ margin: "10px 0 12px", fontSize: 46 }}>Fortune and Flow</h1>
        <p style={copyStyle}>
          ระบบดูดวงและเลือกสินค้าที่เชื่อมผลคำทำนายเข้ากับประสบการณ์สั่งซื้อใน flow เดียว
        </p>

        <div style={linkGridStyle}>
          <Link href="/shop" style={primaryLinkStyle}>Shop</Link>
          <Link href="/login" style={primaryLinkStyle}>Login</Link>
          <Link href="/register" style={secondaryLinkStyle}>Register</Link>
          <Link href="/draw" style={secondaryLinkStyle}>Start Draw</Link>
          <Link href="/orders" style={secondaryLinkStyle}>My Orders</Link>
          <Link href="/fate-history" style={secondaryLinkStyle}>Fate History</Link>
          <Link href="/admin" style={secondaryLinkStyle}>Admin</Link>
        </div>
      </section>
    </main>
  )
}

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: "radial-gradient(circle at top, #f7e9d6 0%, #f3ecdf 40%, #e6d9c8 100%)",
  fontFamily: "Georgia, serif",
  color: "#2a1f18"
} as const

const heroStyle = {
  width: "100%",
  maxWidth: 780,
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 28,
  padding: 32,
  boxShadow: "0 24px 60px rgba(74, 49, 31, 0.08)"
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: "#9b7458"
} as const

const copyStyle = {
  margin: 0,
  color: "#6e5848",
  lineHeight: 1.8,
  maxWidth: 620
} as const

const linkGridStyle = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  marginTop: 24
} as const

const primaryLinkStyle = {
  display: "inline-block",
  textAlign: "center" as const,
  textDecoration: "none",
  borderRadius: 999,
  padding: "14px 18px",
  background: "linear-gradient(90deg, #7c5234 0%, #b97843 100%)",
  color: "#fffaf6"
} as const

const secondaryLinkStyle = {
  display: "inline-block",
  textAlign: "center" as const,
  textDecoration: "none",
  borderRadius: 999,
  padding: "14px 18px",
  background: "#fff8f2",
  border: "1px solid #dbc5b4",
  color: "#5f4738"
} as const
