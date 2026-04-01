"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "กรุณากรอกชื่อ";
    if (!form.surname) e.surname = "กรุณากรอกนามสกุล";
    if (!form.email.includes("@")) e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (form.password.length < 6) e.password = "รหัสผ่านอย่างน้อย 6 ตัว";
    if (form.password !== form.confirm) e.confirm = "รหัสผ่านไม่ตรงกัน";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
      router.push("/login");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background star-bg relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center animate-float">
              <span className="text-2xl text-accent">☽</span>
            </div>
            <span className="font-serif text-xl gold-text font-bold">SellYourSoul</span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-foreground mt-4">
            เริ่มต้นการเดินทาง
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            สมัครสมาชิกเพื่อรับพรจากจักรวาล
          </p>
        </div>

        <div className="mystic-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="name"
                label="ชื่อ"
                placeholder="ชื่อจริง"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
              <Input
                id="surname"
                label="นามสกุล"
                placeholder="นามสกุล"
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
                error={errors.surname}
              />
            </div>

            <Input
              id="email"
              type="email"
              label="อีเมล"
              placeholder="witch@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-muted-foreground font-body">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="อย่างน้อย 6 ตัว"
                  className="mystic-input pr-10 font-body"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-400 font-body">{errors.password}</span>
              )}
            </div>

            <Input
              id="confirm"
              type="password"
              label="ยืนยันรหัสผ่าน"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.confirm}
            />

            {serverError && (
              <div className="px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
                {serverError}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
              <Sparkles className="w-4 h-4" />
              สมัครสมาชิก
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-body">
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="text-accent hover:text-accent/80 transition-colors">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
