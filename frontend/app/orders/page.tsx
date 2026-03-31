"use client"

import { useEffect, useState } from "react"

export default function Orders() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch("http://localhost:5001/api/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div>
      <h1>My Orders</h1>

      {data.map(o => (
        <div key={o.order_id}>
          Order #{o.order_id} - {o.latestOrderStatus}
        </div>
      ))}
    </div>
  )
}