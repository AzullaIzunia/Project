"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: ""
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      alert("Register success")
      router.push("/login")
    }
  }

  return (
    <div>
      <h1>Register</h1>

      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
      <input placeholder="Surname" onChange={e => setForm({...form, surname: e.target.value})}/>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})}/>

      <button onClick={handleSubmit}>Register</button>
    </div>
  )
}