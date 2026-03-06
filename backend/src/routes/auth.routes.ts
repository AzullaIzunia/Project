import { Router } from "express"
import { registerUser, loginUser } from "../services/auth.service"
import { forgotPassword, verifyOTP, resetPassword } from "../services/auth.service"

const router = Router()

// Route for user register
router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password, address, telephone } = req.body

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const user = await registerUser(
      name,
      surname,
      email,
      password,
      address,
      telephone
    )

    res.status(201).json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Route for user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const result = await loginUser(email, password)

    res.json(result)
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
})

// Route for forgot password
router.post("/forgot-password", async (req, res) => {
  try {

    const { email } = req.body

    const result = await forgotPassword(email)

    res.json(result)

  } catch (err:any) {

    res.status(400).json({ error: err.message })

  }
})

// Route for verify OTP
router.post("/verify-otp", async (req, res) => {
  try {

    const { token, otp } = req.body

    const email = verifyOTP(token, otp)

    res.json({ email })

  } catch (err:any) {

    res.status(400).json({ error: err.message })

  }
})

// Route for reset password
router.post("/reset-password", async (req, res) => {
  try {

    const { token, newPassword } = req.body

    const result = await resetPassword(token, newPassword)

    res.json(result)

  } catch (err:any) {

    res.status(400).json({ error: err.message })

  }
})

export default router