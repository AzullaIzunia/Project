"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ChoosePage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const d = localStorage.getItem("draw")
    if (!d) return router.push("/draw")
    setData(JSON.parse(d))
  }, [])

  const choose = async (stat: string) => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5001/api/fate/choose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        session_id: data.session_id,
        chosen_stat: stat
      })
    })

    const result = await res.json()
    localStorage.setItem("result", JSON.stringify(result))
    router.push("/result")
  }

  if (!data) return <div>Loading...</div>

  return (
    <div>
      {data.choices.map((c: any) => (
        <button key={c.stat} onClick={() => choose(c.stat)}>
          {c.stat}
        </button>
      ))}
    </div>
  )
}