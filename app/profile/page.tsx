'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/navbar'

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  zipcode: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'ชื่อ นามสกุล',
    email: 'user@example.com',
    phone: '08xxxxxxxx',
    address: 'ที่อยู่ ซ.ถ.ร.ม.',
    city: 'เมืองกรุงเทพฯ',
    province: 'กรุงเทพมหานคร',
    zipcode: '10000',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <h1 className="text-4xl font-bold text-foreground mb-12">โปรไฟล์ของฉัน</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground text-center">
                {profile.name}
              </h2>
              <p className="text-foreground-muted text-center text-sm">
                {profile.email}
              </p>

              <nav className="mt-6 space-y-2">
                <Link href="/orders">
                  <Button variant="ghost" className="w-full justify-start">
                    📦 รายการสั่งซื้อ
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    👤 โปรไฟล์
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300"
                >
                  🚪 ออกจากระบบ
                </Button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  ข้อมูลส่วนตัว
                </h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>แก้ไข</Button>
                )}
              </div>

              {isEditing ? (
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-foreground font-medium mb-2">
                        ชื่อ-นามสกุล
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-accent/10 border-accent/30"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-2">
                        เบอร์โทรศัพท์
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-accent/10 border-accent/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-foreground font-medium mb-2">
                      อีเมล
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-accent/10 border-accent/30"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground font-medium mb-2">
                      ที่อยู่
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-accent/10 border-accent/30"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-foreground font-medium mb-2">
                        เมือง
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-accent/10 border-accent/30"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-2">
                        จังหวัด
                      </label>
                      <Input
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="bg-accent/10 border-accent/30"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-2">
                        รหัสไปรษณีย์
                      </label>
                      <Input
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        className="bg-accent/10 border-accent/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave}>บันทึก</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      ยกเลิก
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-foreground-muted text-sm mb-1">
                        ชื่อ-นามสกุล
                      </p>
                      <p className="text-foreground text-lg font-medium">
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground-muted text-sm mb-1">
                        เบอร์โทรศัพท์
                      </p>
                      <p className="text-foreground text-lg font-medium">
                        {profile.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-foreground-muted text-sm mb-1">อีเมล</p>
                    <p className="text-foreground text-lg font-medium">
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-foreground-muted text-sm mb-1">ที่อยู่</p>
                    <p className="text-foreground text-lg font-medium">
                      {profile.address}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 pt-4 border-t border-accent/20">
                    <div>
                      <p className="text-foreground-muted text-sm mb-1">เมือง</p>
                      <p className="text-foreground font-medium">
                        {profile.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground-muted text-sm mb-1">
                        จังหวัด
                      </p>
                      <p className="text-foreground font-medium">
                        {profile.province}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground-muted text-sm mb-1">
                        รหัสไปรษณีย์
                      </p>
                      <p className="text-foreground font-medium">
                        {profile.zipcode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
