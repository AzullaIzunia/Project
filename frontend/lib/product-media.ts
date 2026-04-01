export function getProductImage(product: {
  image_url?: string | null
  category?: string
  main_stat?: string[]
}) {
  if (product.image_url) {
    return product.image_url
  }

  const category = (product.category || "").toLowerCase()

  if (category.includes("amulet")) return "/demo-product-amulet.svg"
  if (category.includes("candle")) return "/demo-product-candle.svg"
  if (category.includes("crystal")) return "/demo-product-crystal.svg"
  if (category.includes("perfume")) return "/demo-product-perfume.svg"

  const firstStat = (product.main_stat || [])[0]

  if (firstStat === "Healing" || firstStat === "Purity") return "/demo-product-candle.svg"
  if (firstStat === "Wealth" || firstStat === "Abundance") return "/demo-product-amulet.svg"
  if (firstStat === "Creativity" || firstStat === "Passion") return "/demo-product-perfume.svg"

  return "/demo-product-crystal.svg"
}
