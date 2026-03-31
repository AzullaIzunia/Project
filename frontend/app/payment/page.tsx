"use client"

import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()

  const selectMethod = (method: string) => {
    localStorage.setItem("payment_method", method)

    if (method === "promptpay") {
      router.push("/upload-slip")
    } else {
      router.push("/pay-success")
    }
  }

  return (
    <div>
      <h1>Payment</h1>

      <button onClick={() => selectMethod("promptpay")}>
        PromptPay
      </button>

      <button onClick={() => selectMethod("credit_card")}>
        Credit Card
      </button>
    </div>
  )
}