"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ResultPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const r = localStorage.getItem("result")
    if (r) setData(JSON.parse(r))
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>Result</h1>
      <p>{data.result}</p>
      <p>Stone: {data.stone}</p>

      <Link href="/recommend/1">See Products</Link>
    </div>
  )
}