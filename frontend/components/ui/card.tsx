import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
  glow?: boolean
}

export function Card({ className, children, glow }: CardProps) {
  return (
    <div className={cn("mystic-card rounded-[1.75rem]", glow && "animate-pulse-glow", className)}>
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("px-6 pt-6 pb-4 border-b border-border", className)}>{children}</div>
}

export function CardBody({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>
}

export function CardFooter({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("px-6 pb-6 pt-4 border-t border-border", className)}>{children}</div>
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props} />
  )
}
