"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadSlip() {
  const router = useRouter()
  const [file, setFile] = useState<any>(null)

  const upload = async () => {
    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append("slip", file)

    await fetch("http://localhost:5001/api/orders/1/payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    router.push("/pay-success")
  }

  return (
    <div>
      <h1>Upload Slip</h1>

      <input type="file" onChange={(e:any)=>setFile(e.target.files[0])}/>
      <button onClick={upload}>Upload</button>
    </div>
  )
}