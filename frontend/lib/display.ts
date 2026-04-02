const statLabels: Record<string, string> = {
  Protection: "การปกป้อง",
  Purity: "ความบริสุทธิ์",
  Telluric: "พลังแห่งผืนดิน",
  Ethereality: "พลังเหนือสัมผัส",
  Omniscience: "ญาณหยั่งรู้",
  Healing: "การเยียวยา",
  Wealth: "ความมั่งคั่ง",
  Abundance: "ความอุดมสมบูรณ์",
  Intelligence: "ปัญญาเฉียบคม",
  Creativity: "ความคิดสร้างสรรค์",
  Affection: "ความอ่อนโยน",
  Passion: "แรงปรารถนา",
  Charm: "เสน่ห์ดึงดูด",
}

const statusLabels: Record<string, string> = {
  paid: "รอชำระต่อ",
  preparing: "กำลังเตรียม",
  shipping: "กำลังจัดส่ง",
  delivered: "จัดส่งถึงแล้ว",
  completed: "เสร็จสมบูรณ์",
  cancelled: "ยกเลิกแล้ว",
  packed: "แพ็กสินค้าแล้ว",
}

const paymentMethodLabels: Record<string, string> = {
  promptpay: "พร้อมเพย์",
  credit_card: "บัตรเครดิต",
}

export function statLabel(value?: string | null) {
  if (!value) return "-"
  return statLabels[value] || value
}

export function statusLabel(value?: string | null) {
  if (!value) return "-"
  return statusLabels[value] || value
}

export function paymentMethodLabel(value?: string | null) {
  if (!value) return "-"
  return paymentMethodLabels[value] || value.replaceAll("_", " ")
}

export function formatPrice(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "-"
  return `${value.toLocaleString("th-TH")} บาท`
}
