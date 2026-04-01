"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { ShoppingCart, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  stock: number;
  isActive: boolean;
}

const categories = ["ทั้งหมด", "คริสตัล", "ไพ่ทาโรต์", "น้ำมันหอม", "เครื่องรางนำโชค", "หินพลังงาน"];

function ShopContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result_id");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const url = resultId ? `/api/fate/recommend?result_id=${resultId}` : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resultId]);

  const filtered =
    category === "ทั้งหมด"
      ? products
      : products.filter((p) => p.category === category);

  const handleAddToCart = (p: Product) => {
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image });
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div>
      {resultId && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-body flex items-center gap-2">
          <span>✦</span>
          สินค้าแนะนำตามโชคชะตาของคุณ
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors font-body flex-shrink-0",
              category === cat
                ? "bg-primary text-primary-foreground border border-primary/50"
                : "bg-muted text-muted-foreground border border-border hover:border-primary/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground font-body">
          ไม่พบสินค้าในหมวดนี้
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <div key={p.id} className="mystic-card overflow-hidden group hover:border-primary/60 transition-colors flex flex-col">
            <div className="relative h-44 bg-muted/30 overflow-hidden">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground/30">
                  ◈
                </div>
              )}
              <span className="absolute top-2 left-2 mystic-badge bg-secondary/80 text-secondary-foreground border-border text-[10px]">
                {p.category}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-foreground text-sm leading-snug">
                  {p.name}
                </h3>
                <p className="text-gold font-body font-semibold text-base mt-1">
                  ฿{p.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/products/${p.id}`} className="flex-1">
                  <button className="w-full px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 text-xs font-body transition-colors">
                    ดูรายละเอียด
                  </button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(p)}
                  disabled={p.stock === 0}
                  className="flex-shrink-0"
                  variant={addedId === p.id ? "gold" : "primary"}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {addedId === p.id ? "เพิ่มแล้ว" : "หยิบใส่ตะกร้า"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">ร้านมู</h1>
          <p className="text-muted-foreground font-body mt-1">ของมูคุณภาพสูง คัดสรรพลังงานดีๆ มาให้คุณ</p>
        </div>
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
          <ShopContent />
        </Suspense>
      </main>
    </div>
  );
}
