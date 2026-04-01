'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/navbar'
import { useState } from 'react'

interface AdminOrder {
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  date: string
  paymentStatus: 'unpaid' | 'paid' | 'partial'
}

export default function AdminOrdersPage() {
  const [orders] = useState<AdminOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'สมหญิง ใจดี',
      amount: 1450,
      status: 'confirmed',
      date: '2024-01-15',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'วิชัย มงคลเส',
      amount: 2300,
      status: 'shipped',
      date: '2024-01-14',
      paymentStatus: 'paid',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'นาฏ ศรีสุข',
      amount: 850,
      status: 'pending',
      date: '2024-01-13',
      paymentStatus: 'unpaid',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.includes(searchTerm) ||
      order.customer.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            จัดการการสั่งซื้อ
          </h1>
          <p className="text-foreground-muted">ตรวจสอบและจัดการรายการสั่งซื้อทั้งหมด</p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="ค้นหาเลขที่คำสั่ง หรือชื่อลูกค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-accent/10 border-accent/30"
            />
            <Button>ค้นหา</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent/20">
                  <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">
                    เลขที่คำสั่ง
                  </th>
                  <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">
                    ลูกค้า
                  </th>
                  <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">
                    จำนวนเงิน
                  </th>
                  <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">
                    สถานะ
                  </th>
                  <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">
                    ชำระเงิน
                  </th>
                  <th className="text-left py-3 px-4 text-foreground-muted text-sm font-medium">
                    วันที่
                  </th>
                  <th className="text-right py-3 px-4 text-foreground-muted text-sm font-medium">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-accent/10 hover:bg-accent/5"
                  >
                    <td className="py-4 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {order.customer}
                    </td>
                    <td className="py-4 px-4 text-foreground font-medium">
                      ฿{order.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-500/20 text-green-200'
                            : order.paymentStatus === 'partial'
                              ? 'bg-yellow-500/20 text-yellow-200'
                              : 'bg-red-500/20 text-red-200'
                        }`}
                      >
                        {order.paymentStatus === 'paid'
                          ? 'ชำระแล้ว'
                          : order.paymentStatus === 'partial'
                            ? 'ชำระบางส่วน'
                            : 'ยังไม่ชำระ'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-foreground-muted text-sm">
                      {new Date(order.date).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button size="sm" variant="outline">
                          ดูรายละเอียด
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-foreground-muted">
              ไม่พบการสั่งซื้อที่ตรงกัน
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
