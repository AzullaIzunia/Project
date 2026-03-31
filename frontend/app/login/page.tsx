"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem("token", data.token)
      router.push("/draw")
    } else {
      alert("Login failed")
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})}/>

      <button onClick={handleSubmit}>Login</button>
    </div>
  )
}