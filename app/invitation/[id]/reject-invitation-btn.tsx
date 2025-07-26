"use client"

import { Button } from "@/components/ui/button"
import { rejectInvitation } from "@/db/app/actions"
import { LoaderIcon, XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { redirect } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  id: string
}

const RejectInvitationBtn = ({ id }: Props) => {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    setIsLoading(true)
    const result = await rejectInvitation(id)

    if (result.error) {
      toast.error(result.error.message)
    }

    if (result.success) {
      toast.success(t("Invitation rejected"))
      redirect("/")
    }

    setIsLoading(false)
  }

  return (
    <Button size="lg" onClick={onClick} disabled={isLoading} variant="outline">
      {isLoading ? <LoaderIcon className="animate-spin" /> : <XCircleIcon />}
      {t("Decline")}
    </Button>
  )
}

export { RejectInvitationBtn }
