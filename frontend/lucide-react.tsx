import React from "react"

type IconProps = {
  className?: string
}

function makeIcon(symbol: string) {
  return function Icon({ className }: IconProps) {
    return (
      <span aria-hidden="true" className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {symbol}
      </span>
    )
  }
}

export const ShoppingCart = makeIcon("🛒")
export const User = makeIcon("👤")
export const Star = makeIcon("★")
export const BookOpen = makeIcon("📖")
export const LogOut = makeIcon("↩")
export const LayoutDashboard = makeIcon("▦")
export const Menu = makeIcon("☰")
export const X = makeIcon("✕")
export const Sparkles = makeIcon("✦")
export const Filter = makeIcon("⏷")
export const Eye = makeIcon("◉")
export const EyeOff = makeIcon("◎")
export const ArrowLeft = makeIcon("←")
export const KeyRound = makeIcon("🔑")
export const ShoppingBag = makeIcon("🛍")
export const ChevronRight = makeIcon("›")
export const MapPin = makeIcon("📍")
export const XCircle = makeIcon("✕")
export const CheckCircle = makeIcon("✓")
export const CreditCard = makeIcon("💳")
export const QrCode = makeIcon("⌗")
export const Package = makeIcon("📦")
export const Trash2 = makeIcon("🗑")
export const Plus = makeIcon("+")
export const Minus = makeIcon("-")
export const Upload = makeIcon("⤴")
export const ImageIcon = makeIcon("▣")
