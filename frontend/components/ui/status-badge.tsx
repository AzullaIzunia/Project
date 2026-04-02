import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "รอชำระ", color: "bg-amber-500/12 text-amber-200 border-amber-500/30" },
  paid: { label: "ชำระแล้ว", color: "bg-sky-500/12 text-sky-200 border-sky-500/30" },
  preparing: { label: "กำลังเตรียม", color: "bg-indigo-500/12 text-indigo-200 border-indigo-500/30" },
  shipping: { label: "กำลังส่ง", color: "bg-violet-500/12 text-violet-200 border-violet-500/30" },
  completed: { label: "สำเร็จ", color: "bg-emerald-500/12 text-emerald-200 border-emerald-500/30" },
  cancelled: { label: "ยกเลิก", color: "bg-rose-500/12 text-rose-200 border-rose-500/30" },
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const config = statusConfig[status] ?? {
    label: status,
    color: "bg-muted text-muted-foreground border-border",
  }

  return <span className={cn("mystic-badge", config.color, className)}>{config.label}</span>
}
