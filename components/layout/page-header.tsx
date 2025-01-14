import { Messages } from "@/global"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import { ReactNode } from "react"
import { BackButton } from "../button"

const PageHeader = async ({
  title,
  className = "",
  renderRight,
}: {
  title: keyof Messages
  className?: string
  renderRight?: () => ReactNode
}) => {
  const t = await getTranslations()
  return (
    <div className={cn("flex items-center gap-4 mx-auto max-w-4xl", className)}>
      <BackButton />
      <h1 className="font-semibold text-xl">{t(title)}</h1>

      {renderRight && <div className="ml-auto">{renderRight()}</div>}
    </div>
  )
}

export { PageHeader }
