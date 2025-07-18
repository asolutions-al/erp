"use client"

// https://nextjs.org/docs/app/guides/progressive-web-apps

import { PropsWithChildren, useEffect } from "react"

const isDev = process.env.NODE_ENV === "development"

function ServiceWorkerRegister() {
  useEffect(() => {
    console.log("Registering Service Worker...")
    if ("serviceWorker" in navigator) {
      console.log("Service Worker is supported")
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          )
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    } else {
      console.warn("Service Worker is not supported in this browser")
    }
  }, [])

  return null
}

const PwaProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      {isDev ? null : <ServiceWorkerRegister />}
    </>
  )
}

export { PwaProvider }
