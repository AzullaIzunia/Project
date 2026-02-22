export const allowedOrderStatus = [
  "paid",
  "preparing",
  "shipping",
  "completed"
] as const

export type OrderStatusType =
  typeof allowedOrderStatus[number]