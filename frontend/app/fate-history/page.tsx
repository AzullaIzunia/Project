"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"

type FateHistoryItem = {
  result_id: number
  drawn_stat: string
  result: string
  createdAt: string
  special_event: boolean
  fate: {
    stone: string
  }
}

export default function FateHistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<FateHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(apiUrl("/api/fate/history"), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "โหลดประวัติผลดูดวงไม่สำเร็จ")
        }

        setItems(data)
      } catch (err: any) {
        setError(err.message || "โหลดประวัติผลดูดวงไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>FATE ARCHIVE</p>
            <h1 style={{ margin: "8px 0 10px", fontSize: 38 }}>Fate History</h1>
            <p style={copyStyle}>ดูผลดูดวงย้อนหลังและย้อนกลับไปทบทวนข้อความที่เคยได้รับ</p>
          </div>
          <Link href="/draw" style={primaryLinkStyle}>
            ดูดวงอีกครั้ง
          </Link>
        </div>

        {loading ? <p style={copyStyle}>กำลังโหลดประวัติผลดูดวง...</p> : null}
        {error ? <p style={errorStyle}>{error}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>ยังไม่มีประวัติผลดูดวง</h2>
            <p style={copyStyle}>เมื่อคุณเริ่มดูดวงและเลือกคำทำนายแล้ว รายการจะมาแสดงที่หน้านี้</p>
          </section>
        ) : null}

        <section style={{ display: "grid", gap: 16 }}>
          {items.map(item => (
            <article key={item.result_id} style={cardStyle}>
              <div style={topRowStyle}>
                <div>
                  <div style={titleStyle}>{item.drawn_stat}</div>
                  <div style={metaStyle}>
                    {new Date(item.createdAt).toLocaleString()} • Stone: {item.fate?.stone || "-"}
                  </div>
                </div>
                {item.special_event ? <span style={badgeStyle}>special event</span> : null}
              </div>

              <p style={{ ...copyStyle, marginTop: 14 }}>{item.result}</p>

              <div style={actionRowStyle}>
                <Link href={`/recommend/${item.result_id}`} style={secondaryLinkStyle}>
                  ดูสินค้าแนะนำ
                </Link>
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
  maxWidth: 920,
  margin: "0 auto"
} as const

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap" as const,
  marginBottom: 20
} as const

const cardStyle = {
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(111, 78, 55, 0.12)",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 18px 48px rgba(74, 49, 31, 0.08)"
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

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  flexWrap: "wrap" as const
} as const

const titleStyle = {
  fontSize: 26,
  fontWeight: 700
} as const

const metaStyle = {
  marginTop: 6,
  color: "#7c6657",
  fontSize: 14
} as const

const badgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#f2e0d4",
  color: "#5c4535",
  textTransform: "lowercase" as const
} as const

const actionRowStyle = {
  display: "flex",
  gap: 10,
  marginTop: 18,
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

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318",
  marginBottom: 16
} as const
