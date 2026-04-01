import Link from "next/link"

export default function PaySuccessPage() {
  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>PAYMENT COMPLETE</p>
        <div style={iconWrapStyle}>✓</div>
        <h1 style={{ margin: "12px 0 10px", fontSize: 38 }}>Payment Success</h1>
        <p style={copyStyle}>
          ระบบได้รับการชำระเงินของคุณแล้ว ถ้าเป็น PromptPay ออเดอร์จะรอแอดมินตรวจสอบ
          ถ้าเป็นบัตรเครดิต ออเดอร์จะขยับไปขั้นถัดไปทันที
        </p>

        <div style={actionRowStyle}>
          <Link href="/orders" style={primaryLinkStyle}>
            View My Orders
          </Link>
          <Link href="/" style={secondaryLinkStyle}>
            Back Home
          </Link>
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
  background: "linear-gradient(180deg, #f7efe6 0%, #efdfd2 100%)",
  fontFamily: "Georgia, serif",
  color: "#2a1f18"
} as const

const cardStyle = {
  width: "100%",
  maxWidth: 640,
  background: "rgba(255,255,255,0.86)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 28,
  padding: 32,
  boxShadow: "0 22px 56px rgba(74, 49, 31, 0.08)",
  textAlign: "center" as const
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: "#9b7458"
} as const

const iconWrapStyle = {
  width: 88,
  height: 88,
  margin: "18px auto 0",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "#edf7ef",
  color: "#146c2e",
  fontSize: 38,
  fontWeight: 700
} as const

const copyStyle = {
  margin: 0,
  color: "#6e5848",
  lineHeight: 1.8
} as const

const actionRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 12,
  flexWrap: "wrap" as const,
  marginTop: 24
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
