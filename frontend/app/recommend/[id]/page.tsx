"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function RecommendPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchased, setPurchased] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")

      const res = await fetch(`http://localhost:5001/api/fate/recommend/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await res.json()
      setData(result)
      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleBuy = async (product_id: number) => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        payment_method: "credit_card",
        items: [{ product_id, quantity: 1 }]
      })
    })

    const order = await res.json()

    await fetch(`http://localhost:5001/api/orders/${order.order_id}/pay`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })

    setPurchased([...purchased, product_id])
    alert("ซื้อสำเร็จ")
  }

  if (loading) return <div>🔮 Loading...</div>

  return (
    <div>
      <Link href="/">🏠 Home</Link>

      <h1>Recommend</h1>

      {data.recommended_products.map((p: any) => (
        <div key={p.product_id}>
          <h3>{p.product_name}</h3>

          <button
            disabled={purchased.includes(p.product_id)}
            onClick={() => handleBuy(p.product_id)}
          >
            {purchased.includes(p.product_id) ? "Purchased ✅" : "Buy"}
          </button>
        </div>
      ))}
    </div>
  )
}