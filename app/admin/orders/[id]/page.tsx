'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { StatusBadge } from '@/components/ui/status-badge'

interface AdminOrderDetail {
  id: string
  orderNumber: string
  customer: string
  email: string
  phone: string
  address: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  paymentStatus: 'unpaid' | 'paid' | 'partial'
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  total: number
  date: string
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()

  const order: AdminOrderDetail = {
    id: params.id,
    orderNumber: `ORD-2024-${params.id}`,
    customer: 'สมหญิง ใจดี',
    email: 'somying@example.com',
    phone: '08xxxxxxxx',
    address: 'ที่อยู่ ซ.ถ.ร.ม.',
    status: 'confirmed',
    paymentStatus: 'paid',
    items: [
      { name: 'หินมงคล-แพทำรี่', price: 650, quantity: 2 },
      { name: 'เทียนหอม-ราคา', price: 150, quantity: 1 },
    ],
    total: 1450,
    date: '2024-01-15',
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-foreground-muted hover:text-foreground"
          >
            ← กลับ
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {order.orderNumber}
                  </h1>
                  <p className="text-foreground-muted">
                    {new Date(order.date).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-accent/20 pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  ข้อมูลลูกค้า
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-foreground-muted text-sm mb-1">ชื่อ</p>
                    <p className="text-foreground font-medium">
                      {order.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-sm mb-1">
                      เบอร์โทรศัพท์
                    </p>
                    <p className="text-foreground font-medium">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-sm mb-1">อีเมล</p>
                    <p className="text-foreground font-medium">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-foreground-muted text-sm mb-1">ที่อยู่</p>
                    <p className="text-foreground font-medium">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-accent/20 pt-6 mt-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  รายการสินค้า
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-3 border-b border-accent/10 last:border-0"
                    >
                      <div>
                        <p className="text-foreground font-medium">
                          {item.name}
                        </p>
                        <p className="text-foreground-muted text-sm">
                          จำนวน: {item.quantity}
                        </p>
                      </div>
                      <p className="text-foreground font-semibold">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Status Management */}
            <Card className="p-6 bg-accent/5 border-accent/20">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                อัปเดตสถานะ
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  รอยืนยัน
                </Button>
                <Button variant="outline" size="sm">
                  ยืนยัน
                </Button>
                <Button variant="outline" size="sm">
                  จัดส่ง
                </Button>
                <Button variant="outline" size="sm">
                  ส่งถึง
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                สถานะการชำระเงิน
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-foreground-muted text-sm mb-2">
                    สถานะ
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <span className="text-foreground font-medium">
                      {order.paymentStatus === 'paid'
                        ? 'ชำระแล้ว'
                        : 'รอการยืนยัน'}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-accent/20">
                  <p className="text-foreground-muted text-sm mb-2">ยอดรวม</p>
                  <p className="text-3xl font-bold text-primary">
                    ฿{order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                สรุปการสั่งซื้อ
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-foreground-muted">
                  <span>วันที่สั่ง:</span>
                  <span className="text-foreground">
                    {new Date(order.date).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>เลขที่คำสั่ง:</span>
                  <span className="text-foreground font-mono">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>เลขที่ ID:</span>
                  <span className="text-foreground font-mono">{order.id}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                พิมพ์
              </Button>
              <Button variant="outline" className="flex-1">
                ส่งอีเมล
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
