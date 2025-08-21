"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createProducts } from "@/db/app/actions"
import { checkProductDuplicates } from "@/db/app/loaders"
import { cn } from "@/lib/utils"
import { entityStatus, productUnit } from "@/orm/app/schema"
import {
  ProductBulkFormProvider,
  ProductBulkFormSchemaT,
  productDefaultValues,
} from "@/providers"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Loader2Icon,
  MapIcon,
  UploadIcon,
  XCircleIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { productAIColumns } from "../columns/productAI"
import { DataTable } from "../ui/data-table"

type Step =
  | "upload"
  | "mapping"
  | "validation"
  | "duplicates"
  | "review"
  | "importing"
  | "complete"

type ExcelData = {
  [key: string]: any
}[]

type ColumnMapping = {
  [excelColumn: string]: string | null
}

type ValidationError = {
  row: number
  column: string
  value: any
  error: string
  severity: "error" | "warning"
}

type ProductFormSchema = ProductBulkFormSchemaT["list"][0]

type ParsedProduct = ProductFormSchema & {
  _rowIndex: number
  _validationErrors: ValidationError[]
  _isDuplicate?: boolean
  _duplicateAction?: "skip" | "update" | "import"
}

const requiredFields: {
  key: keyof ProductFormSchema
  label: string
  required: boolean
}[] = [
  { key: "name", label: "Product Name", required: true },
  { key: "price", label: "Price", required: true },
  { key: "unit", label: "Unit", required: true },
  { key: "status", label: "Status", required: true },
]

const optionalFields: {
  key: keyof ProductFormSchema
  label: string
  required: boolean
}[] = [
  { key: "description", label: "Description", required: false },
  { key: "barcode", label: "Barcode", required: false },
  { key: "purchasePrice", label: "Purchase Price", required: false },
  { key: "taxPercentage", label: "Tax Percentage", required: false },
  { key: "isFavorite", label: "Is Favorite", required: false },
]

const allFields = [...requiredFields, ...optionalFields]

const UploadStep = ({
  onNext,
  setExcelData,
  setFileName,
}: {
  onNext: () => void
  setExcelData: (data: ExcelData) => void
  setFileName: (name: string) => void
}) => {
  const t = useTranslations()
  const [isDragActive, setIsDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
        toast.error(
          t("Please select a valid Excel or CSV file") + " (.xlsx, .xls, .csv)"
        )
        return
      }

      setIsProcessing(true)
      try {
        const buffer = await file.arrayBuffer()
        let data: any[]

        if (file.name.match(/\.csv$/)) {
          // For CSV files, try different encodings and let XLSX handle delimiter detection
          let text: string
          try {
            // Try UTF-8 first
            text = new TextDecoder("utf-8").decode(buffer)
          } catch {
            try {
              // Fallback to UTF-16 if UTF-8 fails
              text = new TextDecoder("utf-16").decode(buffer)
            } catch {
              // Final fallback to latin1
              text = new TextDecoder("latin1").decode(buffer)
            }
          }

          // XLSX can automatically detect CSV delimiters (comma, semicolon, tab, etc.)
          const workbook = XLSX.read(text, {
            type: "string",
            // Let XLSX auto-detect the delimiter
            FS: undefined,
          })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          data = XLSX.utils.sheet_to_json(worksheet)
        } else {
          // For Excel files, read as binary
          const workbook = XLSX.read(buffer, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          data = XLSX.utils.sheet_to_json(worksheet)
        }

        if (data.length === 0) {
          toast.error(t("The file appears to be empty"))
          return
        }

        setExcelData(data as ExcelData)
        setFileName(file.name)
        onNext()
      } catch (error) {
        console.error("Error processing file:", error)
        toast.error(t("Failed to process file"))
      } finally {
        setIsProcessing(false)
      }
    },
    [onNext, setExcelData, setFileName, t]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragActive(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile]
  )

  const downloadTemplate = (format: "excel" | "csv" = "excel") => {
    const templateData = [
      {
        "Product Name": "Example Product",
        Price: 10.99,
        "Purchase Price": 8.5,
        Unit: "XPP",
        Status: "active",
        "Tax Percentage": 20,
        Description: "Example product description",
        Barcode: "1234567890123",
        "Is Favorite": false,
      },
    ]

    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Products")

    if (format === "csv") {
      XLSX.writeFile(wb, "product-import-template.csv")
    } else {
      XLSX.writeFile(wb, "product-import-template.xlsx")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheetIcon className="h-5 w-5" />
            {t("Upload Excel or CSV File")}
          </CardTitle>
          <CardDescription>
            {t("Upload your Excel or CSV file containing product data")}.{" "}
            {t("Supported formats")}: .xlsx, .xls, .csv
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25",
              isProcessing && "pointer-events-none opacity-50"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragActive(true)
            }}
            onDragLeave={() => setIsDragActive(false)}
          >
            {isProcessing ? (
              <div className="space-y-2">
                <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("Processing file")}...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <UploadIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Drag and drop your Excel or CSV file here")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("or click to browse")}
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="excel-upload"
                />
                <Label htmlFor="excel-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    className="pointer-events-none"
                  >
                    <UploadIcon className="h-4 w-4" />
                    {t("Choose File")}
                  </Button>
                </Label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => downloadTemplate("excel")}
                className="flex items-center gap-2"
                size="sm"
              >
                <DownloadIcon className="h-4 w-4" />
                {t("Excel Template")}
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadTemplate("csv")}
                className="flex items-center gap-2"
                size="sm"
              >
                <DownloadIcon className="h-4 w-4" />
                {t("CSV Template")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Use our template for best results")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const MappingStep = ({
  excelData,
  fileName,
  onNext,
  onBack,
  columnMapping,
  setColumnMapping,
}: {
  excelData: ExcelData
  fileName: string
  onNext: () => void
  onBack: () => void
  columnMapping: ColumnMapping
  setColumnMapping: (mapping: ColumnMapping) => void
}) => {
  const t = useTranslations()
  const excelColumns = excelData.length > 0 ? Object.keys(excelData[0]) : []

  const handleMappingChange = (
    excelColumn: string,
    targetField: string | null
  ) => {
    const newMapping = { ...columnMapping }
    newMapping[excelColumn] = targetField
    setColumnMapping(newMapping)
  }

  const canProceed = requiredFields.every((field) =>
    Object.values(columnMapping).includes(field.key)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          {t("Column Mapping")}
        </CardTitle>
        <CardDescription>
          {t("Map your Excel columns to product fields")} - {fileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {excelColumns.map((column) => (
            <div
              key={column}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex-1">
                <Label className="font-medium">{column}</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sample: {String(excelData[0][column]).substring(0, 50)}
                  {String(excelData[0][column]).length > 50 && "..."}
                </p>
              </div>
              <div className="max-w-xs flex-1">
                <Select
                  value={columnMapping[column] || ""}
                  onValueChange={(value) =>
                    handleMappingChange(column, value || null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">Skip this column</SelectItem> */}
                    {allFields.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {t("Required fields")}:
            </Badge>
            {requiredFields.map((field) => (
              <Badge
                key={field.key}
                variant={
                  Object.values(columnMapping).includes(field.key)
                    ? "default"
                    : "destructive"
                }
                className="text-xs"
              >
                {field.label}
              </Badge>
            ))}
          </div>

          {!canProceed && (
            <Alert className="mb-4">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                {t("Please map all required fields before proceeding")}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
            {t("Back")}
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            {t("Next")}
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const ValidationStep = ({
  parsedProducts,
  onNext,
  onBack,
}: {
  parsedProducts: ParsedProduct[]
  onNext: () => void
  onBack: () => void
}) => {
  const t = useTranslations()

  const errorCount = parsedProducts.reduce(
    (acc, product) =>
      acc +
      product._validationErrors.filter((e) => e.severity === "error").length,
    0
  )

  const warningCount = parsedProducts.reduce(
    (acc, product) =>
      acc +
      product._validationErrors.filter((e) => e.severity === "warning").length,
    0
  )

  const canProceed = errorCount === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          {t("Data Validation")}
        </CardTitle>
        <CardDescription>
          {t("Review validation results for your products")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {parsedProducts.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("Total Products")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
              <div className="text-sm text-muted-foreground">{t("Errors")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {warningCount}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("Warnings")}
              </div>
            </CardContent>
          </Card>
        </div>

        {errorCount > 0 && (
          <Alert variant="destructive">
            <XCircleIcon className="h-4 w-4" />
            <AlertDescription>
              {t("Please fix all errors before importing products")}
            </AlertDescription>
          </Alert>
        )}

        {warningCount > 0 && errorCount === 0 && (
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              {t(
                "There are warnings that you may want to review, but you can still proceed"
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
            {t("Back")}
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            {t("Check for Duplicates")}
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const DuplicatesStep = ({
  parsedProducts,
  onNext,
  onBack,
  setParsedProducts,
}: {
  parsedProducts: ParsedProduct[]
  onNext: () => void
  onBack: () => void
  setParsedProducts: (products: ParsedProduct[]) => void
}) => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const [isChecking, setIsChecking] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const duplicates = parsedProducts.filter((p) => p._isDuplicate)
  const nonDuplicates = parsedProducts.filter((p) => !p._isDuplicate)

  const checkDuplicates = async () => {
    setIsChecking(true)
    try {
      const productNames = parsedProducts
        .filter(
          (p) =>
            p._validationErrors.filter((e) => e.severity === "error").length ===
            0
        )
        .map((p) => p.name)

      const existingProducts = await checkProductDuplicates({
        orgId,
        unitId,
        productNames,
      })

      const existingNames = new Set(existingProducts.map((p) => p.name))

      const updatedProducts = parsedProducts.map((product) => ({
        ...product,
        _isDuplicate: existingNames.has(product.name),
        _duplicateAction: existingNames.has(product.name)
          ? ("skip" as const)
          : ("import" as const),
      }))

      setParsedProducts(updatedProducts)
      setHasChecked(true)
    } catch (error) {
      console.error("Error checking duplicates:", error)
      toast.error(t("Failed to check for duplicates"))
    } finally {
      setIsChecking(false)
    }
  }

  const handleDuplicateAction = (
    productIndex: number,
    action: "skip" | "update" | "import"
  ) => {
    const updatedProducts = [...parsedProducts]
    updatedProducts[productIndex]._duplicateAction = action
    setParsedProducts(updatedProducts)
  }

  const canProceed =
    hasChecked && duplicates.every((p) => p._duplicateAction !== undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          {t("Duplicate Detection")}
        </CardTitle>
        <CardDescription>
          {t("Check for existing products with the same name")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasChecked ? (
          <div className="py-8 text-center">
            <Button onClick={checkDuplicates} disabled={isChecking} size="lg">
              {isChecking ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  {t("Checking for Duplicates")}...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  {t("Check for Duplicates")}
                </>
              )}
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "We'll check if any products with the same names already exist"
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {nonDuplicates.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("New Products")}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {duplicates.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Potential Duplicates")}
                  </div>
                </CardContent>
              </Card>
            </div>

            {duplicates.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Handle Duplicate Products:</h4>
                {duplicates.map((product, index) => {
                  const actualIndex = parsedProducts.findIndex(
                    (p) => p._rowIndex === product._rowIndex
                  )
                  return (
                    <div
                      key={product._rowIndex}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Row {product._rowIndex} - ${product.price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={
                            product._duplicateAction === "skip"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleDuplicateAction(actualIndex, "skip")
                          }
                        >
                          {t("Skip")}
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            product._duplicateAction === "import"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleDuplicateAction(actualIndex, "import")
                          }
                        >
                          {t("Import Anyway")}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {duplicates.length === 0 && (
              <Alert>
                <CheckCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  {t("Great! No duplicate products found")}.{" "}
                  {t("All products are ready to import")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
            {t("Back")}
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            {t("Continue to Review")}
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const ReviewStep = ({
  parsedProducts,
  onNext,
  onBack,
}: {
  parsedProducts: ParsedProduct[]
  onNext: () => void
  onBack: () => void
}) => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<GlobalParamsT>()

  const validProducts = parsedProducts.filter(
    (p) =>
      p._validationErrors.filter((e) => e.severity === "error").length === 0 &&
      p._duplicateAction !== "skip"
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            {t("Review Products")}
          </CardTitle>
          <CardDescription>
            {t("Review the products that will be imported")} (
            {validProducts.length} {t("products")})
          </CardDescription>
        </CardHeader>
      </Card>

      <DataTable
        columns={productAIColumns}
        data={validProducts.map((item) => ({
          ...item,
          id: "",
          unitId,
          orgId,
          createdAt: new Date().toISOString(),
          productInventories: [],
          productCategories: [],
          barcode: item.barcode ?? null,
          description: item.description ?? null,
          imageBucketPath: item.imageBucketPath ?? null,
        }))}
      />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4" />
          {t("Back")}
        </Button>
        <Button onClick={onNext} disabled={validProducts.length === 0}>
          {t("Import Products")} ({validProducts.length})
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const ImportingStep = ({
  progress,
  currentProduct,
  totalProducts,
}: {
  progress: number
  currentProduct: number
  totalProducts: number
}) => {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2Icon className="h-5 w-5 animate-spin" />
          {t("Importing Products")}
        </CardTitle>
        <CardDescription>
          {t("Please wait while we import your products")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {currentProduct} / {totalProducts}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="text-center">
            <p className="font-medium text-foreground">
              {t("Importing product")} {currentProduct} {t("of")}{" "}
              {totalProducts}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("This may take a few moments")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CompleteStep = ({
  onStartOver,
  importedCount,
  skippedCount,
}: {
  onStartOver: () => void
  importedCount: number
  skippedCount: number
}) => {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircleIcon className="h-5 w-5" />
          {t("Import Complete!")}
        </CardTitle>
        <CardDescription>
          {t("Your products have been successfully imported")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />

        <div className="space-y-2 text-center">
          <p className="font-medium">
            {t("{count} products imported successfully", {
              count: importedCount,
            })}
          </p>
          {skippedCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {t("{count} products were skipped due to errors", {
                count: skippedCount,
              })}
            </p>
          )}
        </div>

        <Button onClick={onStartOver} className="min-w-32">
          {t("Import More")}
        </Button>
      </CardContent>
    </Card>
  )
}

const Content = () => {
  const t = useTranslations()
  const form = useFormContext<ProductBulkFormSchemaT>()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<Step>("upload")
  const [excelData, setExcelData] = useState<ExcelData>([])
  const [fileName, setFileName] = useState("")
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [currentImportIndex, setCurrentImportIndex] = useState(0)
  const [importedCount, setImportedCount] = useState(0)
  const [skippedCount, setSkippedCount] = useState(0)

  // Parse and validate products when mapping changes
  useEffect(() => {
    if (
      (currentStep === "validation" || currentStep === "duplicates") &&
      excelData.length > 0 &&
      Object.keys(columnMapping).length > 0
    ) {
      const parsed: ParsedProduct[] = excelData.map((row, index) => {
        const product: any = {
          ...productDefaultValues,
          _rowIndex: index + 1,
          _validationErrors: [],
        }
        const errors: ValidationError[] = []

        // Map columns
        Object.entries(columnMapping).forEach(([excelCol, targetField]) => {
          if (
            targetField &&
            row[excelCol] !== undefined &&
            row[excelCol] !== null &&
            row[excelCol] !== ""
          ) {
            const value = row[excelCol]

            // Type conversion and validation
            switch (targetField) {
              case "price":
              case "purchasePrice":
                const numValue = Number(value)
                if (isNaN(numValue) || numValue < 0) {
                  errors.push({
                    row: index + 1,
                    column: excelCol,
                    value,
                    error: "Must be a positive number",
                    severity: "error",
                  })
                } else {
                  product[targetField] = numValue
                }
                break

              case "taxPercentage":
                const taxValue = Number(value)
                if (isNaN(taxValue) || taxValue < 0 || taxValue > 100) {
                  errors.push({
                    row: index + 1,
                    column: excelCol,
                    value,
                    error: "Tax percentage must be between 0 and 100",
                    severity: "error",
                  })
                } else {
                  product[targetField] = taxValue
                }
                break

              case "unit":
                if (!productUnit.enumValues.includes(value)) {
                  errors.push({
                    row: index + 1,
                    column: excelCol,
                    value,
                    error:
                      "Invalid unit. Must be one of: " +
                      productUnit.enumValues.join(", "),
                    severity: "error",
                  })
                } else {
                  product[targetField] = value
                }
                break

              case "status":
                if (!entityStatus.enumValues.includes(value)) {
                  errors.push({
                    row: index + 1,
                    column: excelCol,
                    value,
                    error: "Invalid status. Must be: active or inactive",
                    severity: "error",
                  })
                } else {
                  product[targetField] = value
                }
                break

              case "isFavorite":
                const boolValue = String(value).toLowerCase()
                if (["true", "1", "yes", "y"].includes(boolValue)) {
                  product[targetField] = true
                } else if (["false", "0", "no", "n", ""].includes(boolValue)) {
                  product[targetField] = false
                } else {
                  errors.push({
                    row: index + 1,
                    column: excelCol,
                    value,
                    error: "Must be true/false, yes/no, or 1/0",
                    severity: "warning",
                  })
                  product[targetField] = false
                }
                break

              case "name":
              case "description":
              case "barcode":
                product[targetField] = String(value).trim()
                break

              default:
                product[targetField] = value
            }
          }
        })

        // Check required fields
        requiredFields.forEach((field) => {
          if (
            !product[field.key] ||
            (typeof product[field.key] === "string" &&
              product[field.key].trim() === "")
          ) {
            errors.push({
              row: index + 1,
              column: field.key,
              value: product[field.key],
              error: "This field is required",
              severity: "error",
            })
          }
        })

        product._validationErrors = errors
        return product as ParsedProduct
      })

      setParsedProducts(parsed)
    }
  }, [currentStep, excelData, columnMapping, t])

  const handleImportProducts = async () => {
    const validProducts = parsedProducts.filter(
      (p) =>
        p._validationErrors.filter((e) => e.severity === "error").length ===
          0 && p._duplicateAction !== "skip"
    )

    if (validProducts.length === 0) {
      toast.error(t("No valid products to import"))
      return
    }

    setCurrentStep("importing")
    setImportProgress(0)
    setCurrentImportIndex(0)

    try {
      // Import in batches to show progress
      const batchSize = 1000
      let imported = 0
      let skipped = parsedProducts.length - validProducts.length

      for (let i = 0; i < validProducts.length; i += batchSize) {
        const batch = validProducts.slice(i, i + batchSize)
        setCurrentImportIndex(i + batch.length)
        setImportProgress(((i + batch.length) / validProducts.length) * 100)

        // Remove validation metadata before sending to server
        const cleanBatch = batch.map(
          ({ _rowIndex, _validationErrors, ...product }) => product
        )

        await createProducts({
          values: cleanBatch,
          unitId,
          orgId,
        })

        imported += batch.length

        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      setImportedCount(imported)
      setSkippedCount(skipped)
      setCurrentStep("complete")

      toast.success(t("Products imported successfully"))
      router.refresh()
    } catch (error) {
      console.error("Import error:", error)
      toast.error(t("Failed to import products"))
      setCurrentStep("review")
    }
  }

  const resetFlow = () => {
    setCurrentStep("upload")
    setExcelData([])
    setFileName("")
    setColumnMapping({})
    setParsedProducts([])
    setImportProgress(0)
    setCurrentImportIndex(0)
    setImportedCount(0)
    setSkippedCount(0)
    form.setValue("list", [])
  }

  const steps: Step[] = [
    "upload",
    "mapping",
    "validation",
    "duplicates",
    "review",
    "importing",
    "complete",
  ]

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <FileSpreadsheetIcon className="h-5 w-5" />
          {t("Excel/CSV Product Import")}
        </SheetTitle>
        <SheetDescription>
          {t(
            "Import products from Excel or CSV files with advanced validation and mapping"
          )}
        </SheetDescription>
      </SheetHeader>

      {/* Step Indicator */}
      <div className="my-6 flex items-center justify-center space-x-2">
        {steps.slice(0, -2).map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                currentStep === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : steps.indexOf(currentStep) > index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
              )}
            >
              {steps.indexOf(currentStep) > index ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.slice(0, -2).length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8",
                  steps.indexOf(currentStep) > index ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === "upload" && (
        <UploadStep
          onNext={() => setCurrentStep("mapping")}
          setExcelData={setExcelData}
          setFileName={setFileName}
        />
      )}

      {currentStep === "mapping" && (
        <MappingStep
          excelData={excelData}
          fileName={fileName}
          onNext={() => setCurrentStep("validation")}
          onBack={() => setCurrentStep("upload")}
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
        />
      )}

      {currentStep === "validation" && (
        <ValidationStep
          parsedProducts={parsedProducts}
          onNext={() => setCurrentStep("duplicates")}
          onBack={() => setCurrentStep("mapping")}
        />
      )}

      {currentStep === "duplicates" && (
        <DuplicatesStep
          parsedProducts={parsedProducts}
          onNext={() => setCurrentStep("review")}
          onBack={() => setCurrentStep("validation")}
          setParsedProducts={setParsedProducts}
        />
      )}

      {currentStep === "review" && (
        <ReviewStep
          parsedProducts={parsedProducts}
          onNext={handleImportProducts}
          onBack={() => setCurrentStep("validation")}
        />
      )}

      {currentStep === "importing" && (
        <ImportingStep
          progress={importProgress}
          currentProduct={currentImportIndex}
          totalProducts={
            parsedProducts.filter(
              (p) =>
                p._validationErrors.filter((e) => e.severity === "error")
                  .length === 0
            ).length
          }
        />
      )}

      {currentStep === "complete" && (
        <CompleteStep
          onStartOver={resetFlow}
          importedCount={importedCount}
          skippedCount={skippedCount}
        />
      )}
    </div>
  )
}

const Btn = () => {
  const t = useTranslations()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <FileSpreadsheetIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">
            {t("Import from Excel/CSV")}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-dvh overflow-y-auto sm:max-w-4xl">
        <ProductBulkFormProvider>
          <Content />
        </ProductBulkFormProvider>
      </SheetContent>
    </Sheet>
  )
}

export { Btn as ExcelImportBtn }
