"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) { setError("อีเมลไม่ถูกต้อง"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) { setError("กรุณากรอก OTP"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP ไม่ถูกต้อง");
      setStep("reset");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("รหัสผ่านอย่างน้อย 6 ตัว"); return; }
    if (password !== confirm) { setError("รหัสผ่านไม่ตรงกัน"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาด");
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["email", "otp", "reset"];
  const stepTitles: Record<Step, string> = {
    email: "กรอกอีเมลของคุณ",
    otp: "ยืนยัน OTP",
    reset: "ตั้งรหัสผ่านใหม่",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background star-bg relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {stepTitles[step]}
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            {step === "email" && "ระบบจะส่ง OTP ไปยังอีเมลของคุณ"}
            {step === "otp" && `กรุณากรอก OTP ที่ส่งไปยัง ${email}`}
            {step === "reset" && "เลือกรหัสผ่านใหม่ที่ปลอดภัย"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                steps.indexOf(step) >= i
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-border text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px transition-colors ${
                  steps.indexOf(step) > i ? "bg-primary" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="mystic-card p-6 sm:p-8">
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={requestOtp} className="flex flex-col gap-5">
              <Input id="email" type="email" label="อีเมล" placeholder="witch@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" loading={loading} className="w-full" size="lg">ส่ง OTP</Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={verifyOtp} className="flex flex-col gap-5">
              <Input id="otp" label="รหัส OTP" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="text-center text-2xl tracking-widest" />
              <Button type="submit" loading={loading} className="w-full" size="lg">ยืนยัน OTP</Button>
              <button type="button" onClick={() => setStep("email")} className="text-sm text-muted-foreground hover:text-foreground font-body flex items-center gap-1 justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" /> กลับ
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={resetPassword} className="flex flex-col gap-5">
              <Input id="password" type="password" label="รหัสผ่านใหม่" placeholder="อย่างน้อย 6 ตัว" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input id="confirm" type="password" label="ยืนยันรหัสผ่าน" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <Button type="submit" loading={loading} className="w-full" size="lg">ตั้งรหัสผ่านใหม่</Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 font-body">
          <Link href="/login" className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" /> กลับไปเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
