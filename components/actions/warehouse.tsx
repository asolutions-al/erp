"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getWarehouseProducts, markWarehouseAsFavorite } from "@/db/app/actions"
import {
  CategorySchemaT,
  ProductCategorySchemaT,
  ProductInventorySchemaT,
  ProductSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { canEdit } from "@/lib/utils"
import { CellContext } from "@tanstack/react-table"
import {
  CopyPlusIcon,
  EditIcon,
  MoreHorizontalIcon,
  PackageIcon,
  StarIcon,
  StarOffIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { productColumns } from "../columns/product"
import { DataTable } from "../ui/data-table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"

type SchemaT = WarehouseSchemaT & {
  productInventories: (Pick<ProductInventorySchemaT, "stock"> & {
    product: Pick<ProductSchemaT, "status">
  })[]
}

const Actions = ({ row, table }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const { role } = table.options.meta as GlobalTableMetaT
  const t = useTranslations()
  const { unitId, orgId } = useParams<GlobalParamsT>()
  const router = useRouter()
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseSchemaT | null>(null)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("Open menu")}</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
          {canEdit(role) && (
            <Link
              href={`/o/${orgId}/u/${unitId}/warehouse/${original.id}/update`}
              passHref
            >
              <DropdownMenuItem>
                <EditIcon />
                {t("Edit")}
              </DropdownMenuItem>
            </Link>
          )}
          <Link
            href={`/o/${orgId}/u/${unitId}/warehouse/${original.id}/duplicate`}
            passHref
          >
            <DropdownMenuItem>
              <CopyPlusIcon />
              {t("Duplicate")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSelectedWarehouse(original)}>
            <PackageIcon />
            {t("View products")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              try {
                await markWarehouseAsFavorite({
                  id: original.id,
                  isFavorite: !original.isFavorite,
                })
                toast.success(t("Warehouse saved successfully"))
                router.refresh()
              } catch (error) {
                toast.error(t("An error occurred"))
              }
            }}
          >
            {original.isFavorite ? <StarOffIcon /> : <StarIcon />}
            {original.isFavorite
              ? t("Unmark as favorite")
              : t("Mark as favorite")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductsSheet
        warehouse={selectedWarehouse}
        onOpenChange={(open) => {
          if (!open) setSelectedWarehouse(null)
        }}
        meta={table.options.meta as GlobalTableMetaT}
      />
    </>
  )
}

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

const ProductsSheet = ({
  warehouse,
  onOpenChange,
  meta,
}: {
  warehouse: WarehouseSchemaT | null
  onOpenChange: (open: boolean) => void
  meta: GlobalTableMetaT
}) => {
  return (
    <>
      <Sheet open={!!warehouse} onOpenChange={onOpenChange}>
        <SheetContent className="flex min-w-[800px] flex-col sm:max-w-[800px]">
          {warehouse && (
            <ProductsSheetContent
              warehouse={warehouse}
              onClose={() => onOpenChange(false)}
              meta={meta}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

const ProductsSheetContent = ({
  warehouse,
  onClose,
  meta,
}: {
  warehouse: WarehouseSchemaT
  onClose: () => void
  meta: GlobalTableMetaT
}) => {
  const [products, setProducts] = useState<
    (ProductSchemaT & {
      productInventories: Pick<ProductInventorySchemaT, "stock">[]
      productCategories: (ProductCategorySchemaT & {
        category: CategorySchemaT
      })[]
    })[]
  >([])
  const [loading, setLoading] = useState(false)
  const { unitId } = useParams<GlobalParamsT>()
  const t = useTranslations()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const result = await getWarehouseProducts({
          warehouseId: warehouse.id,
          unitId,
        })
        setProducts(result)
      } catch (error) {
        toast.error("Failed to load warehouse products")
        onClose()
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [warehouse, unitId])

  return (
    <>
      <SheetHeader className="mb-4">
        <SheetTitle>
          {t("Products in {name}", { name: warehouse.name })}
        </SheetTitle>
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <SheetDescription>
            {t("{count} products", { count: products.length })}
          </SheetDescription>
        )}
      </SheetHeader>

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={productColumns} data={products} meta={meta} />
      )}
    </>
  )
}

export { Actions as WarehouseActions }
