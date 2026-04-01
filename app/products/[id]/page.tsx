"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  stock: number;
  description?: string;
  mainStats?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, qty);
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground font-body">ไม่พบสินค้า</p>
          <Button onClick={() => router.back()} variant="secondary">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-5xl mx-auto w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> กลับ
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="mystic-card overflow-hidden h-80 md:h-auto relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw,50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl text-muted-foreground/20">
                ◈
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="mystic-badge border-primary/40 text-accent text-xs mb-2 inline-flex">
                {product.category}
              </span>
              <h1 className="text-2xl font-serif font-bold text-foreground mt-1">
                {product.name}
              </h1>
              <p className="text-2xl font-body font-bold text-gold mt-2">
                ฿{product.price.toLocaleString()}
              </p>
            </div>

            {product.mainStats && (
              <div className="px-4 py-3 rounded-lg bg-gold/10 border border-gold/30">
                <p className="text-xs text-gold font-body uppercase tracking-wider mb-1">พลังงาน</p>
                <p className="text-sm text-foreground font-body">{product.mainStats}</p>
              </div>
            )}

            {product.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-body mb-2">รายละเอียด</p>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm font-body">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                {product.stock > 0 ? `เหลือ ${product.stock} ชิ้น` : "สินค้าหมด"}
              </span>
            </div>

            {/* Qty selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-body">จำนวน:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-body text-foreground">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant={added ? "gold" : "primary"}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "เพิ่มลงตะกร้าแล้ว!" : "เพิ่มลงตะกร้า"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
