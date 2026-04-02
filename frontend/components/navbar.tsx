"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingBag, Sparkles, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { isAdmin, removeToken } from "@/lib/auth"
import { getCartCount } from "@/lib/cart"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/draw", label: "ดูดวง" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/about", label: "วิธีใช้งาน" },
  { href: "/fate-history", label: "ประวัติดวง" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    setAccountMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!accountMenuRef.current) return
      if (!accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    removeToken()
    setLoggedIn(false)
    setAdmin(false)
    setCartCount(0)
    setOpen(false)
    setAccountMenuOpen(false)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[#0f0f17]/92 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24163f]">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
            DUDUANG
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
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
              หลังบ้าน
            </Link>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-black">
                  {cartCount}
                </span>
              ) : null}
            </Button>
          </Link>

          {loggedIn ? (
            <div className="relative" ref={accountMenuRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAccountMenuOpen((value) => !value)}
                className="gap-2 px-4"
              >
                <User className="h-4 w-4" />
                บัญชีผู้ใช้
              </Button>

              {accountMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#151320]/96 p-2 shadow-[0_20px_60px_rgba(5,4,14,0.4)] backdrop-blur-xl">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-white/5"
                  >
                    <User className="h-4 w-4 text-gold" />
                    โปรไฟล์
                  </Link>
                  {admin ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-white/5"
                    >
                      <Sparkles className="h-4 w-4 text-gold" />
                      แดชบอร์ด
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-white/5"
                  >
                    <X className="h-4 w-4 text-gold" />
                    ออกจากระบบ
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" className="px-5">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex rounded-xl border border-border bg-[#141420] p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-[#0f0f17] px-4 py-4 md:hidden">
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
                หลังบ้าน
              </Link>
            ) : null}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-center">
                  <ShoppingBag className="h-4 w-4" />
                  ตะกร้า {cartCount > 0 ? `(${cartCount})` : ""}
                </Button>
              </Link>
              {loggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      <User className="h-4 w-4" />
                      โปรไฟล์
                    </Button>
                  </Link>
                  <Button variant="secondary" className="col-span-2" onClick={handleLogout}>
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="col-span-2 w-full justify-center">เข้าสู่ระบบ</Button>
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
