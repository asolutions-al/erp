"use client"

// https://nextjs.org/docs/app/guides/progressive-web-apps

import { PropsWithChildren, useEffect } from "react"

function PushNotificationManager() {
  useEffect(() => {
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
    }
  }, [])

  return null
}

const PwaProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <PushNotificationManager />
    </>
  )
}

export { PwaProvider }
