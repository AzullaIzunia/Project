import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authenticate, requireAdmin } from "../middleware/auth.middleware"
import { allowedTrackingStatus } from "../constants/trackingStatus"

const router = Router()

//Admin - Update Tracking Status
router.post("/:id/tracking", authenticate, requireAdmin, async (req, res) => {
  try {
    const orderItemId = Number(req.params.id)
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: "Status is required" })
    }

    if (!allowedTrackingStatus.includes(status)) {
      return res.status(400).json({
        error: `Invalid tracking status. Allowed: ${allowedTrackingStatus.join(", ")}`
      })
    }

    const orderItem = await prisma.orderItem.update({
      where: { orderItem_id: orderItemId },
      data: {
        tracking_status: {
          push: status
        }
      }
    })

    res.json({
      message: "Tracking status updated",
      tracking_status: orderItem.tracking_status
    })

  } catch (error) {
    console.error("UPDATE TRACKING ERROR:", error)
    res.status(500).json({ error: "Cannot update tracking" })
  }
})

export default router