"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CategorySchemaT,
  ProductCategorySchemaT,
  ProductInventorySchemaT,
  ProductSchemaT,
} from "@/db/app/schema"
import { ProductBulkFormSchemaT, ProductFormProvider } from "@/providers"
import { CellContext, Row } from "@tanstack/react-table"
import {
  CheckCircleIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
  XCircleIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { FormActionBtns } from "../buttons"
import { ProductForm } from "../forms"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

type SchemaT = ProductSchemaT & {
  productInventories: Pick<ProductInventorySchemaT, "stock">[]
  productCategories: (ProductCategorySchemaT & {
    category: CategorySchemaT
  })[]
}

const Actions = ({ row, table }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const form = useFormContext<ProductBulkFormSchemaT>()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const { index } = row

  const handleRemove = () => {
    const updated = form.getValues("list").filter((_, i) => i !== index)
    form.setValue("list", updated)
    toast.success(t("Product removed successfully"))
  }

  return (
    <>
      <AlertDialog>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("Open menu")}</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <EditIcon />
              {t("Edit")}
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                {t("Remove")}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Remove Product")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Are you sure you want to remove this product")}:{" "}
              <strong>{row.original.name}</strong>?
              <br />
              {t(
                "This action cannot be undone and the product will be removed from the list"
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <XCircleIcon className="mr-2 h-4 w-4" />
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              {t("Yes, remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        row={row}
      />
    </>
  )
}

type EditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: Row<SchemaT>
}

const EditProductDialog = ({ open, onOpenChange, row }: EditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <EditProductDialogContent
          open={open}
          onOpenChange={onOpenChange}
          row={row}
        />
      </DialogContent>
    </Dialog>
  )
}

const EditProductDialogContent = ({ onOpenChange, row }: EditDialogProps) => {
  const t = useTranslations()
  const { original, index } = row
  const form = useFormContext<ProductBulkFormSchemaT>()

  return (
    <>
      <DialogHeader className="flex-row justify-between">
        <div>
          <DialogTitle>{t("Edit Product")}</DialogTitle>
          <DialogDescription>
            {t("Update the product information before creating")}
          </DialogDescription>
        </div>
        <FormActionBtns formId="product" />
      </DialogHeader>
      <ProductFormProvider defaultValues={original}>
        <div className="min-h-[80vh]">
          <ProductForm
            categories={[]}
            warehouses={[]}
            performAction={async (values) => {
              const existing = form.getValues("list")
              const updated = existing.map((item, i) =>
                i === index ? values : item
              )
              form.setValue("list", updated)
              onOpenChange(false)
            }}
            flow={{
              redirectAfterAction: false,
            }}
          />
        </div>
      </ProductFormProvider>
    </>
  )
}

export { Actions as ProductAIActions }
