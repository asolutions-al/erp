import { GrowthCard } from "@/components/cards"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  CoinsIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  HandCoinsIcon,
  LandmarkIcon,
  TrendingDownIcon,
  TrendingUpIcon,
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
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Most revenue generating products")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 pt-2">
        {products.map((data, index) => (
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
        ))}
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
  ])

  const totalRevenue = topProducts.reduce((acc, p) => acc + p.total, 0)

  const productsWithPercentage = topProducts.map((product) => ({
    ...product,
    percentage: (product.total / totalRevenue) * 100,
  }))

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
        <div className="col-span-1 md:col-span-2">
          <TopProductsCard
            products={productsWithPercentage}
            orgId={orgId}
            unitId={unitId}
          />
        </div>
      </div>
    </>
  )
}

export default Page
