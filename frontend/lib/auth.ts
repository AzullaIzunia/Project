const TOKEN_KEY = "token"
const AUTH_EVENT = "authUpdated"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function removeToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem("pending_order_id")
  localStorage.removeItem("draw")
  localStorage.removeItem("result")
  localStorage.removeItem("address")
  localStorage.removeItem("order_note")
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function isAdmin() {
  const token = getToken()
  if (!token) return false
  const payload = parseJwt(token)
  return payload?.isAdmin === true
}

export function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getAuthEventName() {
  return AUTH_EVENT
}
