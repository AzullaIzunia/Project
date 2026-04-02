"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold"
  size?: "sm" | "md" | "lg" | "icon"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "glow-btn inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-body"

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-[#7c3aed] border border-[#8b5cf6]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-[#c9956a] border border-[#d4a574]",
      ghost: "bg-[#141420] text-foreground hover:bg-[#1b1b2a] border border-border",
      danger: "bg-red-500/12 text-red-200 hover:bg-red-500/18 border border-red-500/30",
      gold: "bg-[#d4a574] text-[#0a0a0f] hover:bg-[#c9956a] border border-[#d4a574]",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2",
      icon: "h-10 w-10 p-0 text-sm",
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span className="animate-spin">◌</span> : null}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
