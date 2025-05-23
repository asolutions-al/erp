import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mapRangeToPrevStartEnd, mapRangeToStartEnd } from "@/contants/maps"
import { db } from "@/db/app/instance"
import { formatNumber } from "@/lib/utils"
import { customer, invoice, productInventory } from "@/orm/app/schema"
import { calcGrowth } from "@/utils/calc"
import { and, count, desc, eq, gte, lte } from "drizzle-orm"
import { TrendingDownIcon, TrendingUpDown, TrendingUpIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ unitId: string; range: RangeT }>
  searchParams: Promise<{ range?: RangeT }>
}

const NewCustomersCard = async ({
  count,
  growth,
}: {
  count: number
  growth: GrowthT
}) => {
  const t = await getTranslations()
  const { diffPercent, status, diff } = growth

  const Icon = {
    equal: TrendingUpDown,
    up: TrendingUpIcon,
    down: TrendingDownIcon,
  }[status]
  const sign = {
    equal: "",
    up: "+",
    down: "-",
  }[status]

  return (
    <Card>
      <CardHeader className="relative p-6">
        <CardDescription>{t("New customers")}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {count}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <Icon className="size-3" />
            {sign}
            {Math.abs(diffPercent)}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {
            {
              equal: t("No change this period"),
              up: t("Up by {diff} this period", {
                diff: formatNumber(Math.abs(diff)),
              }),
              down: t("Down by {diff} this period", {
                diff: formatNumber(Math.abs(diff)),
              }),
            }[status]
          }
          <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          {
            {
              equal: t("Acquisition is the same"),
              up: t("Acquisition is on track"),
              down: t("Acquisition needs attention"),
            }[status]
          }
        </div>
      </CardFooter>
    </Card>
  )
}

const TotalSalesCard = async ({
  count,
  growth,
}: {
  count: number
  growth: GrowthT
}) => {
  const t = await getTranslations()
  const { diffPercent, status, diff } = growth

  const Icon = {
    equal: TrendingUpDown,
    up: TrendingUpIcon,
    down: TrendingDownIcon,
  }[status]
  const sign = {
    equal: "",
    up: "+",
    down: "-",
  }[status]

  return (
    <Card>
      <CardHeader className="relative p-6">
        <CardDescription>{t("Total sales")}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {formatNumber(count)}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <Icon className="size-3" />
            {sign}
            {formatNumber(Math.abs(diffPercent))}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {
            {
              equal: t("No change this period"),
              up: t("Up by {diff} this period", {
                diff: formatNumber(Math.abs(diff)),
              }),
              down: t("Down by {diff} this period", {
                diff: formatNumber(Math.abs(diff)),
              }),
            }[status]
          }
          <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          {
            {
              equal: t("Sales is the same"),
              up: t("Sales is on track"),
              down: t("Sales needs attention"),
            }[status]
          }
        </div>
      </CardFooter>
    </Card>
  )
}
const LowStockProductsCard = async ({
  count,
  growth,
}: {
  count: number
  growth: GrowthT
}) => {
  const t = await getTranslations()
  const { diffPercent, status, diff } = growth

  const Icon = {
    equal: TrendingUpDown,
    up: TrendingUpIcon,
    down: TrendingDownIcon,
  }[status]
  const sign = {
    equal: "",
    up: "+",
    down: "-",
  }[status]

  return (
    <Card>
      <CardHeader className="relative p-6">
        <CardDescription>{t("Low stock products")}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {formatNumber(count)}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <Icon className="size-3" />
            {sign}
            {formatNumber(Math.abs(diffPercent))}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {
            {
              equal: t("No change this period"),
              up: t("Up by {diff} this period", {
                diff: formatNumber(Math.abs(diff)),
              }),
              down: t("Down by {diff} this period", {
                diff: formatNumber(Math.abs(diff)),
              }),
            }[status]
          }
          <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          {
            {
              equal: t("Stock is the same"),
              up: t("Stock is on track"),
              down: t("Stock needs attention"),
            }[status]
          }
        </div>
      </CardFooter>
    </Card>
  )
}

const Page = async (props: Props) => {
  const { params } = props
  const { unitId, range } = await params

  const [start, end] = mapRangeToStartEnd(range)
  const [prevStart, prevEnd] = mapRangeToPrevStartEnd(range)

  const [
    [customers],
    [prevCustomers],
    invoices,
    prevInvoices,
    [productInventories],
    [prevProductInventories],
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(customer)
      .where(
        and(
          eq(customer.unitId, unitId),
          gte(customer.createdAt, start.toISOString()),
          lte(customer.createdAt, end.toISOString())
        )
      ),
    db
      .select({ count: count() })
      .from(customer)
      .where(
        and(
          eq(customer.unitId, unitId),
          gte(customer.createdAt, prevStart.toISOString()),
          lte(customer.createdAt, prevEnd.toISOString())
        )
      ),
    db.query.invoice.findMany({
      where: and(
        eq(invoice.unitId, unitId),
        gte(invoice.createdAt, start.toISOString()),
        lte(invoice.createdAt, end.toISOString())
      ),
      orderBy: desc(invoice.createdAt),
      columns: {
        total: true,
      },
    }),
    db.query.invoice.findMany({
      where: and(
        eq(invoice.unitId, unitId),
        gte(invoice.createdAt, prevStart.toISOString()),
        lte(invoice.createdAt, prevEnd.toISOString())
      ),
      orderBy: desc(invoice.createdAt),
      columns: {
        total: true,
      },
    }),
    db
      .select({ count: count() })
      .from(productInventory)
      .where(
        and(
          eq(productInventory.unitId, unitId),
          gte(productInventory.createdAt, start.toISOString()),
          lte(productInventory.createdAt, end.toISOString()),
          lte(productInventory.stock, productInventory.lowStock)
        )
      ),
    db
      .select({ count: count() })
      .from(productInventory)
      .where(
        and(
          eq(productInventory.unitId, unitId),
          gte(productInventory.createdAt, prevStart.toISOString()),
          lte(productInventory.createdAt, prevEnd.toISOString()),
          lte(productInventory.stock, productInventory.lowStock)
        )
      ),
  ])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalSalesCard
          count={invoices.reduce((acc, invoice) => acc + invoice.total, 0)}
          growth={calcGrowth(
            invoices.reduce((acc, invoice) => acc + invoice.total, 0),
            prevInvoices.reduce((acc, invoice) => acc + invoice.total, 0)
          )}
        />

        <NewCustomersCard
          count={customers.count}
          growth={calcGrowth(customers.count, prevCustomers.count)}
        />

        <LowStockProductsCard
          count={productInventories.count}
          growth={calcGrowth(
            productInventories.count,
            prevProductInventories.count
          )}
        />

        {/* <Card>
          <CardHeader className="relative">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              $1,250.00
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                <TrendingUpIcon className="size-3" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="relative">
            <CardDescription>Active Accounts</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              45,678
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                <TrendingUpIcon className="size-3" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong user retention <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Engagement exceed targets
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="relative">
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              4.5%
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                <TrendingUpIcon className="size-3" />
                +4.5%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Steady performance <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Meets growth projections
            </div>
          </CardFooter>
        </Card> */}
      </div>
    </>
  )
}

export default Page
