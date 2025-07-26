"use client"

import { Button } from "@/components/ui/button"
import { acceptInvitation } from "@/db/app/actions/invitation"
import { CheckCircleIcon, LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { redirect } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  id: string
}

const AcceptInvitationBtn = ({ id }: Props) => {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    setIsLoading(true)
    const result = await acceptInvitation(id)

    if (result.error) {
      toast.error(result.error.message)
    }

    if (result.success) {
      toast.success(t("Invitation accepted"))
      redirect("/")
    }

    setIsLoading(false)
  }

  return (
    <Button size="lg" onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <CheckCircleIcon />
      )}
      {t("Join organization")}
    </Button>
  )
}

export { AcceptInvitationBtn }
