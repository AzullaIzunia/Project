"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold"
  size?: "sm" | "md" | "lg"
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
      primary: "bg-primary text-primary-foreground hover:bg-black/90 border border-black",
      secondary: "bg-secondary text-secondary-foreground hover:bg-[#ece5da] border border-border",
      ghost: "bg-white/80 text-foreground hover:bg-muted border border-border",
      danger: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
      gold: "bg-[#d4b062] text-[#23190b] hover:bg-[#caa24d] border border-[#d4b062]",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2",
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
