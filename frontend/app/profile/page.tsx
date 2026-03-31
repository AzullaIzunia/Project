"use client"

import { useState } from "react"

export default function Profile() {
  const [name, setName] = useState("")

  const save = () => {
    alert("Saved")
  }

  return (
    <div>
      <h1>Profile</h1>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />

      <button onClick={save}>Save</button>
    </div>
  )
}