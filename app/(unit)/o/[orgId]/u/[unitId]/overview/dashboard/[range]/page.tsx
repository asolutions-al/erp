import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mapRangeToPrevStartEnd, mapRangeToStartEnd } from "@/contants/maps"
import { db } from "@/db/app/instance"
import { InvoiceSchemaT } from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { customer, invoice, productInventory } from "@/orm/app/schema"
import { calcGrowth } from "@/utils/calc"
import { and, count, desc, eq, gte, lte } from "drizzle-orm"
import {
  CoinsIcon,
  CreditCardIcon,
  HandCoinsIcon,
  LandmarkIcon,
  TrendingDownIcon,
  TrendingUpDown,
  TrendingUpIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ unitId: string; range: RangeT }>
  searchParams: Promise<{ range?: RangeT }>
}

type PaymentMethodData = {
  method: InvoiceSchemaT["payMethod"]
  value: number
  count: number
  percentage: number
  color: string
}

const PAYMENT_COLORS = {
  cash: "#22c55e",
  card: "#3b82f6",
  bank: "#8b5cf6",
  other: "#f59e0b",
} as const

const PAYMENT_ICONS = {
  cash: HandCoinsIcon,
  card: CreditCardIcon,
  bank: LandmarkIcon,
  other: CoinsIcon,
} as const

const CardHeaderEnhanced = ({
  icon: Icon,
  iconBg,
  title,
  description,
  children,
}: {
  icon?: React.ElementType
  iconBg?: string
  title: string
  description?: string
  children?: React.ReactNode
}) => (
  <CardHeader className="relative flex flex-row items-center gap-4 p-6 pb-2">
    {Icon && (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
        style={{ background: iconBg || "#f3f4f6" }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
    )}
    <div className="flex-1">
      <CardDescription className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {description}
      </CardDescription>
      <CardTitle className="text-xl font-bold text-foreground">
        {title}
      </CardTitle>
      {children}
    </div>
  </CardHeader>
)

const GrowthBadge = ({ diffPercent, status, sign, Icon }: any) => (
  <Badge
    variant="outline"
    className={`flex gap-1 rounded-lg border-0 px-2 py-1 text-xs ${
      status === "up"
        ? "bg-green-100 text-green-700"
        : status === "down"
          ? "bg-red-100 text-red-700"
          : "bg-muted text-muted-foreground"
    }`}
  >
    <Icon className="size-3" />
    {sign}
    {Math.abs(diffPercent)}%
  </Badge>
)

const CardFooterEnhanced = ({
  status,
  diff,
  Icon,
  message,
  subMessage,
}: any) => (
  <CardFooter className="flex-col items-start gap-1 px-6 pb-4 pt-2 text-sm">
    <div className="flex items-center gap-2 font-medium">
      {message}
      <Icon className="size-4" />
    </div>
    <div className="text-xs text-muted-foreground">{subMessage}</div>
  </CardFooter>
)

const PaymentMethodSalesCard = async ({
  invoices,
}: {
  invoices: InvoiceSchemaT[]
}) => {
  const t = await getTranslations()
  const paymentMethodData: PaymentMethodData[] = Object.entries(
    invoices.reduce(
      (acc, invoice) => {
        acc[invoice.payMethod] = (acc[invoice.payMethod] || 0) + invoice.total
        return acc
      },
      {} as Record<InvoiceSchemaT["payMethod"], number>
    )
  )
    .map(([_method, total]) => {
      const method = _method as InvoiceSchemaT["payMethod"]
      const count = invoices.filter((inv) => inv.payMethod === method).length
      const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
      const percentage = totalRevenue > 0 ? (total / totalRevenue) * 100 : 0
      return {
        method,
        value: total,
        count,
        percentage,
        color: PAYMENT_COLORS[method],
      }
    })
    .sort((a, b) => b.value - a.value)
  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">
          {t("Payment Methods")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Revenue breakdown by payment method")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-2">
        {paymentMethodData.map((data, index) => {
          const Icon = PAYMENT_ICONS[data.method] || CoinsIcon
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: data.color }}
                  />
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: data.color }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">
                    {t(data.method)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {data.count} {t("orders")}
                  </Badge>
                  <span className="text-sm font-bold tabular-nums">
                    {formatNumber(data.value)}
                  </span>
                </div>
              </div>
              <Progress value={data.percentage} className="h-2 bg-muted" />
              <div className="text-xs text-muted-foreground">
                {t("{percentage}% of total revenue", {
                  percentage: data.percentage.toFixed(1),
                })}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

const AvgSaleValueCard = async ({
  value,
  growth,
}: {
  value: number
  growth: GrowthT
}) => {
  const t = await getTranslations()
  const { diffPercent, status, diff } = growth
  const Icon = {
    equal: TrendingUpDown,
    up: TrendingUpIcon,
    down: TrendingDownIcon,
  }[status]
  const sign = { equal: "", up: "+", down: "-" }[status]
  return (
    <Card>
      <CardHeaderEnhanced
        icon={CreditCardIcon}
        iconBg="#3b82f6"
        title={formatNumber(value)}
        description={t("Avg sale value")}
      >
        <div className="absolute right-4 top-4">
          <GrowthBadge
            diffPercent={formatNumber(Math.abs(diffPercent))}
            status={status}
            sign={sign}
            Icon={Icon}
          />
        </div>
      </CardHeaderEnhanced>
      <CardFooterEnhanced
        status={status}
        diff={diff}
        Icon={Icon}
        message={
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
        subMessage={
          {
            equal: t("Avg sale value is the same"),
            up: t("Avg sale value is on track"),
            down: t("Avg sale value needs attention"),
          }[status]
        }
      />
    </Card>
  )
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
  const sign = { equal: "", up: "+", down: "-" }[status]
  return (
    <Card>
      <CardHeaderEnhanced
        icon={HandCoinsIcon}
        iconBg="#22c55e"
        title={String(count)}
        description={t("New customers")}
      >
        <div className="absolute right-4 top-4">
          <GrowthBadge
            diffPercent={Math.abs(diffPercent)}
            status={status}
            sign={sign}
            Icon={Icon}
          />
        </div>
      </CardHeaderEnhanced>
      <CardFooterEnhanced
        status={status}
        diff={diff}
        Icon={Icon}
        message={
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
        subMessage={
          {
            equal: t("Acquisition is the same"),
            up: t("Acquisition is on track"),
            down: t("Acquisition needs attention"),
          }[status]
        }
      />
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
  const sign = { equal: "", up: "+", down: "-" }[status]
  return (
    <Card>
      <CardHeaderEnhanced
        icon={CoinsIcon}
        iconBg="#f59e0b"
        title={formatNumber(count)}
        description={t("Total sales")}
      >
        <div className="absolute right-4 top-4">
          <GrowthBadge
            diffPercent={formatNumber(Math.abs(diffPercent))}
            status={status}
            sign={sign}
            Icon={Icon}
          />
        </div>
      </CardHeaderEnhanced>
      <CardFooterEnhanced
        status={status}
        diff={diff}
        Icon={Icon}
        message={
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
        subMessage={
          {
            equal: t("Sales is the same"),
            up: t("Sales is on track"),
            down: t("Sales needs attention"),
          }[status]
        }
      />
    </Card>
  )
}

const TotalSalesCountCard = async ({
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
  const sign = { equal: "", up: "+", down: "-" }[status]
  return (
    <Card>
      <CardHeaderEnhanced
        icon={TrendingUpIcon}
        iconBg="#8b5cf6"
        title={formatNumber(count)}
        description={t("Number of sales")}
      >
        <div className="absolute right-4 top-4">
          <GrowthBadge
            diffPercent={formatNumber(Math.abs(diffPercent))}
            status={status}
            sign={sign}
            Icon={Icon}
          />
        </div>
      </CardHeaderEnhanced>
      <CardFooterEnhanced
        status={status}
        diff={diff}
        Icon={Icon}
        message={
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
        subMessage={
          {
            equal: t("Sales count is the same"),
            up: t("Sales count is on track"),
            down: t("Sales count needs attention"),
          }[status]
        }
      />
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
  const sign = { equal: "", up: "+", down: "-" }[status]
  return (
    <Card>
      <CardHeaderEnhanced
        icon={TrendingDownIcon}
        iconBg="#ef4444"
        title={formatNumber(count)}
        description={t("Low stock products")}
      >
        <div className="absolute right-4 top-4">
          <GrowthBadge
            diffPercent={formatNumber(Math.abs(diffPercent))}
            status={status}
            sign={sign}
            Icon={Icon}
          />
        </div>
      </CardHeaderEnhanced>
      <CardFooterEnhanced
        status={status}
        diff={diff}
        Icon={Icon}
        message={
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
        subMessage={
          {
            equal: t("Stock is the same"),
            up: t("Stock is on track"),
            down: t("Stock needs attention"),
          }[status]
        }
      />
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
    }),
    db.query.invoice.findMany({
      where: and(
        eq(invoice.unitId, unitId),
        gte(invoice.createdAt, prevStart.toISOString()),
        lte(invoice.createdAt, prevEnd.toISOString())
      ),
      orderBy: desc(invoice.createdAt),
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

        <TotalSalesCountCard
          count={invoices.length}
          growth={calcGrowth(invoices.length, prevInvoices.length)}
        />

        <AvgSaleValueCard
          value={
            invoices.length > 0
              ? invoices.reduce((acc, invoice) => acc + invoice.total, 0) /
                invoices.length
              : 0
          }
          growth={calcGrowth(
            invoices.length > 0
              ? invoices.reduce((acc, invoice) => acc + invoice.total, 0) /
                  invoices.length
              : 0,
            prevInvoices.length > 0
              ? prevInvoices.reduce((acc, invoice) => acc + invoice.total, 0) /
                  prevInvoices.length
              : 0
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
        <div className="col-span-1 md:col-span-2">
          <PaymentMethodSalesCard invoices={invoices} />
        </div>
      </div>
    </>
  )
}

export default Page
