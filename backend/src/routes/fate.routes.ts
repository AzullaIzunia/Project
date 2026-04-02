import { Router } from "express"
import { prisma } from "../lib/prisma"
import { authenticate } from "../middleware/auth.middleware"
import { allowedStats } from "../constants/stats"
import { Prisma } from "@prisma/client"

const router = Router()

router.get("/history", authenticate, async (req: any, res) => {
  try {
    const userId = req.user.user_id

    const results = await prisma.fateResult.findMany({
      where: { user_id: userId },
      include: {
        fate: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.json(results)
  } catch (error) {
    console.error("FATE HISTORY ERROR:", error)
    res.status(500).json({ error: "Cannot fetch fate history" })
  }
})

router.post("/draw", authenticate, async (req: any, res) => {
  try {
    const userId = req.user.user_id
    const { witch_id, choices } = req.body

    //validate choices
    if (!choices || choices.length !== 3) {
      return res.status(400).json({ error: "Must choose 3 stats" })
    }

    for (const c of choices) {
      if (!allowedStats.includes(c.stat)) {
        return res.status(400).json({ error: `Invalid stat ${c.stat}` })
      }

      if (!["plus", "minus"].includes(c.type)) {
        return res.status(400).json({ error: "Invalid type" })
      }
    }

    //get witch
    const witch = await prisma.witch.findUnique({
      where: { witch_id }
    })

    if (!witch) {
      return res.status(404).json({ error: "Witch not found" })
    }

    //base stats
    const stats: any = {
      Protection: witch.sanctuary_stat,
      Purity: witch.purity_stat,
      Telluric: witch.telluric_stat,
      Ethereality: witch.ethereality_stat,
      Omniscience: witch.omniscience_stat,
      Healing: witch.healing_stat,
      Wealth: witch.wealth_stat,
      Abundance: witch.abundance_stat,
      Intelligence: witch.intelligence_stat,
      Creativity: witch.creativity_stat,
      Affection: witch.affection_stat,
      Passion: witch.passion_stat
    }

    //apply modifier
    choices.forEach((c: any) => {
      if (c.type === "plus") stats[c.stat] += 5
      if (c.type === "minus") stats[c.stat] -= 5
    })

    //special event (8%)
    let specialEvent: string | null = null
    const rand = Math.floor(Math.random() * 100) + 1

    if (rand <= 8) {
      const events = ["boost_lowest", "reverse"]
      specialEvent = events[Math.floor(Math.random() * events.length)]
    }

    // apply event
    if (specialEvent === "boost_lowest") {
      const lowest = Object.entries(stats).sort((a:any,b:any)=>a[1]-b[1])[0]
      stats[lowest[0]] += 10
    }

    if (specialEvent === "reverse") {
      Object.keys(stats).forEach(k => {
        stats[k] = 100 - stats[k]
      })
    }

    //sort stats
    const sorted = Object.entries(stats)
      .sort((a: any, b: any) => a[1] - b[1])

    const lowestThree = sorted.slice(0, 3)

    // 🎯 สร้าง choices
    const drawChoices = lowestThree.map(([stat, value]) => ({
      stat,
      value,
      lowest_stats: lowestThree,
      all_stats: stats
    }))

    // 💾 save session
    const session = await prisma.drawSession.create({
      data: {
        user_id: userId,
        witch_id,
        choices: drawChoices as Prisma.InputJsonValue
      }
    })

    // 🚀 return ใหม่
    res.json({
      session_id: session.session_id,
      choices: drawChoices,
      special_event: specialEvent
    })

  } catch (error) {
    console.error("DRAW ERROR:", error)
    res.status(500).json({ error: "Draw failed" })
  }
})

router.post("/choose", authenticate, async (req: any, res) => {
  try {
    const userId = req.user.user_id
    const { session_id, chosen_stat } = req.body

    const session = await prisma.drawSession.findUnique({
      where: { session_id }
    })

    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }

    const choices: any[] = session.choices as any[]
    const selected = choices.find(c => c.stat === chosen_stat)

    if (!selected) {
      return res.status(400).json({ error: "Invalid choice" })
    }

    const fate = await prisma.fate.findUnique({
      where: { stat_name: chosen_stat }
    })

    if (!fate) {
      return res.status(404).json({ error: "Fate not found" })
    }

    const descriptions = [
      fate.result_des1,
      fate.result_des2,
      fate.result_des3
    ]

    const finalResult =
      descriptions[Math.floor(Math.random() * descriptions.length)]

    const fateResult = await prisma.fateResult.create({
      data: {
        user_id: userId,
        witch_id: session.witch_id,
        drawn_stat: chosen_stat,
        stat_result: chosen_stat,
        result: finalResult,
        lowest_stats: selected.lowest_stats as Prisma.InputJsonValue,
        all_stats: selected.all_stats as Prisma.InputJsonValue
      }
    })

    await prisma.drawSession.delete({
      where: { session_id }
    })

    res.json({
      message: "Choose success",
      result_id: fateResult.result_id,
      stone: fate.stone,
      result: finalResult
    })

  } catch (error: any) {
  console.error("CHOOSE ERROR:", error)
  res.status(500).json({ error: error.message })
}
})

// 🎯 Recommend products based on fate result
router.get("/recommend/:result_id", authenticate, async (req, res) => {
  try {
    const resultId = Number(req.params.result_id)

    const result = await prisma.fateResult.findUnique({
      where: { result_id: resultId }
    })

    if (!result) {
      return res.status(404).json({ error: "Result not found" })
    }

    const products = await prisma.product.findMany({
        where: {
    main_stat: {
      has: result.drawn_stat   
    },
    isActive: true
    }
    })

    res.json({
      stat: result.drawn_stat,
      recommended_products: products
    })

  } catch (error) {
    console.error("RECOMMEND ERROR:", error)
    res.status(500).json({ error: "Cannot recommend products" })
  }
})

export default router
