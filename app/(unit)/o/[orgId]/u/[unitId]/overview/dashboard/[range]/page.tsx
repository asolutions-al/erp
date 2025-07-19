import {
  BusinessInsightsCard,
  GrowthCard,
  ProductInsightsCard,
} from "@/components/cards"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { mapRangeToPrevStartEnd, mapRangeToStartEnd } from "@/contants/maps"
import { db } from "@/db/app/instance"
import { InvoiceSchemaT } from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import {
  customer,
  invoice,
  invoiceRow,
  product,
  productInventory,
} from "@/orm/app/schema"
import { calcGrowth } from "@/utils/calc"
import { and, count, desc, eq, gte, lte, sum } from "drizzle-orm"
import {
  AlarmClockIcon,
  BarChart2Icon,
  CoinsIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  HandCoinsIcon,
  HelpCircleIcon,
  LandmarkIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

type Props = {
  params: Promise<{ unitId: string; orgId: string; range: RangeT }>
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
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <WalletIcon size={20} />
          {t("Payment Methods")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Analysis of sales by payment method, showing revenue and invoice count for each type"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Revenue breakdown by payment method")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-2">
        {paymentMethodData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("No data for selected period")}
          </p>
        ) : (
          paymentMethodData.map((data, index) => {
            const Icon = PAYMENT_ICONS[data.method] || CoinsIcon
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: data.color }}
                    />
                    <Icon className="ml-1" size={17} />
                    <span className="text-sm font-semibold">
                      {t(data.method)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted py-1">
                      {t("{count} invoices", { count: data.count })}
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
          })
        )}
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
  return (
    <GrowthCard
      Icon={CreditCardIcon}
      title={formatNumber(value)}
      description={t("Avg invoice value")}
      growth={growth}
      suggestion={
        {
          equal: t("Keep pricing steady and upsell"),
          up: t("Try premium offers or price tweaks"),
          down: t("Review pricing and add value"),
        }[growth.status]
      }
    />
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
  return (
    <GrowthCard
      Icon={HandCoinsIcon}
      title={formatNumber(count)}
      description={t("New customers")}
      growth={growth}
      suggestion={
        {
          equal: t("Keep new customers engaged"),
          up: t("Boost referrals and campaigns"),
          down: t("Increase marketing and improve onboarding"),
        }[growth.status]
      }
    />
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
  return (
    <GrowthCard
      Icon={CoinsIcon}
      title={formatNumber(count)}
      description={t("Invoices total")}
      growth={growth}
      suggestion={
        {
          equal: t("Keep current sales strategy"),
          up: t("Expand what works or try new markets"),
          down: t("Check funnel and fix issues"),
        }[growth.status]
      }
    />
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
  return (
    <GrowthCard
      Icon={TrendingUpIcon}
      title={formatNumber(count)}
      description={t("Invoices count")}
      growth={growth}
      suggestion={
        {
          equal: t("Keep customers engaged"),
          up: t("Reward loyal buyers"),
          down: t("Contact inactive customers and offer deals"),
        }[growth.status]
      }
    />
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
  return (
    <GrowthCard
      Icon={TrendingDownIcon}
      title={formatNumber(count)}
      description={t("Low stock products")}
      growth={growth}
      suggestion={
        {
          equal: t("Monitor and reorder as needed"),
          up: t("Optimize or buy in bulk"),
          down: t("Restock key items soon"),
        }[growth.status]
      }
    />
  )
}

const TopProductsCard = async ({
  products,
  orgId,
  unitId,
}: {
  products: {
    id: string
    name: string
    quantity: number
    total: number
    percentage: number
    imageBucketPath?: string | null
  }[]
  orgId: string
  unitId: string
}) => {
  const t = await getTranslations()
  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <TrendingUpIcon size={20} />
          {t("Top Products")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Products ranked by revenue contribution, showing sales quantity and percentage of total revenue"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Most revenue generating products")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-2">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("No data for selected period")}
          </p>
        ) : (
          products.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={
                        data.imageBucketPath
                          ? `${publicStorageUrl}/${productImagesBucket}/${data.imageBucketPath}`
                          : "/placeholder.svg"
                      }
                      alt={data.name}
                      className="object-cover"
                      fill
                      sizes="40px"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{data.name}</span>
                    <Link
                      href={`/o/${orgId}/u/${unitId}/product/update/${data.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLinkIcon size={12} />
                      {t("View details")}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-muted py-1">
                    {t("{count} sold", { count: formatNumber(data.quantity) })}
                  </Badge>
                  <span className="text-sm font-bold tabular-nums">
                    {formatNumber(data.total)}
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
          ))
        )}
      </CardContent>
    </Card>
  )
}

const PeakHoursCard = async ({ invoices }: { invoices: InvoiceSchemaT[] }) => {
  const t = await getTranslations()

  // Early return if no data
  if (!invoices.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <AlarmClockIcon size={20} />
            {t("Peak Hours Analysis")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t(
                      "Analysis of busiest hours based on sales volume and revenue, helping identify peak business hours"
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Sales performance by hour")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <p className="text-sm text-muted-foreground">
            {t("No data for selected period")}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate metrics by hour
  const hourlyMetrics = invoices.reduce(
    (acc, inv) => {
      const hour = new Date(inv.createdAt).getHours()
      acc[hour] = acc[hour] || {
        total: 0,
        count: 0,
        maxInvoice: 0,
        minInvoice: Infinity,
      }
      acc[hour].total += inv.total
      acc[hour].count++
      acc[hour].maxInvoice = Math.max(acc[hour].maxInvoice, inv.total)
      acc[hour].minInvoice = Math.min(acc[hour].minInvoice, inv.total)
      return acc
    },
    {} as Record<
      number,
      {
        total: number
        count: number
        maxInvoice: number
        minInvoice: number
      }
    >
  )

  // Convert to array and calculate averages
  const hourlyData = Object.entries(hourlyMetrics)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      total: data.total,
      count: data.count,
      avg: data.total / data.count,
      maxInvoice: data.maxInvoice,
      minInvoice: data.minInvoice,
    }))
    .sort((a, b) => b.total - a.total)

  const businessHours = hourlyData.filter((h) => h.count > 0)
  const maxTotal = Math.max(...businessHours.map((h) => h.total))
  const peakHour = businessHours[0]
  const slowestHour = businessHours[businessHours.length - 1]

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <AlarmClockIcon size={20} />
          {t("Peak Hours Analysis")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Analysis of busiest hours based on sales volume and revenue, helping identify peak business hours"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Sales performance by hour")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-2">
        {/* Peak Hour Summary */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("Peak Hour")} - {peakHour.hour.toString().padStart(2, "0")}:00
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("Revenue")}</p>
              <p className="text-lg font-bold tabular-nums">
                {formatNumber(peakHour.total)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("Invoice Count")}
              </p>
              <p className="text-lg font-bold tabular-nums">{peakHour.count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("Avg/Invoice")}
              </p>
              <p className="text-lg font-bold tabular-nums">
                {formatNumber(peakHour.avg)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("Max Invoice")}
              </p>
              <p className="text-lg font-bold tabular-nums">
                {formatNumber(peakHour.maxInvoice)}
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Performance */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("Hourly Performance")}
          </h3>
          <div className="space-y-3">
            {businessHours.map((hour) => (
              <div key={hour.hour} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {hour.hour.toString().padStart(2, "0")}:00
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {t("{count} invoices", { count: hour.count })}
                    </Badge>
                  </div>
                  <span className="tabular-nums">
                    {formatNumber(hour.total)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={(hour.total / maxTotal) * 100}
                    className="h-1.5"
                  />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatNumber(hour.avg)}/{t("inv")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{t("Most Active")}</p>
            <p className="mt-1 text-2xl font-bold">
              {peakHour.hour.toString().padStart(2, "0")}:00
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(peakHour.total)} (
              {t("{count} invoices", {
                count: peakHour.count,
              })}
              )
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{t("Least Active")}</p>
            <p className="mt-1 text-2xl font-bold">
              {slowestHour.hour.toString().padStart(2, "0")}:00
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(slowestHour.total)} (
              {t("{count} invoices", {
                count: slowestHour.count,
              })}
              )
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SalesDistributionCard = async ({
  invoices,
}: {
  invoices: InvoiceSchemaT[]
}) => {
  const t = await getTranslations()

  if (!invoices.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <BarChart2Icon size={20} />
            {t("Sales Distribution")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t(
                      "Distribution of sales across different value ranges, showing how many invoices fall into each price bracket"
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Invoice value distribution")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <p className="text-sm text-muted-foreground">
            {t("No data for selected period")}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate invoice size segments
  const segments = invoices.reduce(
    (acc, inv) => {
      if (inv.total < 1000) acc.small++
      else if (inv.total < 5000) acc.medium++
      else acc.large++
      return acc
    },
    { small: 0, medium: 0, large: 0 }
  )

  // Calculate average items per invoice
  const avgItemsPerInvoice = Math.round(
    invoices.reduce((acc, inv) => acc + inv.discountValue, 0) / invoices.length
  )

  // Calculate repeat vs new customers
  const customerFrequency = invoices.reduce(
    (acc, inv) => {
      acc[inv.customerId] = (acc[inv.customerId] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const repeatCustomers = Object.values(customerFrequency).filter(
    (freq) => freq > 1
  ).length
  const totalCustomers = Object.keys(customerFrequency).length

  // Calculate discount stats
  const totalDiscount = invoices.reduce(
    (acc, inv) => acc + inv.discountValue,
    0
  )
  const invoicesWithDiscount = invoices.filter(
    (inv) => inv.discountValue > 0
  ).length
  const avgDiscountPerInvoice =
    invoicesWithDiscount > 0 ? totalDiscount / invoicesWithDiscount : 0

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <BarChart2Icon size={20} />
          {t("Sales Distribution")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Distribution of sales across different value ranges, showing how many invoices fall into each price bracket"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Invoice value distribution")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-2">
        {/* Invoice Size Distribution */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("Invoice Size Distribution")}
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{t("Small")} (&lt; 1000)</span>
                <Badge variant="outline">
                  {t("{count} invoices", { count: segments.small })}
                </Badge>
              </div>
              <Progress
                value={(segments.small / invoices.length) * 100}
                className="h-1.5"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{t("Medium")} (1000-5000)</span>
                <Badge variant="outline">
                  {t("{count} invoices", { count: segments.medium })}
                </Badge>
              </div>
              <Progress
                value={(segments.medium / invoices.length) * 100}
                className="h-1.5"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{t("Large")} (&gt; 5000)</span>
                <Badge variant="outline">
                  {t("{count} invoices", { count: segments.large })}
                </Badge>
              </div>
              <Progress
                value={(segments.large / invoices.length) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("Customer Retention")}
            </p>
            <p className="mt-1 text-2xl font-bold">
              {Math.round((repeatCustomers / totalCustomers) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {t("{count} repeat customers", { count: repeatCustomers })}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("Discount Usage")}
            </p>
            <p className="mt-1 text-2xl font-bold">
              {Math.round((invoicesWithDiscount / invoices.length) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {t("avg {amount}/invoice", {
                amount: formatNumber(avgDiscountPerInvoice),
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomerBehaviorCard = async ({
  invoices,
}: {
  invoices: InvoiceSchemaT[]
}) => {
  const t = await getTranslations()

  if (!invoices.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <UsersIcon size={20} />
            {t("Customer Behavior")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t(
                      "Analysis of customer purchasing patterns, showing frequency of purchases and customer loyalty metrics"
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Customer purchase patterns")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <p className="text-sm text-muted-foreground">
            {t("No data for selected period")}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group invoices by customer
  const customerInvoices = invoices.reduce(
    (acc, inv) => {
      acc[inv.customerId] = acc[inv.customerId] || []
      acc[inv.customerId].push(inv)
      return acc
    },
    {} as Record<string, InvoiceSchemaT[]>
  )

  // Calculate customer metrics
  const customerMetrics = Object.entries(customerInvoices).map(
    ([id, invs]) => ({
      id,
      name: invs[0].customerName,
      invoiceCount: invs.length,
      totalSpent: invs.reduce((sum, inv) => sum + inv.total, 0),
      avgInvoiceValue:
        invs.reduce((sum, inv) => sum + inv.total, 0) / invs.length,
      lastPurchase: new Date(
        Math.max(...invs.map((inv) => new Date(inv.createdAt).getTime()))
      ),
    })
  )

  // Find top customers by spend
  const topSpenders = [...customerMetrics]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3)

  // Find most frequent customers
  const frequentCustomers = [...customerMetrics]
    .sort((a, b) => b.invoiceCount - a.invoiceCount)
    .slice(0, 3)

  // Calculate average values
  const avgOrderValue =
    customerMetrics.reduce((sum, c) => sum + c.avgInvoiceValue, 0) /
    customerMetrics.length
  const totalCustomers = customerMetrics.length
  const multiPurchaseCustomers = customerMetrics.filter(
    (c) => c.invoiceCount > 1
  ).length

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <UsersIcon size={20} />
          {t("Customer Behavior")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Analysis of customer purchasing patterns, showing frequency of purchases and customer loyalty metrics"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Customer purchase patterns")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-2">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("Total Customers")}
            </p>
            <p className="text-2xl font-bold tabular-nums">{totalCustomers}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("Returning")}</p>
            <p className="text-2xl font-bold tabular-nums">
              {Math.round((multiPurchaseCustomers / totalCustomers) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("Avg Invoice")}</p>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(avgOrderValue)}
            </p>
          </div>
        </div>

        {/* Top Spenders */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("Top Spenders")}
          </h3>
          <div className="space-y-3">
            {topSpenders.map((customer, index) => (
              <div key={customer.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="min-w-[1.5rem] justify-center"
                    >
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <span className="tabular-nums">
                    {formatNumber(customer.totalSpent)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={
                      (customer.totalSpent / topSpenders[0].totalSpent) * 100
                    }
                    className="h-1.5"
                  />
                  <span className="text-xs text-muted-foreground">
                    {t("{count} invoices", { count: customer.invoiceCount })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequent Buyers */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("Most Frequent")}
          </h3>
          <div className="space-y-3">
            {frequentCustomers.map((customer, index) => (
              <div key={customer.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="min-w-[1.5rem] justify-center"
                    >
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <Badge variant="outline">
                    {t("{count} invoices", { count: customer.invoiceCount })}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={
                      (customer.invoiceCount /
                        frequentCustomers[0].invoiceCount) *
                      100
                    }
                    className="h-1.5"
                  />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {t("{count} invoices", { count: customer.invoiceCount })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const Page = async (props: Props) => {
  const { params } = props
  const { unitId, orgId, range } = await params

  const [start, end] = mapRangeToStartEnd(range)
  const [prevStart, prevEnd] = mapRangeToPrevStartEnd(range)

  const [
    [customers],
    [prevCustomers],
    invoices,
    prevInvoices,
    [productInventories],
    [prevProductInventories],
    topProducts,
    invoiceRows,
    inventory,
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
    db
      .select({
        id: product.id,
        name: product.name,
        imageBucketPath: product.imageBucketPath,
        quantity: sum(invoiceRow.quantity).mapWith(Number),
        total: sum(invoiceRow.total).mapWith(Number),
      })
      .from(invoiceRow)
      .innerJoin(invoice, eq(invoice.id, invoiceRow.invoiceId))
      .innerJoin(product, eq(product.id, invoiceRow.productId))
      .where(
        and(
          eq(invoice.unitId, unitId),
          gte(invoice.createdAt, start.toISOString()),
          lte(invoice.createdAt, end.toISOString())
        )
      )
      .groupBy(product.id, product.name, product.imageBucketPath)
      .orderBy(desc(sum(invoiceRow.total)))
      .limit(5),
    // Fetch invoice rows for the period
    db.query.invoiceRow.findMany({
      where: and(eq(invoiceRow.unitId, unitId), eq(invoiceRow.orgId, orgId)),
    }),
    // Fetch inventory data
    db.query.productInventory.findMany({
      where: and(
        eq(productInventory.unitId, unitId),
        eq(productInventory.orgId, orgId)
      ),
    }),
  ])

  const totalRevenue = topProducts.reduce((acc, p) => acc + p.total, 0)

  const productsWithPercentage = topProducts.map((product) => ({
    ...product,
    percentage: (product.total / totalRevenue) * 100,
  }))

  return (
    <div className="space-y-4">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalSalesCard
          count={invoices.reduce((acc, invoice) => acc + invoice.total, 0)}
          growth={calcGrowth(
            invoices.reduce((acc, invoice) => acc + invoice.total, 0),
            prevInvoices.reduce((acc, invoice) => acc + invoice.total, 0)
          )}
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
        <TotalSalesCountCard
          count={invoices.length}
          growth={calcGrowth(invoices.length, prevInvoices.length)}
        />
        <NewCustomersCard
          count={customers.count}
          growth={calcGrowth(customers.count, prevCustomers.count)}
        />
      </div>

      {/* Main Business Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BusinessInsightsCard invoices={invoices} />
        <ProductInsightsCard invoiceRows={invoiceRows} inventory={inventory} />
      </div>

      {/* Sales Analysis */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PaymentMethodSalesCard invoices={invoices} />
        <SalesDistributionCard invoices={invoices} />
      </div>

      {/* Product and Customer Analysis */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopProductsCard
          products={productsWithPercentage}
          orgId={orgId}
          unitId={unitId}
        />
        <CustomerBehaviorCard invoices={invoices} />
      </div>

      {/* Operational Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PeakHoursCard invoices={invoices} />
        <div className="grid grid-cols-1 gap-4">
          <div>
            <LowStockProductsCard
              count={productInventories.count}
              growth={calcGrowth(
                productInventories.count,
                prevProductInventories.count
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
