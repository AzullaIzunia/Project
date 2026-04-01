"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth";
import { Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function UploadSlipPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("pending_order_id");
    if (!id) { router.push("/cart"); return; }
    setOrderId(id);
  }, [router]);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file || !orderId) return;
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("slip", file);
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: "POST",
        headers: authHeaders() as Record<string, string>,
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "อัปโหลดไม่สำเร็จ");
      }
      router.push("/pay-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">อัปโหลดสลิป</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            แนบหลักฐานการโอนเงิน รอ admin ยืนยัน
          </p>
        </div>

        <div className="mystic-card p-6 flex flex-col gap-5">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/60 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image src={preview} alt="slip preview" fill className="object-contain" />
              </div>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-body text-center">
                  คลิกหรือลากไฟล์มาวางที่นี่
                  <br />
                  <span className="text-xs">รองรับ JPG, PNG, PDF</span>
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {file && (
            <p className="text-xs text-muted-foreground font-body text-center">
              ไฟล์ที่เลือก: {file.name}
            </p>
          )}

          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm font-body">
              {error}
            </div>
          )}

          <Button onClick={handleUpload} loading={loading} disabled={!file} className="w-full" size="lg">
            <Upload className="w-4 h-4" />
            ส่งสลิป
          </Button>
        </div>
      </main>
    </div>
  );
}
