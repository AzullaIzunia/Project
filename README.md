# DUDUANG - SE Project 2025
ระบบดูดวงและร้านค้าออนไลน์ (Tarot + E-commerce)  
รายวิชา Software Engineering

## ภาพรวมระบบ
โปรเจกต์นี้เป็นระบบ Full-stack แยก `frontend` และ `backend` ชัดเจน โดยมีฟีเจอร์หลักดังนี้

- ผู้ใช้สมัครสมาชิก, เข้าสู่ระบบ, ลืมรหัสผ่าน (OTP ทางอีเมล)
- ผู้ใช้ดูดวงแบบโต้ตอบ (`draw -> choose -> result/recommend`)
- ระบบแนะนำสินค้าอิงผลดูดวง
- ระบบตะกร้า, สั่งซื้อ, ชำระเงิน (PromptPay slip / mock credit card)
- ผู้ใช้ติดตามคำสั่งซื้อและประวัติการดูดวง
- แอดมินดูแดชบอร์ด, จัดการคำสั่งซื้อ, ตรวจสลิป, จัดการสินค้า

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- JWT + bcrypt
- Multer (อัปโหลดสลิป)
- Nodemailer (ส่ง OTP)

### Database
- PostgreSQL

## โครงสร้างโปรเจกต์
```text
SE-Project-2025/
├── frontend/                  # Next.js app
│   ├── app/                   # routes/pages
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/                   # Express API + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── constants/
│   │   └── server.ts
│   └── package.json
└── README.md
```

## ฟีเจอร์หลักตามบทบาท

### ผู้ใช้ (User)
- สมัครสมาชิก / ล็อกอิน / ลืมรหัสผ่านด้วย OTP
- ดูดวง (ตอบคำถาม, เลือกไพ่, ดูคำทำนาย)
- ดูสินค้าแนะนำจากผลดวง
- เลือกสินค้า, เพิ่มตะกร้า, ยืนยันคำสั่งซื้อ
- ชำระเงินด้วย PromptPay (แนบสลิป) หรือ Credit Card (mock)
- ดูประวัติคำสั่งซื้อและสถานะ
- แก้ไขโปรไฟล์ (รวมอีเมลและรหัสผ่าน)

### ผู้ดูแลระบบ (Admin)
- Dashboard ภาพรวมคำสั่งซื้อและรายได้
- ดูรายการสั่งซื้อทั้งหมดและสถานะล่าสุด
- อัปเดต workflow สถานะคำสั่งซื้อ
- ตรวจสลิปและอนุมัติการชำระเงิน
- เพิ่ม/แก้ไข/ปิดการใช้งานสินค้า (soft delete)

## เส้นทางหน้าเว็บหลัก (Frontend Routes)
- `/` หน้าแรก
- `/login`, `/register`, `/forgot-password`
- `/draw`, `/choose`, `/result`, `/recommend/[id]`
- `/shop`, `/products`, `/products/[id]`
- `/cart`, `/confirm`, `/payment`, `/upload-slip`
- `/pay-success`, `/pay-fail`
- `/orders`, `/orders/[id]`
- `/profile`, `/fate-history`
- `/admin`, `/admin/products`

## API หลัก (Backend)
Base URL ค่าเริ่มต้น: `http://localhost:5001`

- Auth: `/api/auth/*`
- User: `/api/user/*`
- Admin: `/api/admin/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Fate: `/api/fate/*`
- Upload static: `/uploads/*`

## การติดตั้งและรัน (Local)

### 1) ติดตั้ง dependencies
```bash
cd /Users/azul/SE2/SE-Project-2025
npm run install:all
```

### 2) ตั้งค่า environment (backend)
สร้างไฟล์ `/Users/azul/SE2/SE-Project-2025/backend/.env`

```env
PORT=5001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/duduang"
JWT_SECRET="your_super_secret_key"

# Optional: ใช้เมื่อเปิดฟีเจอร์ลืมรหัสผ่าน OTP ผ่านอีเมล
EMAIL_USER="your_gmail@gmail.com"
EMAIL_PASS="your_gmail_app_password"
```

### 3) ตั้งค่า environment (frontend)
สร้างไฟล์ `/Users/azul/SE2/SE-Project-2025/frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5001"
```

### 4) รัน Prisma migration
```bash
cd /Users/azul/SE2/SE-Project-2025/backend
npx prisma migrate dev
```

### 5) เปิดระบบ
Terminal 1:
```bash
cd /Users/azul/SE2/SE-Project-2025/backend
npm run dev
```

Terminal 2:
```bash
cd /Users/azul/SE2/SE-Project-2025/frontend
npm run dev
```

เปิดใช้งาน:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

## การเทสฐานข้อมูลด้วย Docker (แนะนำ)
หากยังไม่มี PostgreSQL local สามารถใช้ Docker เฉพาะ DB ได้

```bash
docker run --name duduang-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=duduang \
  -p 5432:5432 \
  -d postgres:16
```

จากนั้นใช้ `DATABASE_URL` ตามตัวอย่างด้านบน แล้วรัน migration ได้ทันที

## Scripts ที่ใช้บ่อย
ที่ root (`/Users/azul/SE2/SE-Project-2025`):

```bash
npm run dev            # รัน frontend
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run lint:frontend
```

ที่ frontend:
```bash
npm run dev
npm run build -- --webpack
npm run lint
```

ที่ backend:
```bash
npm run dev
```

## หมายเหตุสำคัญ
- สถานะคำสั่งซื้อถูกเก็บเป็นประวัติในรูปแบบ array (push status ใหม่ตาม workflow)
- การลบสินค้าคือการ `soft delete` (`isActive=false`)
- หน้าแอดมินต้องล็อกอินด้วยบัญชีที่เป็น admin เท่านั้น
