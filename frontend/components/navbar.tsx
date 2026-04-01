"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ShoppingCart,
  User,
  Star,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getToken, removeToken, isAdmin } from "@/lib/auth"
import { getCartCount } from "@/lib/cart"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [admin, setAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const syncSession = () => {
      setToken(getToken())
      setAdmin(isAdmin())
      setCartCount(getCartCount())
    }

    syncSession()
    window.addEventListener("storage", syncSession)
    window.addEventListener("cartUpdated", syncSession)
    return () => {
      window.removeEventListener("storage", syncSession)
      window.removeEventListener("cartUpdated", syncSession)
    }
  }, [pathname])

  const logout = () => {
    removeToken()
    router.push("/login")
    router.refresh()
  }

  const navLinks = [
    { href: "/shop", label: "Shop", icon: <Star className="w-4 h-4" /> },
    { href: "/draw", label: "Draw", icon: <Sparkles className="w-4 h-4" /> },
    { href: "/fate-history", label: "Fate History", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/orders", label: "Orders", icon: <ShoppingCart className="w-4 h-4" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:border-accent transition-colors">
            <span className="text-accent text-sm">✦</span>
          </div>
          <span className="text-lg font-bold gold-text tracking-wide hidden sm:block">Florder</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 font-body",
                pathname === link.href
                  ? "bg-primary/20 text-accent border border-primary/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {admin ? (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 font-body",
                pathname.startsWith("/admin")
                  ? "bg-gold/20 text-gold border border-gold/40"
                  : "text-gold-muted hover:text-gold hover:bg-gold/10"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </Link>

          {token ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/profile" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Profile">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={logout} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="px-3 py-1.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body">
                Login
              </Link>
              <Link href="/register" className="glow-btn px-4 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground font-medium font-body transition-all">
                Register
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="md:hidden relative bg-card border-b border-border px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                pathname === link.href
                  ? "bg-primary/20 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {admin ? (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gold hover:bg-gold/10 transition-colors font-body"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Link>
          ) : null}
          <div className="border-t border-border pt-2 mt-1 flex flex-col gap-2">
            {token ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm bg-primary text-primary-foreground font-medium font-body transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
