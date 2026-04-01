"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) return router.push("/login")

    const payload = JSON.parse(atob(token.split(".")[1]))

    if (!payload.isAdmin) {
      alert("Access denied")
      return router.push("/")
    }

    fetch("http://localhost:5001/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setOrders)
  }, [])

  return (
    <div>
      <h1>Admin</h1>

      {orders.map(o => (
        <div key={o.order_id}>
          #{o.order_id} - {o.latestOrderStatus}
        </div>
      ))}
    </div>
  )
}