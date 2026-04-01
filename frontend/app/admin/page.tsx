"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE, apiUrl } from "@/lib/api"
import { getProductImage } from "@/lib/product-media"
const allStats = [
  "Protection",
  "Purity",
  "Telluric",
  "Ethereality",
  "Ominiscience",
  "Healing",
  "Wealth",
  "Abundance",
  "Intelligence",
  "Creativity",
  "Affection",
  "Passion"
]
const orderWorkflow = ["preparing", "shipping", "completed"]

type DashboardData = {
  totalOrders: number
  totalRevenue: number
  statusCount: Record<string, number>
}

type PendingPayment = {
  order_id: number
  total_price: number
  payment_bill: string | null
  createOrder: string
  user: {
    name: string
    surname: string
    email: string
  }
}

type Order = {
  order_id: number
  total_price: number
  payment_method: string
  latestOrderStatus: string
  order_status: string[]
  createOrder: string
  payment_bill?: string | null
  user: {
    name: string
    surname: string
    email: string
  }
  orderItems: Array<{
    orderItem_id: number
    quantity: number
    price: number
    product: {
      product_name: string
      category: string
    }
  }>
}

type Product = {
  product_id: number
  product_name: string
  category: string
  price: number
  image_url?: string | null
  stock_quantity: number
  description?: string | null
  main_stat: string[]
  isActive: boolean
}

const cardStyle = {
  background: "rgba(255,255,255,0.82)",
  borderRadius: 24,
  border: "1px solid rgba(111, 78, 55, 0.12)",
  padding: 24,
  boxShadow: "0 20px 45px rgba(74, 49, 31, 0.08)"
} as const

export default function AdminPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productForm, setProductForm] = useState({
    product_name: "",
    category: "",
    price: "",
    stock_quantity: "",
    image_url: "",
    description: "",
    main_stat: [] as string[]
  })

  const fetchAdminData = async (authToken: string, quiet = false) => {
    if (!quiet) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    setError("")

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`
      }

      const [dashboardRes, pendingRes, ordersRes, productsRes] = await Promise.all([
        fetch(apiUrl("/api/admin/dashboard"), { headers }),
        fetch(apiUrl("/api/admin/pending-payments"), { headers }),
        fetch(apiUrl("/api/orders"), { headers }),
        fetch(apiUrl("/api/products?active=true&limit=100"), { headers })
      ])

      const [dashboardData, pendingData, ordersData, productsData] = await Promise.all([
        dashboardRes.json(),
        pendingRes.json(),
        ordersRes.json(),
        productsRes.json()
      ])

      if (!dashboardRes.ok) {
        throw new Error(dashboardData.error || "โหลด dashboard ไม่สำเร็จ")
      }

      if (!pendingRes.ok) {
        throw new Error(pendingData.error || "โหลดรายการสลิปไม่สำเร็จ")
      }

      if (!ordersRes.ok) {
        throw new Error(ordersData.error || "โหลดออเดอร์ไม่สำเร็จ")
      }

      if (!productsRes.ok) {
        throw new Error(productsData.error || "โหลดสินค้าไม่สำเร็จ")
      }

      setDashboard(dashboardData)
      setPendingPayments(pendingData)
      setOrders(ordersData)
      setProducts(productsData.data ?? [])
    } catch (err: any) {
      setError(err.message || "โหลดข้อมูลหลังบ้านไม่สำเร็จ")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      router.push("/login")
      return
    }

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]))

      if (!payload.isAdmin) {
        router.push("/")
        return
      }

      setToken(storedToken)
      fetchAdminData(storedToken)
    } catch {
      router.push("/login")
    }
  }, [router])

  const showNotice = (message: string) => {
    setNotice(message)
    setTimeout(() => setNotice(""), 2500)
  }

  const approvePayment = async (orderId: number) => {
    if (!token) return

    const res = await fetch(apiUrl(`/api/orders/${orderId}/approve`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "อนุมัติสลิปไม่สำเร็จ")
      return
    }

    showNotice(`อนุมัติการชำระของออเดอร์ #${orderId} แล้ว`)
    fetchAdminData(token, true)
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    if (!token) return

    const res = await fetch(apiUrl(`/api/orders/${orderId}/status`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "อัปเดตสถานะไม่สำเร็จ")
      return
    }

    showNotice(`อัปเดตออเดอร์ #${orderId} เป็น ${status} แล้ว`)
    fetchAdminData(token, true)
  }

  const toggleStat = (stat: string) => {
    setProductForm(current => {
      const exists = current.main_stat.includes(stat)
      return {
        ...current,
        main_stat: exists
          ? current.main_stat.filter(item => item !== stat)
          : [...current.main_stat, stat]
      }
    })
  }

  const createProduct = async () => {
    if (!token) return

    const res = await fetch(apiUrl("/api/products"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...productForm,
        price: Number(productForm.price),
        stock_quantity: Number(productForm.stock_quantity),
        image_url: productForm.image_url || undefined
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "สร้างสินค้าไม่สำเร็จ")
      return
    }

    setProductForm({
      product_name: "",
      category: "",
      price: "",
      stock_quantity: "",
      image_url: "",
      description: "",
      main_stat: []
    })
    showNotice(`เพิ่มสินค้า ${data.product_name} แล้ว`)
    fetchAdminData(token, true)
  }

  const deactivateProduct = async (productId: number) => {
    if (!token) return

    const res = await fetch(apiUrl(`/api/products/${productId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "ปิดการขายสินค้าไม่สำเร็จ")
      return
    }

    showNotice(`ปิดการขายสินค้า #${productId} แล้ว`)
    fetchAdminData(token, true)
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: 520, margin: "80px auto" }}>
          <h1 style={{ marginTop: 0 }}>Admin Workspace</h1>
          <p>กำลังโหลดข้อมูลหลังบ้าน...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <p style={eyebrowStyle}>FLORDER ADMIN</p>
          <div style={headerRowStyle}>
            <div>
              <h1 style={{ margin: "8px 0 10px", fontSize: 40 }}>Admin Workspace</h1>
              <p style={{ margin: 0, color: "#695546", lineHeight: 1.7, maxWidth: 760 }}>
                หน้านี้รวม dashboard, ตรวจสลิป, จัดการออเดอร์ และจัดการสินค้าไว้ในที่เดียว
                เพื่อให้หลังบ้านใช้งาน flow หลักได้จริง
              </p>
            </div>
            <button
              type="button"
              onClick={() => token && fetchAdminData(token, true)}
              style={primaryButtonStyle}
            >
              {refreshing ? "กำลังรีเฟรช..." : "รีเฟรชข้อมูล"}
            </button>
          </div>
        </header>

        {error ? <p style={errorStyle}>{error}</p> : null}
        {notice ? <p style={noticeStyle}>{notice}</p> : null}

        {dashboard ? (
          <section style={metricGridStyle}>
            <MetricCard label="Total Orders" value={String(dashboard.totalOrders)} />
            <MetricCard
              label="Completed Revenue"
              value={`${dashboard.totalRevenue.toLocaleString()} THB`}
            />
            <MetricCard label="Pending Payment" value={String(dashboard.statusCount.paid || 0)} />
            <MetricCard
              label="In Delivery Flow"
              value={String(
                (dashboard.statusCount.preparing || 0) + (dashboard.statusCount.shipping || 0)
              )}
            />
          </section>
        ) : null}

        {dashboard ? (
          <section style={{ ...cardStyle, marginTop: 20 }}>
            <h2 style={sectionTitleStyle}>Order Status Snapshot</h2>
            <div style={statusGridStyle}>
              {Object.entries(dashboard.statusCount).map(([status, count]) => (
                <div key={status} style={statusCardStyle}>
                  <div style={{ fontSize: 13, color: "#846957", textTransform: "capitalize" }}>
                    {status}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{count}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section style={{ ...cardStyle, marginTop: 20 }}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Pending Payment Slips</h2>
              <p style={sectionCopyStyle}>ตรวจสลิปและกดอนุมัติให้ออเดอร์เข้าสถานะ preparing</p>
            </div>
          </div>

          {pendingPayments.length === 0 ? (
            <p style={emptyTextStyle}>ตอนนี้ยังไม่มีสลิปรออนุมัติ</p>
          ) : (
            <div style={listGridStyle}>
              {pendingPayments.map(order => (
                <article key={order.order_id} style={itemCardStyle}>
                  <div>
                    <div style={itemTitleStyle}>Order #{order.order_id}</div>
                    <div style={itemMetaStyle}>
                      {order.user.name} {order.user.surname} • {order.user.email}
                    </div>
                    <div style={itemMetaStyle}>
                      {new Date(order.createOrder).toLocaleString()} • {order.total_price} THB
                    </div>
                  </div>

                  {order.payment_bill ? (
                    <a
                      href={`${API_BASE}${order.payment_bill}`}
                      target="_blank"
                      rel="noreferrer"
                      style={linkButtonStyle}
                    >
                      เปิดดูสลิป
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => approvePayment(order.order_id)}
                    style={primaryButtonStyle}
                  >
                    อนุมัติการชำระ
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={{ ...cardStyle, marginTop: 20 }}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Orders</h2>
              <p style={sectionCopyStyle}>ดูออเดอร์ทั้งหมดและอัปเดต workflow จากหลังบ้าน</p>
            </div>
          </div>

          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const nextStatuses = orderWorkflow.filter(
                    status => orderWorkflow.indexOf(status) > orderWorkflow.indexOf(order.latestOrderStatus)
                  )

                  return (
                    <tr key={order.order_id} style={tableRowStyle}>
                      <TableCell>
                        <div style={itemTitleStyle}>#{order.order_id}</div>
                        <div style={itemMetaStyle}>{new Date(order.createOrder).toLocaleString()}</div>
                        <div style={itemMetaStyle}>{order.total_price} THB</div>
                      </TableCell>
                      <TableCell>
                        <div>{order.user.name} {order.user.surname}</div>
                        <div style={itemMetaStyle}>{order.user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "grid", gap: 6 }}>
                          {order.orderItems.map(item => (
                            <div key={item.orderItem_id} style={itemMetaStyle}>
                              {item.product.product_name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textTransform: "capitalize" }}>{order.payment_method.replace("_", " ")}</div>
                        {order.payment_bill ? (
                          <a
                            href={`${API_BASE}${order.payment_bill}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ ...linkButtonStyle, marginTop: 8, display: "inline-block" }}
                          >
                            ดูสลิป
                          </a>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <span style={badgeStyle}>{order.latestOrderStatus}</span>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "grid", gap: 8 }}>
                          {order.latestOrderStatus === "cancelled" || order.latestOrderStatus === "completed" ? (
                            <span style={itemMetaStyle}>ไม่มี action ต่อ</span>
                          ) : nextStatuses.length > 0 ? (
                            nextStatuses.map(status => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateOrderStatus(order.order_id, status)}
                                style={secondaryButtonStyle}
                              >
                                เปลี่ยนเป็น {status}
                              </button>
                            ))
                          ) : (
                            <span style={itemMetaStyle}>รอ action ก่อนหน้า</span>
                          )}
                        </div>
                      </TableCell>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section style={productSectionStyle}>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Add Product</h2>
            <p style={sectionCopyStyle}>เพิ่มสินค้าใหม่พร้อมผูก stat สำหรับระบบแนะนำสินค้า</p>

            <div style={formGridStyle}>
              <input
                value={productForm.product_name}
                onChange={event =>
                  setProductForm(current => ({ ...current, product_name: event.target.value }))
                }
                placeholder="Product name"
                style={inputStyle}
              />
              <input
                value={productForm.category}
                onChange={event =>
                  setProductForm(current => ({ ...current, category: event.target.value }))
                }
                placeholder="Category"
                style={inputStyle}
              />
              <input
                value={productForm.price}
                onChange={event =>
                  setProductForm(current => ({ ...current, price: event.target.value }))
                }
                placeholder="Price"
                type="number"
                style={inputStyle}
              />
              <input
                value={productForm.stock_quantity}
                onChange={event =>
                  setProductForm(current => ({ ...current, stock_quantity: event.target.value }))
                }
                placeholder="Stock"
                type="number"
                style={inputStyle}
              />
              <input
                value={productForm.image_url}
                onChange={event =>
                  setProductForm(current => ({ ...current, image_url: event.target.value }))
                }
                placeholder="Image URL"
                style={inputStyle}
              />
            </div>

            <textarea
              value={productForm.description}
              onChange={event =>
                setProductForm(current => ({ ...current, description: event.target.value }))
              }
              placeholder="Description"
              rows={4}
              style={{ ...inputStyle, marginTop: 14, resize: "vertical", width: "100%" }}
            />

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 14, color: "#735a49", marginBottom: 10 }}>Main stats</div>
              <div style={chipWrapStyle}>
                {allStats.map(stat => {
                  const active = productForm.main_stat.includes(stat)
                  return (
                    <button
                      key={stat}
                      type="button"
                      onClick={() => toggleStat(stat)}
                      style={{
                        ...chipStyle,
                        background: active ? "#6f4e37" : "#fff8f2",
                        color: active ? "#fff9f3" : "#5a4537",
                        borderColor: active ? "#6f4e37" : "#d8c3b5"
                      }}
                    >
                      {stat}
                    </button>
                  )
                })}
              </div>
            </div>

            <button type="button" onClick={createProduct} style={{ ...primaryButtonStyle, marginTop: 18 }}>
              เพิ่มสินค้า
            </button>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Active Products</h2>
            <p style={sectionCopyStyle}>จัดการรายการสินค้าที่เปิดขายอยู่ตอนนี้</p>

            <div style={{ display: "grid", gap: 12 }}>
              {products.map(product => (
                <article key={product.product_id} style={itemCardStyle}>
                  <div style={{ display: "grid", gap: 12 }}>
                    <img
                      src={getProductImage(product)}
                      alt={product.product_name}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 16,
                        border: "1px solid #ead7c8"
                      }}
                    />
                    <div style={itemTitleStyle}>
                      {product.product_name} <span style={itemMetaStyle}>#{product.product_id}</span>
                    </div>
                    <div style={itemMetaStyle}>
                      {product.category} • {product.price} THB • stock {product.stock_quantity}
                    </div>
                    <div style={{ ...itemMetaStyle, marginTop: 6 }}>
                      {product.main_stat.join(", ")}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deactivateProduct(product.product_id)}
                    style={dangerButtonStyle}
                  >
                    ปิดการขาย
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={metricCardStyle}>
      <div style={{ color: "#8d705d", fontSize: 13, letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>{value}</div>
    </div>
  )
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "14px 16px",
        fontSize: 13,
        color: "#846a58",
        fontWeight: 600,
        borderBottom: "1px solid #ead9cd"
      }}
    >
      {children}
    </th>
  )
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        verticalAlign: "top",
        padding: "16px",
        borderBottom: "1px solid #f0e2d8",
        fontSize: 14,
        color: "#3e2d22"
      }}
    >
      {children}
    </td>
  )
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px 60px",
  background: "linear-gradient(180deg, #f6efe6 0%, #efe3d6 100%)",
  color: "#291d16",
  fontFamily: "Georgia, serif"
} as const

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  color: "#967055"
} as const

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  alignItems: "flex-start",
  flexWrap: "wrap"
} as const

const metricGridStyle = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
} as const

const metricCardStyle = {
  ...cardStyle,
  padding: 20
} as const

const statusGridStyle = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
} as const

const statusCardStyle = {
  background: "#fff8f3",
  borderRadius: 18,
  border: "1px solid #ead7c8",
  padding: 16
} as const

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  marginBottom: 18,
  flexWrap: "wrap"
} as const

const sectionTitleStyle = {
  margin: 0,
  fontSize: 28
} as const

const sectionCopyStyle = {
  margin: "8px 0 0",
  color: "#735a49",
  lineHeight: 1.6
} as const

const listGridStyle = {
  display: "grid",
  gap: 14
} as const

const itemCardStyle = {
  display: "grid",
  gap: 12,
  background: "#fff9f4",
  border: "1px solid #ead7c8",
  borderRadius: 20,
  padding: 18
} as const

const itemTitleStyle = {
  fontSize: 18,
  fontWeight: 700
} as const

const itemMetaStyle = {
  color: "#715947",
  fontSize: 14
} as const

const tableWrapStyle = {
  overflowX: "auto"
} as const

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  minWidth: 980
} as const

const tableRowStyle = {
  background: "rgba(255,255,255,0.52)"
} as const

const badgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#f0dfd2",
  color: "#5d4433",
  fontSize: 13,
  textTransform: "capitalize" as const
} as const

const productSectionStyle = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  marginTop: 20
} as const

const formGridStyle = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
} as const

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d9c6b6",
  background: "#fffdfa",
  color: "#2f2118",
  fontSize: 14
} as const

const chipWrapStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap" as const
} as const

const chipStyle = {
  borderRadius: 999,
  border: "1px solid #d8c3b5",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: 13
} as const

const primaryButtonStyle = {
  border: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "linear-gradient(90deg, #7d5233 0%, #b97743 100%)",
  color: "#fffaf5",
  cursor: "pointer",
  fontSize: 14
} as const

const secondaryButtonStyle = {
  border: "1px solid #d7c2b1",
  borderRadius: 999,
  padding: "10px 14px",
  background: "#fff8f2",
  color: "#5a4435",
  cursor: "pointer",
  fontSize: 13
} as const

const dangerButtonStyle = {
  ...secondaryButtonStyle,
  background: "#fff1ef",
  borderColor: "#edc3be",
  color: "#9b3e30"
} as const

const linkButtonStyle = {
  color: "#7d5233",
  textDecoration: "none",
  fontSize: 14
} as const

const errorStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#fdeeee",
  color: "#b42318",
  marginBottom: 16
} as const

const noticeStyle = {
  padding: "12px 16px",
  borderRadius: 14,
  background: "#edf7ef",
  color: "#146c2e",
  marginBottom: 16
} as const

const emptyTextStyle = {
  color: "#735a49",
  margin: 0
} as const
