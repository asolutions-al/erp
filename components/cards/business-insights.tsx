"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"
import { InvoiceSchemaT } from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { BarChart2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

export function BusinessInsightsCard({
  invoices,
}: {
  invoices: InvoiceSchemaT[]
}) {
  const t = useTranslations()

  if (!invoices.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <BarChart2Icon size={20} />
            {t("Business Performance")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Daily sales analysis and trends")}
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

  // Group data by date
  const dailyData = invoices.reduce(
    (acc, inv) => {
      const date = new Date(inv.createdAt).toISOString().split("T")[0]
      acc[date] = acc[date] || {
        revenue: 0,
        count: 0,
        avgValue: 0,
        uniqueCustomers: new Set(),
      }
      acc[date].revenue += inv.total
      acc[date].count++
      acc[date].uniqueCustomers.add(inv.customerId)
      return acc
    },
    {} as Record<
      string,
      {
        revenue: number
        count: number
        avgValue: number
        uniqueCustomers: Set<string>
      }
    >
  )

  // Calculate moving averages and growth
  const dates = Object.keys(dailyData).sort()
  const movingAverageWindow = 3
  const revenueValues = dates.map((date) => dailyData[date].revenue)

  const movingAverage = revenueValues.map((_, idx) => {
    const start = Math.max(0, idx - movingAverageWindow + 1)
    const windowValues = revenueValues.slice(start, idx + 1)
    return Math.round(
      windowValues.reduce((sum, val) => sum + val, 0) / windowValues.length
    )
  })

  // Convert to chart data format
  const chartData = dates.map((date, index) => {
    const data = dailyData[date]
    return {
      date: new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      revenue: data.revenue,
      count: data.count,
      customers: data.uniqueCustomers.size,
      trend: movingAverage[index],
      avgOrderValue: Math.round(data.revenue / data.count),
    }
  })

  const config = {
    revenue: {
      label: t("Daily Revenue"),
      theme: {
        light: "rgb(34, 197, 94)",
        dark: "rgb(34, 197, 94)",
      },
    },
    trend: {
      label: t("Revenue Trend"),
      theme: {
        light: "rgb(99, 102, 241)",
        dark: "rgb(99, 102, 241)",
      },
    },
    customers: {
      label: t("Unique Customers"),
      theme: {
        light: "rgb(249, 115, 22)",
        dark: "rgb(249, 115, 22)",
      },
    },
  }

  // Calculate summary metrics
  const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0)
  const totalCustomers = chartData.reduce((sum, day) => sum + day.customers, 0)
  const avgDailyRevenue = Math.round(totalRevenue / chartData.length)
  const avgCustomersPerDay = Math.round(totalCustomers / chartData.length)
  const avgOrderValue = Math.round(
    totalRevenue / chartData.reduce((sum, day) => sum + day.count, 0)
  )

  // Calculate growth (comparing last two days)
  const lastDay = chartData[chartData.length - 1]
  const previousDay = chartData[chartData.length - 2]
  const revenueGrowth = previousDay
    ? ((lastDay.revenue - previousDay.revenue) / previousDay.revenue) * 100
    : 0

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <BarChart2Icon size={20} />
          {t("Business Performance")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Daily sales analysis and trends")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("Avg Daily Revenue")}
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(avgDailyRevenue)}
            </p>
            <p className="text-sm text-muted-foreground">
              {revenueGrowth > 0 ? "+" : ""}
              {revenueGrowth.toFixed(1)}% {t("vs previous day")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("Avg Invoice Value")}
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(avgOrderValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("Daily Customers")}
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {avgCustomersPerDay}
            </p>
          </div>
        </div>

        <div className="h-[350px]">
          <ChartContainer
            config={config}
            className="h-full w-full [&_.recharts-cartesian-axis-line]:stroke-border [&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border"
          >
            <ComposedChart
              data={chartData}
              margin={{ left: 10, right: 10, top: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-15}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
                label={{
                  value: t("Date"),
                  position: "bottom",
                  offset: 0,
                }}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={(value) => formatNumber(value)}
                tick={{ fontSize: 12 }}
                label={{
                  value: t("Revenue"),
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                }}
              />
              <YAxis
                yAxisId="customers"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{
                  value: t("Customers"),
                  angle: 90,
                  position: "insideRight",
                  offset: 10,
                }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload) return null
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <div className="mb-2 font-medium">
                        {payload[0]?.payload.date}
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[rgb(34,197,94)]" />
                          <span className="text-sm">
                            {t("Revenue")}:{" "}
                            {formatNumber(payload[0]?.value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[rgb(99,102,241)]" />
                          <span className="text-sm">
                            {t("Trend")}:{" "}
                            {formatNumber(payload[1]?.value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[rgb(249,115,22)]" />
                          <span className="text-sm">
                            {t("Customers")}: {payload[2]?.value}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t("Avg Invoice")}:{" "}
                          {formatNumber(payload[0]?.payload.avgOrderValue)}
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill="rgb(34, 197, 94)"
                fillOpacity={0.2}
                stroke="rgb(34, 197, 94)"
                strokeWidth={1}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="trend"
                stroke="rgb(99, 102, 241)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="customers"
                type="monotone"
                dataKey="customers"
                stroke="rgb(249, 115, 22)"
                strokeWidth={2}
              />
              <ChartLegend
                content={({ payload }) => (
                  <ChartLegendContent payload={payload} />
                )}
              />
            </ComposedChart>
          </ChartContainer>
        </div>

        <div className="text-xs text-muted-foreground">
          {t(
            "Chart shows daily revenue (bars), revenue trend (blue line), and unique customers (orange line)"
          )}
        </div>
      </CardContent>
    </Card>
  )
}
