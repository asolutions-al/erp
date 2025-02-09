import { BackButton } from "@/components/buttons"
import { cn } from "@/lib/utils"
import { Messages } from "next-intl"
import { getTranslations } from "next-intl/server"
import { ReactNode } from "react"

const PageHeader = async ({
  title,
  className = "",
  rightComp,
}: {
  title: keyof Messages
  className?: string
  rightComp?: ReactNode
}) => {
  const t = await getTranslations()
  return (
    <div className={cn("mx-auto flex max-w-4xl items-center", className)}>
      <BackButton />
      <h1 className="ml-2 text-xl font-semibold">{t(title)}</h1>

      {rightComp && <div className="ml-auto">{rightComp}</div>}
    </div>
  )
}

export { PageHeader }
