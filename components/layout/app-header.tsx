import Image from "next/image"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

const AppHeader = async () => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Image src="/logo.png" alt="logo" width={30} height={30} />
      <Separator orientation="vertical" className="mx-2 h-4" />
    </header>
  )
}

export { AppHeader }
