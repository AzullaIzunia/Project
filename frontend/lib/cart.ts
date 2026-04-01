export type CartItem = {
  product_id: number
  product_name: string
  price: number
  category: string
  quantity: number
}

const CART_KEY = "florder_cart"

function isBrowser() {
  return typeof window !== "undefined"
}

export function getCart(): CartItem[] {
  if (!isBrowser()) return []

  const raw = window.localStorage.getItem(CART_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event("cartUpdated"))
}

export function addToCart(item: CartItem) {
  const cart = getCart()
  const existing = cart.find(entry => entry.product_id === item.product_id)

  if (existing) {
    existing.quantity += item.quantity
    saveCart([...cart])
    return
  }

  saveCart([...cart, item])
}

export function updateCartQuantity(productId: number, quantity: number) {
  const cart = getCart()
    .map(item =>
      item.product_id === productId
        ? {
            ...item,
            quantity
          }
        : item
    )
    .filter(item => item.quantity > 0)

  saveCart(cart)
}

export function removeFromCart(productId: number) {
  saveCart(getCart().filter(item => item.product_id !== productId))
}

export function clearCart() {
  if (!isBrowser()) return
  window.localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new Event("cartUpdated"))
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}
