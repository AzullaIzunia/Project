"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollRevealAnimator() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add("reveal-ready")

    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add("is-visible")
            observer?.unobserve(entry.target)
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.14,
        }
      )
    }

    const register = (element: HTMLElement) => {
      if (element.classList.contains("is-visible")) return
      if (!observer) {
        element.classList.add("is-visible")
        return
      }
      observer.observe(element)
    }

    const existing = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    for (const element of existing) {
      register(element)
    }

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (!(addedNode instanceof HTMLElement)) continue
          if (addedNode.matches("[data-reveal]")) {
            register(addedNode)
          }
          const descendants = addedNode.querySelectorAll<HTMLElement>("[data-reveal]")
          for (const element of descendants) {
            register(element)
          }
        }
      }
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    const fallbackTimer = window.setTimeout(() => {
      const pending = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
      for (const element of pending) {
        element.classList.add("is-visible")
      }
    }, 1800)

    return () => {
      window.clearTimeout(fallbackTimer)
      mutationObserver.disconnect()
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
