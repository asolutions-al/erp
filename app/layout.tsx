import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appUrl } from "@/contants/consts"
import { ThemeProvider, TranslationProvider } from "@/providers"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans"
import { PropsWithChildren } from "react"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "Invoice",
  description: "The fastest way to generate invoices",
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <TranslationProvider>
        <TooltipProvider>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster className="print:hidden" />
            </ThemeProvider>
            <SpeedInsights />
            <Analytics mode="production" />
          </body>
        </TooltipProvider>
      </TranslationProvider>
    </html>
  )
}
