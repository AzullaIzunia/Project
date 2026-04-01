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
  const { name, address, telephone, password } = req.body

  const data: any = {
    name,
    address,
    telephone
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