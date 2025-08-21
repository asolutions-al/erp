import { OrgCard } from "@/components/cards"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { db } from "@/db/app/instance"
import { getUserId } from "@/db/auth/loaders"
import { orgMember } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const Page = async () => {
  const t = await getTranslations()
  const userId = await getUserId()

  const orgs = await db.query.orgMember.findMany({
    where: eq(orgMember.userId, userId),
    with: {
      organization: {
        with: {
          units: {
            columns: {
              id: true,
            },
          },
          orgMembers: {
            columns: {
              id: true,
            },
          },
        },
      },
    },
  })

  return (
    <>
      <PageHeader
        title="Organizations"
        backButtonDisabled
        rightComp={
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" disabled>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t("Create a new organization")}
                  </span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("Organization creation will be available soon")}</p>
            </TooltipContent>
          </Tooltip>
        }
        className="my-4"
      />

      <div className="mb-4 text-center text-sm text-muted-foreground">
        {t(
          "Click on any organization below to enter and manage its operations"
        )}
      </div>
      <div className="mx-auto grid max-w-4xl items-center gap-4 sm:grid-cols-2">
        {orgs.map(({ organization }) => (
          <Link key={organization.id} href={`/o/${organization.id}/overview`}>
            <OrgCard
              data={{
                ...organization,
                unitCount: organization.units.length,
                memberCount: organization.orgMembers.length,
              }}
            />
          </Link>
        ))}
      </div>
    </>
  )
}

export default Page
