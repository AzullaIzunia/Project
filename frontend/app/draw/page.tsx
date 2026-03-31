"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const stats = ["Healing","Wealth","Purity","Passion","Creativity"]

export default function DrawPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<any[]>([])

  const select = (stat: string, type: string) => {
    if (selected.length >= 3) return
    setSelected([...selected, { stat, type }])
  }

  const submit = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5001/api/fate/draw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        witch_id: 1,
        choices: selected
      })
    })

    const data = await res.json()
    localStorage.setItem("draw", JSON.stringify(data))
    router.push("/choose")
  }

  return (
    <div>
      <h1>Draw</h1>

      {stats.map(s => (
        <div key={s}>
          {s}
          <button onClick={() => select(s, "plus")}>+</button>
          <button onClick={() => select(s, "minus")}>-</button>
        </div>
      ))}

      <button onClick={submit}>Draw</button>
    </div>
  )
}