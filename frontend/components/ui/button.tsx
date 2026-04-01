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
      "glow-btn inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-body"

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
      ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent",
      danger: "bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-800/50",
      gold: "bg-gold/20 text-gold hover:bg-gold/30 border border-gold/40",
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
