import { OrgCard } from "@/components/cards"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { organization } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const Page = async () => {
  const t = await getTranslations()
  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  const userId = user!.id

  const orgs = await db.query.organization.findMany({
    where: eq(organization.ownerId, userId),
  })

  return (
    <>
      <PageHeader
        title="Choose organization"
        rightComp={
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" className="h-8 gap-1" disabled>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t("Create a new organization")}
                  </span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming soon</p>
            </TooltipContent>
          </Tooltip>
        }
        className="my-4"
      />
      <div className="mx-auto grid max-w-4xl items-center gap-4 sm:grid-cols-2">
        {orgs.map((org) => (
          <Link key={org.id} href={`/o/${org.id}/unit/list`}>
            <OrgCard data={org} />
          </Link>
        ))}
      </div>
    </>
  )
}

export default Page
