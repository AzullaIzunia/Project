"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingBag, Sparkles, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { isAdmin, removeToken } from "@/lib/auth"
import { getCartCount } from "@/lib/cart"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/draw", label: "ดูดวง" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/orders", label: "คำสั่งซื้อ" },
  { href: "/fate-history", label: "ประวัติดวง" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const sync = () => {
      const token = localStorage.getItem("token")
      setLoggedIn(Boolean(token))
      setAdmin(isAdmin())
      setCartCount(getCartCount())
    }

    sync()
    window.addEventListener("storage", sync)
    window.addEventListener("cartUpdated", sync)

    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener("cartUpdated", sync)
    }
  }, [])

  const handleLogout = () => {
    removeToken()
    setLoggedIn(false)
    setAdmin(false)
    setCartCount(0)
    setOpen(false)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Sparkles className="h-5 w-5 text-gold" />
          <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
            FLORDER
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium no-underline transition-colors",
                pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {admin ? (
            <Link
              href="/admin"
              className={cn(
                "text-sm font-medium no-underline transition-colors",
                pathname === "/admin" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Admin
            </Link>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-black">
                  {cartCount}
                </span>
              ) : null}
            </Button>
          </Link>

          {loggedIn ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex rounded-xl border border-border bg-white p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium no-underline transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {admin ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground no-underline hover:bg-secondary/80 hover:text-foreground"
              >
                Admin
              </Link>
            ) : null}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-center">
                  <ShoppingBag className="h-4 w-4" />
                  Cart {cartCount > 0 ? `(${cartCount})` : ""}
                </Button>
              </Link>
              {loggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="secondary" className="col-span-2" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full justify-center">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
