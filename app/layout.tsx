import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { appUrl } from "@/contants/consts"
import { ThemeProvider, TranslationProvider } from "@/providers"
import { PwaProvider } from "@/providers/pwa"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans"
import { PropsWithChildren } from "react"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "Erp Asolutions",
  description: "Menaxho biznesin tënd.",
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <PwaProvider>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <TranslationProvider>
          <TooltipProvider>
            <body>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster className="print:hidden" />
              </ThemeProvider>
              <SpeedInsights debug={false} />
              <Analytics debug={false} />
            </body>
          </TooltipProvider>
        </TranslationProvider>
      </html>
    </PwaProvider>
  )
}
