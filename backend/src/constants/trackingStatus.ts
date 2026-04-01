export const allowedTrackingStatus = [
  "order_received",
  "preparing",
  "packed",
  "shipping",
  "delivered"
] as const

export type TrackingStatusType =
  typeof allowedTrackingStatus[number]
