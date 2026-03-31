"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ConfirmPage() {
  const router = useRouter()
  const [address, setAddress] = useState("")

  const handleConfirm = () => {
    localStorage.setItem("address", address)
    router.push("/payment")
  }

  return (
    <div>
      <h1>Confirm Order</h1>

      <textarea
        placeholder="Address"
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={handleConfirm}>Next</button>
    </div>
  )
}