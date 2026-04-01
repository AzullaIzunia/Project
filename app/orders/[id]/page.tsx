'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { StatusBadge } from '@/components/ui/status-badge'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  date: string
  total: number
  items: OrderItem[]
  paymentMethod: string
  slipUpload?: string
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching order data
    const mockOrder: Order = {
      id: params.id,
      orderNumber: `ORD-2024-${params.id}`,
      status: 'confirmed',
      date: new Date().toLocaleDateString('th-TH'),
      total: 1450,
      items: [
        {
          id: '1',
          name: 'หินมงคล-แพทำรี่',
          price: 650,
          quantity: 2,
          image: '/images/stone1.jpg',
        },
        {
          id: '2',
          name: 'เทียนหอม-ราคา',
          price: 150,
          quantity: 1,
          image: '/images/candle1.jpg',
        },
      ],
      paymentMethod: 'โอนเงินธนาคาร',
      slipUpload: '/uploads/slip-001.jpg',
    }
    setOrder(mockOrder)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-foreground-muted">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-foreground-muted">ไม่พบการสั่งซื้อ</p>
          <Link href="/orders">
            <Button className="mt-4">กลับไปดูรายการสั่งซื้อ</Button>
          </Link>
        </div>
      </div>
    )
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
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {order.orderNumber}
                  </h1>
                  <p className="text-foreground-muted">{order.date}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="border-t border-accent/20 pt-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  สินค้าในการสั่งซื้อ
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-accent/20 last:border-0"
                    >
                      <div className="w-20 h-20 bg-accent/10 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-foreground-muted">
                          จำนวน: {item.quantity}
                        </p>
                        <p className="text-primary font-semibold mt-2">
                          ฿{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.paymentMethod && (
                <div className="border-t border-accent/20 pt-6 mt-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    วิธีการชำระเงิน
                  </h2>
                  <p className="text-foreground">{order.paymentMethod}</p>
                  {order.slipUpload && (
                    <p className="text-foreground-muted text-sm mt-2">
                      อัปโหลดสลิปแล้ว ✓
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                สรุปการสั่งซื้อ
              </h2>

              <div className="space-y-3 pb-6 border-b border-accent/20">
                <div className="flex justify-between text-foreground">
                  <span>ยอดรวม:</span>
                  <span>฿{order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>ค่าจัดส่ง:</span>
                  <span>฿50</span>
                </div>
                <div className="flex justify-between text-foreground-muted text-sm">
                  <span>ภาษี:</span>
                  <span>฿0</span>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">
                  รวมทั้งสิ้น:
                </span>
                <span className="text-2xl font-bold text-primary">
                  ฿{(order.total + 50).toLocaleString()}
                </span>
              </div>

              {order.status === 'pending' && (
                <Button className="w-full mt-6">ยืนยันการสั่งซื้อ</Button>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
