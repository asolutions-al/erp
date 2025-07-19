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
import { InvoiceRowSchemaT, ProductInventorySchemaT } from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { HelpCircleIcon, PackageIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

type ProductPerformance = {
  productId: string
  name: string
  totalRevenue: number
  totalQuantity: number
  averagePrice: number
  stockLevel: number
  minStock: number
  maxStock: number
}

export function ProductInsightsCard({
  invoiceRows,
  inventory,
}: {
  invoiceRows: InvoiceRowSchemaT[]
  inventory: ProductInventorySchemaT[]
}) {
  const t = useTranslations()

  if (!invoiceRows.length) {
    return (
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
            <PackageIcon size={20} />
            {t("Product Performance")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Product sales and inventory analysis")}
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

  // Aggregate product performance data
  const productPerformance = invoiceRows.reduce(
    (acc, row) => {
      const existing = acc[row.productId] || {
        productId: row.productId,
        name: row.name,
        totalRevenue: 0,
        totalQuantity: 0,
        averagePrice: 0,
        stockLevel: 0,
        minStock: 0,
        maxStock: 0,
      }

      existing.totalRevenue += row.total
      existing.totalQuantity += row.quantity
      existing.averagePrice = existing.totalRevenue / existing.totalQuantity

      // Add inventory data if available
      const inventoryData = inventory.find(
        (inv) => inv.productId === row.productId
      )
      if (inventoryData) {
        existing.stockLevel = inventoryData.stock
        existing.minStock = inventoryData.minStock
        existing.maxStock = inventoryData.maxStock
      }

      acc[row.productId] = existing
      return acc
    },
    {} as Record<string, ProductPerformance>
  )

  // Convert to array and sort by revenue
  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)

  // Prepare chart data
  const chartData = topProducts.map((product) => {
    // Calculate stock percentage safely
    const stockPercentage =
      product.maxStock > 0 ? (product.stockLevel / product.maxStock) * 100 : 0

    return {
      name:
        product.name.length > 15
          ? product.name.slice(0, 15) + "..."
          : product.name,
      revenue: product.totalRevenue,
      quantity: product.totalQuantity,
      stockLevel: product.stockLevel,
      stockPercentage: Math.min(100, Math.max(0, stockPercentage)), // Ensure percentage is between 0-100
    }
  })

  const config = {
    revenue: {
      label: t("Revenue"),
      theme: {
        light: "rgb(34, 197, 94)",
        dark: "rgb(34, 197, 94)",
      },
    },
    quantity: {
      label: t("Quantity Sold"),
      theme: {
        light: "rgb(99, 102, 241)",
        dark: "rgb(99, 102, 241)",
      },
    },
    stockPercentage: {
      // Changed from 'stock' to 'stockPercentage' to match the data key
      label: t("Stock Level"),
      theme: {
        light: "rgb(249, 115, 22)",
        dark: "rgb(249, 115, 22)",
      },
    },
  }

  // Calculate summary metrics safely
  const totalRevenue = topProducts.reduce(
    (sum, product) => sum + product.totalRevenue,
    0
  )
  const totalQuantity = topProducts.reduce(
    (sum, product) => sum + product.totalQuantity,
    0
  )
  const avgStockLevel = Math.round(
    topProducts.reduce((sum, product) => {
      const percentage =
        product.maxStock > 0 ? (product.stockLevel / product.maxStock) * 100 : 0
      return sum + Math.min(100, Math.max(0, percentage))
    }, 0) / topProducts.length
  )

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
          <PackageIcon size={20} />
          {t("Product Performance")}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t(
                    "Shows top 5 products by revenue with their sales and inventory metrics"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Top products by revenue and inventory status")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {t("Top 5 Revenue")}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircleIcon className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t(
                        "Total revenue generated by the top 5 best-selling products"
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(totalRevenue)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">{t("Units Sold")}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircleIcon className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t("Total number of units sold for the top 5 products")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(totalQuantity)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {t("Avg Stock Level")}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircleIcon className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {t(
                        "Average stock level as a percentage of maximum stock capacity across top products"
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold tabular-nums">{avgStockLevel}%</p>
          </div>
        </div>

        <div className="relative">
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
                yAxisId="quantity"
                orientation="right"
                tickFormatter={(value) => formatNumber(value)}
                tick={{ fontSize: 12 }}
                label={{
                  value: t("Quantity"),
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
                          <div className="h-2 w-2 rounded-full bg-[rgb(99,102,241)]" />
                          <span className="text-sm">
                            {t("Quantity")}:{" "}
                            {formatNumber(payload[1]?.value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[rgb(249,115,22)]" />
                          <span className="text-sm">
                            {t("Stock Level")}:{" "}
                            {formatNumber(payload[2]?.value as number)}%
                          </span>
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
                yAxisId="quantity"
                type="monotone"
                dataKey="quantity"
                stroke="rgb(99, 102, 241)"
                strokeWidth={2}
              />
              <Line
                yAxisId="quantity"
                type="monotone"
                dataKey="stockPercentage"
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
          <div className="absolute right-0 top-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t(
                      "Green bars show revenue, blue line shows quantity sold, and orange line shows current stock level as % of maximum stock"
                    )}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {t(
            "Chart shows product revenue (bars), quantity sold (blue line), and current stock level % (orange line)"
          )}
        </div>
      </CardContent>
    </Card>
  )
}
