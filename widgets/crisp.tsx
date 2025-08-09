"use client"

import { Crisp } from "crisp-sdk-web"
import { useEffect } from "react"

const CrispWidget = () => {
  useEffect(() => {
    Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID!)
    Crisp.setZIndex(10)
  }, [])
  return null
}

export { CrispWidget }
