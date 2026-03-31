"use client"

import { useEffect, useState } from "react"

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

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
      <h1>Admin Orders</h1>

      {orders.map(o => (
        <div key={o.order_id}>
          #{o.order_id} - {o.latestOrderStatus}
        </div>
      ))}
    </div>
  )
}