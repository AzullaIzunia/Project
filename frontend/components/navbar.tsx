"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, Menu, ShoppingBag, Sparkles, User, X } from "lucide-react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { getAuthEventName, isAdmin, removeToken } from "@/lib/auth"
import { getCartCount } from "@/lib/cart"
import { cn } from "@/lib/utils"

const userLinks = [
  { href: "/draw", label: "ดูดวง" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/about", label: "วิธีใช้งาน" },
  { href: "/fate-history", label: "ประวัติดวง" },
]

const adminLinks = [
  { href: "/admin", label: "แดชบอร์ด" },
  { href: "/admin/products", label: "จัดการสินค้า" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/about", label: "วิธีใช้งาน" },
]

const EMPTY_SNAPSHOT = "0|0|0"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const authEventName = getAuthEventName()
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {}
      window.addEventListener("storage", onStoreChange)
      window.addEventListener("cartUpdated", onStoreChange)
      window.addEventListener(authEventName, onStoreChange)
      window.addEventListener("focus", onStoreChange)
      return () => {
        window.removeEventListener("storage", onStoreChange)
        window.removeEventListener("cartUpdated", onStoreChange)
        window.removeEventListener(authEventName, onStoreChange)
        window.removeEventListener("focus", onStoreChange)
      }
    },
    () => {
      if (typeof window === "undefined") return EMPTY_SNAPSHOT
      const token = localStorage.getItem("token")
      return `${token ? 1 : 0}|${isAdmin() ? 1 : 0}|${getCartCount()}`
    },
    () => EMPTY_SNAPSHOT
  )
  const [loggedInFlag, adminFlag, cartCountValue] = snapshot.split("|")
  const loggedIn = loggedInFlag === "1"
  const admin = adminFlag === "1"
  const cartCount = Number(cartCountValue) || 0

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
    setOpen(false)
    setAccountMenuOpen(false)
    router.push("/login")
  }
  const closeMenus = () => {
    setOpen(false)
    setAccountMenuOpen(false)
  }

  const navLinks = admin ? adminLinks : userLinks

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={cn(
                "text-sm font-medium no-underline transition-colors",
                pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
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
                variant="ghost"
                size="sm"
                onClick={() => setAccountMenuOpen((value) => !value)}
                className="gap-2 border border-white/10 bg-[#1c1530] px-4 text-white hover:bg-[#2b1e49]"
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
              >
                <User className="h-4 w-4" />
                เมนู
                <ChevronRight
                  className={cn(
                    "ml-0.5 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                    accountMenuOpen ? "rotate-90" : "rotate-0"
                  )}
                />
              </Button>

              {accountMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#151320]/96 p-2 shadow-[0_20px_60px_rgba(5,4,14,0.4)] backdrop-blur-xl">
                  <Link
                    href="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-white/5"
                  >
                    <User className="h-4 w-4 text-gold" />
                    ดูโปรไฟล์
                  </Link>
                  <Link
                    href="/fate-history"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-white/5"
                  >
                    <Sparkles className="h-4 w-4 text-gold" />
                    ดูประวัติ
                  </Link>
                  {admin ? (
                    <Link
                      href="/admin"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-white/5"
                    >
                      <Sparkles className="h-4 w-4 text-gold" />
                      ดูแดชบอร์ด
                    </Link>
                  ) : null}
                  {admin ? (
                    <Link
                      href="/admin/products"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-white/5"
                    >
                      <ShoppingBag className="h-4 w-4 text-gold" />
                      จัดการสินค้า
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
              <Link href="/register">
                <Button variant="secondary" size="sm" className="px-5">
                  สมัครสมาชิก
                </Button>
              </Link>
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
            {navLinks.map((link) => (
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
                      ดูโปรไฟล์
                    </Button>
                  </Link>
                  <Link href="/fate-history" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      <Sparkles className="h-4 w-4" />
                      ดูประวัติ
                    </Button>
                  </Link>
                  {admin ? (
                    <Link href="/admin" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center">
                        <Sparkles className="h-4 w-4" />
                        ดูแดชบอร์ด
                      </Button>
                    </Link>
                  ) : null}
                  {admin ? (
                    <Link href="/admin/products" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center">
                        <ShoppingBag className="h-4 w-4" />
                        จัดการสินค้า
                      </Button>
                    </Link>
                  ) : null}
                  <Button variant="secondary" className="col-span-2" onClick={handleLogout}>
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center">
                      สมัครสมาชิก
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full justify-center">เข้าสู่ระบบ</Button>
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
