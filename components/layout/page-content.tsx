import { FormActionBtns } from "@/components/buttons"
import { PlusCircleIcon } from "lucide-react"
import { Messages } from "next-intl"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

const PageListHeader = async ({
  title,
  button,
  children,
}: {
  title: keyof Messages
  button?: {
    href: string
    text: keyof Messages
  }
  children?: React.ReactNode
}) => {
  const t = await getTranslations()
  return (
    <header className="sticky top-0 z-10 mb-1.5 flex h-16 items-center gap-3 border-b px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">{t(title)}</h1>
      </div>

      <div className="flex items-center gap-2">
        {children}
        {button && (
          <Link href={button.href} passHref>
            <Button size="sm">
              <PlusCircleIcon />
              <span className="sr-only sm:not-sr-only">{t(button.text)}</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

const PageFormHeader = async ({
  title,
  formId,
  children,
}: PropsWithChildren<{
  title: keyof Messages
  formId: FormIdT
}>) => {
  const t = await getTranslations()
  return (
    <header className="sticky top-0 z-10 mb-1.5 flex h-16 items-center gap-3 border-b px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">{t(title)}</h1>
      </div>

      <FormActionBtns formId={formId}>{children}</FormActionBtns>
    </header>
  )
}

const PageContent = async (props: PropsWithChildren) => {
  return <div className="px-1.5 md:px-2 lg:px-2.5">{props.children}</div>
}

export { PageContent, PageFormHeader, PageListHeader }
