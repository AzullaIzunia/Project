import Link from "next/link"

export default function PaySuccessPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-card/70 p-8 text-center shadow-[0_22px_56px_rgba(74,49,31,0.08)]">
        <p className="text-xs tracking-[0.18em] text-gold">ชำระเงินเสร็จสมบูรณ์</p>
        <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-4xl font-semibold text-emerald-700">
          ✓
        </div>
        <h1 className="mt-5 text-4xl font-semibold text-foreground">ชำระเงินสำเร็จ</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted-foreground">
          ระบบได้รับการชำระเงินของคุณแล้ว ถ้าเป็น PromptPay ออเดอร์จะรอแอดมินตรวจสอบ
          ถ้าเป็นบัตรเครดิต ออเดอร์จะขยับไปขั้นถัดไปทันที
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/orders" className="rounded-full bg-primary px-5 py-3 text-primary-foreground no-underline">
            ดูคำสั่งซื้อของฉัน
          </Link>
          <Link href="/" className="rounded-full border border-border bg-white/70 px-5 py-3 text-foreground no-underline">
            กลับหน้าแรก
          </Link>
        </div>
      </section>
    </main>
  )
}
