"use client"

import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    telephone: "",
    password: ""
  })

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5001/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      setForm({
        name: data.name || "",
        address: data.address || "",
        telephone: data.telephone || "",
        password: ""
      })
    }

    fetchUser()
  }, [])

  const handleSave = async () => {
    const token = localStorage.getItem("token")

    await fetch("http://localhost:5001/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    alert("Updated ✅")
  }

  return (
    <div>
      <h1>Profile</h1>

      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
      />

      <input
        value={form.telephone}
        onChange={e => setForm({ ...form, telephone: e.target.value })}
      />

      <input
        type="password"
        placeholder="New password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  )
}