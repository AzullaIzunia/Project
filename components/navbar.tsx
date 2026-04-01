"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getToken, removeToken, isAdmin, parseJwt } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = getToken();
    setToken(t);
    setAdmin(isAdmin());
    setCartCount(getCartCount());

    const handleStorage = () => {
      setToken(getToken());
      setAdmin(isAdmin());
      setCartCount(getCartCount());
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cartUpdated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleStorage);
    };
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setToken(null);
    setAdmin(false);
    setMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/shop", label: "ร้านมู", icon: <Star className="w-4 h-4" /> },
    { href: "/draw", label: "ดูดวง", icon: <Sparkles className="w-4 h-4" /> },
    {
      href: "/fate-history",
      label: "ประวัติดวง",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      href: "/orders",
      label: "คำสั่งซื้อ",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setMenuOpen(false)}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:border-accent transition-colors">
            <span className="text-accent text-sm">✦</span>
          </div>
          <span className="font-serif text-lg font-bold gold-text tracking-wide hidden sm:block">
            SellYourSoul
          </span>
        </Link>

        {/* Desktop Nav */}
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
          {admin && (
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
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="ตะกร้าสินค้า"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {token ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/profile"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="โปรไฟล์"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="ออกจากระบบ"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="glow-btn px-4 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground font-medium font-body transition-all"
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
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
          {admin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gold hover:bg-gold/10 transition-colors font-body"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}
          <div className="border-t border-border pt-2 mt-1 flex flex-col gap-2">
            {token ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body"
                >
                  <User className="w-4 h-4" />
                  โปรไฟล์
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-body"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm bg-primary text-primary-foreground font-medium font-body transition-colors"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
