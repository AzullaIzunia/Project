"use client"

import { useEffect, useState } from "react"

export default function Products() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div>
      <h1>Products</h1>

      {data.map(p => (
        <div key={p.product_id}>
          <h3>{p.product_name}</h3>
          <p>{p.category}</p>
          <p>{p.price}</p>
        </div>
      ))}
    </div>
  )
}