import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider, TranslationProvider } from "@/providers"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans"
import { PropsWithChildren } from "react"
import "./globals.css"

export const metadata = {
  metadataBase: new URL(process.env.APP_URL!),
  title: "Erp Asolutions",
  description: "Menaxho biznesin tënd.",
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
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
  )
}
