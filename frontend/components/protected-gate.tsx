"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type ProtectedGateProps = {
  title?: string
  description?: string
  redirectTo: string
}

export default function ProtectedGate({
  title = "กรุณาเข้าสู่ระบบก่อน",
  description = "กรุณาเข้าสู่ระบบก่อนจึงจะใช้งานหน้านี้ต่อได้",
  redirectTo,
}: ProtectedGateProps) {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-10 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-[#15121b] px-6 py-20 text-center shadow-[0_30px_80px_rgba(10,8,20,0.28)] sm:px-10">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#2c2045] text-[#8d5cf6] shadow-[0_0_40px_rgba(141,92,246,0.25)]">
            <span className="text-5xl">🔒</span>
          </div>
          <h1 className="mt-8 text-4xl font-semibold text-white md:text-5xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-white/60">{description}</p>
          <div className="mt-10">
            <Button
              size="lg"
              className="bg-[#8d5cf6] text-white hover:bg-[#7c4ef0] border-[#8d5cf6] px-8"
              onClick={() => router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`)}
            >
              เข้าสู่ระบบเพื่อดำเนินการต่อ
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
