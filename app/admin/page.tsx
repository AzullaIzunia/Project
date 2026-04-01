'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalProducts: number
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  date: string
}

export default function AdminDashboardPage() {
  const [stats] = useState<DashboardStats>({
    totalOrders: 156,
    totalRevenue: 45230,
    pendingOrders: 12,
    totalProducts: 48,
  })

  const [recentOrders] = useState<RecentOrder[]>([
    {
      id: '1',
      customer: 'สมหญิง ใจดี',
      amount: 1450,
      status: 'confirmed',
      date: '2024-01-15',
    },
    {
      id: '2',
      customer: 'วิชัย มงคลเส',
      amount: 2300,
      status: 'shipped',
      date: '2024-01-14',
    },
    {
      id: '3',
      customer: 'นาฏ ศรีสุข',
      amount: 850,
      status: 'pending',
      date: '2024-01-13',
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            แอดมิน แดชบอร์ด
          </h1>
          <p className="text-foreground-muted">
            ยินดีต้อนรับสู่ระบบจัดการของเว็บไซต์
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="p-6 border-accent/20">
            <div className="text-foreground-muted text-sm mb-2">
              รายการสั่งซื้อทั้งหมด
            </div>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalOrders}
            </div>
            <div className="text-primary text-xs mt-2">+12% จากเดือนที่แล้ว</div>
          </Card>

          <Card className="p-6 border-accent/20">
            <div className="text-foreground-muted text-sm mb-2">ยอดขายรวม</div>
            <div className="text-3xl font-bold text-foreground">
              ฿{stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-primary text-xs mt-2">+8% จากเดือนที่แล้ว</div>
          </Card>

          <Card className="p-6 border-accent/20">
            <div className="text-foreground-muted text-sm mb-2">
              รอการยืนยัน
            </div>
            <div className="text-3xl font-bold text-primary">
              {stats.pendingOrders}
            </div>
            <div className="text-foreground-muted text-xs mt-2">
              ต้องการการดำเนินการ
            </div>
          </Card>

          <Card className="p-6 border-accent/20">
            <div className="text-foreground-muted text-sm mb-2">
              สินค้าทั้งหมด
            </div>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalProducts}
            </div>
            <div className="text-primary text-xs mt-2">
              +3 สินค้าใหม่เดือนนี้
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  รายการสั่งซื้อล่าสุด
                </h2>
                <Link href="/admin/orders">
                  <Button variant="ghost" className="text-primary">
                    ดูทั้งหมด →
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-3 px-2 text-foreground-muted text-sm font-medium">
                        ลูกค้า
                      </th>
                      <th className="text-left py-3 px-2 text-foreground-muted text-sm font-medium">
                        จำนวนเงิน
                      </th>
                      <th className="text-left py-3 px-2 text-foreground-muted text-sm font-medium">
                        สถานะ
                      </th>
                      <th className="text-left py-3 px-2 text-foreground-muted text-sm font-medium">
                        วันที่
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-accent/10 hover:bg-accent/5"
                      >
                        <td className="py-4 px-2 text-foreground">
                          {order.customer}
                        </td>
                        <td className="py-4 px-2 text-foreground font-medium">
                          ฿{order.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-200'
                                : order.status === 'confirmed'
                                  ? 'bg-blue-500/20 text-blue-200'
                                  : order.status === 'shipped'
                                    ? 'bg-purple-500/20 text-purple-200'
                                    : 'bg-green-500/20 text-green-200'
                            }`}
                          >
                            {order.status === 'pending'
                              ? 'รอยืนยัน'
                              : order.status === 'confirmed'
                                ? 'ยืนยันแล้ว'
                                : order.status === 'shipped'
                                  ? 'จัดส่งแล้ว'
                                  : 'ส่งถึงแล้ว'}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-foreground-muted text-sm">
                          {new Date(order.date).toLocaleDateString('th-TH')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">
                การจัดการ
              </h2>

              <div className="space-y-3">
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full justify-start">
                    📦 จัดการการสั่งซื้อ
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full justify-start">
                    🛍️ จัดการสินค้า
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    👥 จัดการผู้ใช้
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    ⚙️ การตั้งค่า
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 mt-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <h3 className="font-bold text-foreground mb-2">
                💡 เคล็ดลับเพื่อผู้ดูแล
              </h3>
              <p className="text-foreground-muted text-sm">
                ตรวจสอบรายการสั่งซื้อที่รอการยืนยันและตอบกลับลูกค้าเร็ว ๆ
                นี้เพื่อรักษาคุณภาพของบริการ
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
