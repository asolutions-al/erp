// https://github.com/shadcn-ui/ui/issues/86#issuecomment-2241817826
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

const Tip = ({
  content,
  children,
  className,
}: React.PropsWithChildren<{
  content: string | React.ReactNode
  className?: string
}>) => {
  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn("cursor-pointer", className)}
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onTouchStart={() => setOpen(!open)}
            onKeyDown={(e) => {
              e.preventDefault()
              e.key === "Enter" && setOpen(!open)
            }}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent className={!content ? "hidden" : ""}>
          <span className="inline-block">{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tip }
