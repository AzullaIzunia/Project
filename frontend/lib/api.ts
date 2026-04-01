export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001"

export function apiUrl(path: string) {
  return `${API_BASE}${path}`
}
