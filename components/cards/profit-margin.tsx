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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InvoiceRowSchemaT, ProductSchemaT } from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { HelpCircleIcon, TrendingUpIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

type ProductProfitability = {
  productId: string
  name: string
  totalRevenue: number
  totalCost: number
  totalProfit: number
  profitMargin: number
  quantity: number
  avgSellingPrice: number
  avgPurchasePrice: number
}

export function ProfitMarginCard({
  invoiceRows,
}: {
  invoiceRows: (InvoiceRowSchemaT & { product: ProductSchemaT })[]
}) {
  const t = useTranslations()

  if (!invoiceRows.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <TrendingUpIcon size={20} />
            {t("Profit Margin Analysis")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Product profitability and margin insights")}
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

  // Calculate profitability metrics
  const profitabilityData = invoiceRows.reduce(
    (acc, row) => {
      const product = row.product
      if (!product) return acc

      const existing = acc[product.id] || {
        productId: product.id,
        name: product.name,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        quantity: 0,
        avgSellingPrice: 0,
        avgPurchasePrice: 0,
      }

      const cost = product.purchasePrice * row.quantity
      const profit = row.total - cost

      existing.totalRevenue += row.total
      existing.totalCost += cost
      existing.totalProfit += profit
      existing.quantity += row.quantity
      existing.avgSellingPrice = product.price
      existing.avgPurchasePrice = product.purchasePrice
      existing.profitMargin =
        existing.totalRevenue > 0
          ? (existing.totalProfit / existing.totalRevenue) * 100
          : 0

      acc[product.id] = existing
      return acc
    },
    {} as Record<string, ProductProfitability>
  )

  // Convert to array and sort by profit margin
  const topProfitableProducts = Object.values(profitabilityData)
    .sort((a, b) => b.profitMargin - a.profitMargin)
    .slice(0, 5)

  // Prepare chart data
  const chartData = topProfitableProducts.map((product) => ({
    name:
      product.name.length > 15
        ? product.name.slice(0, 15) + "..."
        : product.name,
    revenue: product.totalRevenue,
    cost: product.totalCost,
    profit: product.totalProfit,
    margin: Math.round(product.profitMargin * 100) / 100, // Round to 2 decimal places
  }))

  const config = {
    revenue: {
      label: t("Revenue" as any),
      theme: {
        light: "rgb(34, 197, 94)",
        dark: "rgb(34, 197, 94)",
      },
    },
    cost: {
      label: t("Cost" as any),
      theme: {
        light: "rgb(239, 68, 68)",
        dark: "rgb(239, 68, 68)",
      },
    },
    margin: {
      label: t("Profit Margin %" as any),
      theme: {
        light: "rgb(99, 102, 241)",
        dark: "rgb(99, 102, 241)",
      },
    },
  }

  // Calculate summary metrics
  const totalRevenue = topProfitableProducts.reduce(
    (sum, p) => sum + p.totalRevenue,
    0
  )
  const totalCost = topProfitableProducts.reduce(
    (sum, p) => sum + p.totalCost,
    0
  )
  const totalProfit = totalRevenue - totalCost
  const overallMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
  const avgMargin =
    topProfitableProducts.length > 0
      ? topProfitableProducts.reduce((sum, p) => sum + p.profitMargin, 0) /
        topProfitableProducts.length
      : 0

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <TrendingUpIcon size={20} />
          {t("Profit Margin Analysis")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Analysis of product profitability showing profit margins based on selling price vs purchase price"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Product profitability and margin insights")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {t("Total Profit")}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircleIcon className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t("Total profit from top 5 most profitable products")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(totalProfit)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {t("Overall Margin")}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircleIcon className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t(
                        "Overall profit margin across all top profitable products"
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {Math.round(overallMargin * 100) / 100}%
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">{t("Avg Margin")}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircleIcon className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t(
                        "Average profit margin across top performing products"
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {Math.round(avgMargin * 100) / 100}%
            </p>
          </div>
        </div>

        <div className="relative h-80">
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
                dataKey="name"
                angle={-15}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="amount"
                orientation="left"
                tickFormatter={(value) => formatNumber(value)}
                tick={{ fontSize: 12 }}
                label={{
                  value: t("Amount" as any),
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                }}
              />
              <YAxis
                yAxisId="percentage"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{
                  value: t("Margin %" as any),
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
                        {payload[0]?.payload.name}
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
                          <div className="h-2 w-2 rounded-full bg-[rgb(239,68,68)]" />
                          <span className="text-sm">
                            {t("Cost" as any)}:{" "}
                            {formatNumber(payload[1]?.value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[rgb(99,102,241)]" />
                          <span className="text-sm">
                            {t("Margin" as any)}: {payload[2]?.value}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                yAxisId="amount"
                dataKey="revenue"
                fill="rgb(34, 197, 94)"
                fillOpacity={0.8}
                stroke="rgb(34, 197, 94)"
                strokeWidth={1}
              />
              <Bar
                yAxisId="amount"
                dataKey="cost"
                fill="rgb(239, 68, 68)"
                fillOpacity={0.8}
                stroke="rgb(239, 68, 68)"
                strokeWidth={1}
              />
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="margin"
                stroke="rgb(99, 102, 241)"
                strokeWidth={3}
                dot={{ r: 4, fill: "rgb(99, 102, 241)" }}
              />
              <ChartLegend
                content={({ payload }) => (
                  <ChartLegendContent payload={payload} />
                )}
              />
            </ComposedChart>
          </ChartContainer>
          <div className="absolute right-0 top-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t(
                      "Green bars show revenue, red bars show costs, and blue line shows profit margin percentage" as any
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {t(
            "Chart shows revenue vs costs (bars) and profit margin percentage (blue line) for top 5 most profitable products"
          )}
        </div>
      </CardContent>
    </Card>
  )
}
