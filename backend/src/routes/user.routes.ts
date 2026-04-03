import { Router } from "express"
import { authenticate } from "../middleware/auth.middleware"
import { prisma } from "../lib/prisma"

const router = Router()

router.get("/profile", authenticate, (req: any, res) => {
  res.json({
    message: "Protected route success",
    user: req.user
  })
})

// GET /api/user/me
router.get("/me", authenticate, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { user_id: req.user.user_id }
  })

  res.json(user)
})

// PUT /api/user/update
router.put("/update", authenticate, async (req: any, res) => {
  const { name, address, telephone, password, email } = req.body

  const data: any = {
    name,
    address,
    telephone
  }

  if (email) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.user_id !== req.user.user_id) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้ว" })
    }

    data.email = email
  }

  if (password) {
    const bcrypt = require("bcrypt")
    data.password = await bcrypt.hash(password, 10)
  }

  const updated = await prisma.user.update({
    where: { user_id: req.user.user_id },
    data
  })

  res.json(updated)
})

export default router
