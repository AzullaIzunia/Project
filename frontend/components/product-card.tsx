"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { addToCart } from "@/lib/cart"
import { formatPrice } from "@/lib/display"
import { getProductImage } from "@/lib/product-media"
import { Button } from "@/components/ui/button"

type Product = {
  product_id: number
  product_name: string
  price: number
  category: string
  image_url?: string | null
  main_stat?: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card transition-transform hover:-translate-y-1">
      <Link href={`/products/${product.product_id}`} className="no-underline">
        <img
          src={getProductImage(product)}
          alt={product.product_name}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="text-xs tracking-[0.16em] text-gold">{product.category}</div>
        <Link href={`/products/${product.product_id}`} className="no-underline">
          <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
            {product.product_name}
          </h2>
        </Link>
        <div className="mt-2 text-sm text-muted-foreground">{formatPrice(product.price)}</div>
        <div className="mt-4 flex gap-2">
          <Link href={`/products/${product.product_id}`} className="flex-1">
            <Button variant="ghost" className="w-full justify-center">
              ดูสินค้า
            </Button>
          </Link>
          <Button
            className="flex-1 justify-center"
            onClick={() =>
              addToCart({
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                category: product.category,
                quantity: 1,
              })
            }
          >
            <ShoppingBag className="h-4 w-4" />
            ใส่ตะกร้า
          </Button>
        </div>
      </div>
    </div>
  )
}
