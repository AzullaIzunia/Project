import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "รอชำระ", color: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "ชำระแล้ว", color: "bg-sky-50 text-sky-700 border-sky-200" },
  preparing: { label: "กำลังเตรียม", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  shipping: { label: "กำลังส่ง", color: "bg-violet-50 text-violet-700 border-violet-200" },
  completed: { label: "สำเร็จ", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "ยกเลิก", color: "bg-rose-50 text-rose-700 border-rose-200" },
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
