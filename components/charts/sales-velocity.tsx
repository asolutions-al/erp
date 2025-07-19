"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InvoiceSchemaT } from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { ClockIcon, HelpCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

type Props = {
  invoices: InvoiceSchemaT[]
}

export function SalesVelocityCard({ invoices }: Props) {
  const t = useTranslations()

  if (!invoices.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <ClockIcon size={20} />
            {t("Sales Velocity")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t("Sales rate and revenue distribution by hour of day")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Hourly sales performance and business activity")}
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

  // Group invoices by hour
  const hourlyData = invoices.reduce(
    (acc, inv) => {
      const hour = new Date(inv.createdAt).getHours()
      if (!acc[hour]) {
        acc[hour] = {
          hour,
          revenue: 0,
          count: 0,
          totalCustomers: new Set<string>(),
        }
      }
      acc[hour].revenue += inv.total
      acc[hour].count += 1
      acc[hour].totalCustomers.add(inv.customerId)
      return acc
    },
    {} as Record<
      number,
      {
        hour: number
        revenue: number
        count: number
        totalCustomers: Set<string>
      }
    >
  )

  // Convert to array and calculate velocity metrics
  const chartData = Object.values(hourlyData)
    .map((data) => ({
      hour: `${data.hour.toString().padStart(2, "0")}:00`,
      hourNumber: data.hour,
      revenue: data.revenue,
      invoiceCount: data.count,
      customerCount: data.totalCustomers.size,
      avgPerInvoice: data.revenue / data.count,
      revenuePerCustomer: data.revenue / data.totalCustomers.size,
    }))
    .sort((a, b) => a.hourNumber - b.hourNumber)

  // Calculate metrics
  const totalRevenue = chartData.reduce((sum, hour) => sum + hour.revenue, 0)
  const totalInvoices = chartData.reduce(
    (sum, hour) => sum + hour.invoiceCount,
    0
  )
  const peakHour = chartData.reduce(
    (max, hour) => (hour.revenue > max.revenue ? hour : max),
    chartData[0]
  )
  const avgRevenuePerHour = totalRevenue / chartData.length
  const avgInvoicesPerHour = totalInvoices / chartData.length

  const chartConfig = {
    revenue: {
      label: t("Revenue"),
      color: "hsl(var(--chart-1))",
    },
    invoiceCount: {
      label: t("Invoices"),
      color: "hsl(var(--chart-2))",
    },
    customerCount: {
      label: t("Customers"),
      color: "hsl(var(--chart-3))",
    },
    avgPerInvoice: {
      label: t("Avg/Invoice"),
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <ClockIcon size={20} />
          {t("Sales Velocity")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t("Sales rate and revenue distribution by hour of day")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Hourly sales performance and business activity")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-2">
        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null

                const data = payload[0].payload

                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="mb-2 font-medium">
                      {t("Hour")}: {label}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">
                          {t("Revenue")}
                        </span>
                        <span className="font-medium">
                          {formatNumber(data.revenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">
                          {t("Invoices")}
                        </span>
                        <span className="font-medium">{data.invoiceCount}</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">
                          {t("Customers")}
                        </span>
                        <span className="font-medium">
                          {data.customerCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-sm text-muted-foreground">
                          {t("Avg/Invoice")}
                        </span>
                        <span className="font-medium">
                          {formatNumber(data.avgPerInvoice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>

        {/* Peak Hour Summary */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("Peak Hour")} - {peakHour?.hour}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("Revenue")}</p>
              <p className="text-lg font-bold tabular-nums">
                {formatNumber(peakHour?.revenue || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("Invoices")}</p>
              <p className="text-lg font-bold tabular-nums">
                {peakHour?.invoiceCount || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("Customers")}</p>
              <p className="text-lg font-bold tabular-nums">
                {peakHour?.customerCount || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("Avg/Invoice")}
              </p>
              <p className="text-lg font-bold tabular-nums">
                {formatNumber(peakHour?.avgPerInvoice || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("Avg Revenue/Hour")}
              </span>
              <span className="font-medium tabular-nums">
                {formatNumber(avgRevenuePerHour)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("Active Hours")}</span>
              <span className="font-medium tabular-nums">
                {chartData.length}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("Avg Invoices/Hour")}
              </span>
              <span className="font-medium tabular-nums">
                {avgInvoicesPerHour.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("Best Hour")}</span>
              <span className="font-medium tabular-nums">{peakHour?.hour}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
