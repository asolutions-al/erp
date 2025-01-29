import Image from "next/image"
import Link from "next/link"
import { SidebarTrigger } from "../ui/sidebar"

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href={`/org/list`}>
        <Image src="/logo.png" alt="logo" width={30} height={30} />
      </Link>

      <div className="ml-auto md:hidden">
        <SidebarTrigger />
      </div>
    </header>
  )
}

export { AppHeader }
