import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "รอชำระ", color: "bg-yellow-900/40 text-yellow-300 border-yellow-800/50" },
  paid: { label: "ชำระแล้ว", color: "bg-blue-900/40 text-blue-300 border-blue-800/50" },
  preparing: { label: "กำลังเตรียม", color: "bg-indigo-900/40 text-indigo-300 border-indigo-800/50" },
  shipping: { label: "กำลังส่ง", color: "bg-purple-900/40 text-purple-300 border-purple-800/50" },
  completed: { label: "สำเร็จ", color: "bg-green-900/40 text-green-300 border-green-800/50" },
  cancelled: { label: "ยกเลิก", color: "bg-red-900/40 text-red-300 border-red-800/50" },
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
