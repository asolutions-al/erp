"use client"

import { ImageBucketUploader } from "@/components/image-bucket-uploader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createProducts } from "@/db/app/actions"
import { analyzeImageProducts } from "@/lib/ai/analyze-product"
import { cn } from "@/lib/utils"
import {
  ProductBulkFormProvider,
  ProductBulkFormSchemaT,
  productDefaultValues,
} from "@/providers"
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  Loader2Icon,
  LoaderIcon,
  ScanSearchIcon,
  UploadIcon,
  Wand2Icon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { productAIColumns } from "../columns/productAI"
import { DataTable } from "../ui/data-table"

type Step = "upload" | "analyzing" | "review" | "complete"

const UploadStep = ({
  path,
  setPath,
  onNext,
}: {
  path: string | null
  setPath: (path: string | null) => void
  onNext: () => void
}) => {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadIcon className="h-5 w-5" />
          {t("Upload Image")}
        </CardTitle>
        <CardDescription>
          {t("Upload a clear photo of your menu or product catalog")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageBucketUploader
          bucket="ai-analysis"
          path={path}
          setPath={setPath}
        />
        <div className="flex justify-end">
          <Button onClick={onNext} disabled={!path}>
            {t("Next")}
            <ChevronRightIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const AnalyzingStep = () => {
  const t = useTranslations()
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    {
      text: t("Processing image"),
      description: t("AI is examining your uploaded image"),
    },
    {
      text: t("Detecting products"),
      description: t("Identifying individual products and items"),
    },
    {
      text: t("Extracting details"),
      description: t("Reading names, prices, and descriptions"),
    },
    {
      text: t("Finalizing analysis"),
      description: t("Organizing extracted product information"),
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5

        // Update phase based on progress
        if (newProgress >= 25 && currentPhase === 0) {
          setCurrentPhase(1)
        } else if (newProgress >= 50 && currentPhase === 1) {
          setCurrentPhase(2)
        } else if (newProgress >= 75 && currentPhase === 2) {
          setCurrentPhase(3)
        }

        return Math.min(newProgress, 95) // Cap at 95% to show continuous progress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [currentPhase])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanSearchIcon className="h-5 w-5" />
          {t("Analyzing Image")}
        </CardTitle>
        <CardDescription>
          {t("AI is analyzing your image to extract product information")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2Icon className="h-12 w-12 animate-spin text-primary" />

          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Dynamic Phase Text */}
          <div className="space-y-2 text-center">
            <p className="font-medium text-foreground">
              {phases[currentPhase].text}
            </p>
            <p className="text-sm text-muted-foreground">
              {phases[currentPhase].description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ReviewStep = ({
  onBack,
  onNext: onComplete,
}: {
  onBack: () => void
  onNext: () => void
}) => {
  const t = useTranslations()
  const form = useFormContext<ProductBulkFormSchemaT>()
  const [isLoading, setIsLoading] = useState(false)
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const router = useRouter()

  const products = useWatch({
    control: form.control,
    name: "list",
  })

  const handleCreateProducts = async () => {
    try {
      setIsLoading(true)
      await createProducts({
        values: products,
        unitId,
        orgId,
      })
      setIsLoading(false)
      toast.success(t("Products created successfully"))
      router.refresh()
      onComplete()
    } catch (error) {
      toast.error(t("Failed to create products"))
    }
  }

  return (
    <>
      <DataTable
        columns={productAIColumns}
        // TODO: check below values
        data={products.map((item) => ({
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

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="min-w-20"
          disabled={isLoading}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("Back")}
        </Button>
        <Button
          onClick={handleCreateProducts}
          disabled={products.length === 0 || isLoading}
          className="min-w-20"
        >
          {isLoading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircleIcon className="h-4 w-4" />
          )}
          {t("Create Products")}
        </Button>
      </div>
    </>
  )
}

const CompleteStep = ({ onStartOver }: { onStartOver: () => void }) => {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircleIcon className="h-5 w-5" />
          {t("Success!")}
        </CardTitle>
        <CardDescription>
          {t("All products have been created successfully")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
        <p className="text-center text-sm text-muted-foreground">
          {t(
            "Products have been created and are now available in your product list"
          )}
        </p>
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
  const [currentStep, setCurrentStep] = useState<Step>("upload")
  const [path, setPath] = useState<string | null>(null)

  const handleAnalyzeImage = async () => {
    if (!path) return

    setCurrentStep("analyzing")

    const response = await analyzeImageProducts(path)

    if (response.error) {
      toast.error(response.error.message)
      setCurrentStep("upload")
      return
    }

    if (response.success) {
      form.setValue(
        "list",
        response.success.data.map((item) => {
          const data: ProductBulkFormSchemaT["list"][0] = {
            ...productDefaultValues,
            name: item.name,
            price: item.price,
            description: item.description,
          }

          return data
        })
      )
      setCurrentStep("review")
    }
  }

  const handleBackToUpload = () => {
    setCurrentStep("upload")
    form.setValue("list", [])
  }

  const resetFlow = () => {
    setCurrentStep("upload")
    setPath(null)
    form.setValue("list", [])
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Wand2Icon className="h-5 w-5" />
          {t("AI Product Import")}
        </SheetTitle>
        <SheetDescription>
          {t(
            "Upload a photo of your menu or products to automatically extract product details"
          )}
        </SheetDescription>
      </SheetHeader>

      {/* Step Indicator */}
      <div className="my-6 flex items-center justify-center space-x-2">
        {["upload", "analyzing", "review", "complete"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                currentStep === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : index <
                      ["upload", "analyzing", "review", "complete"].indexOf(
                        currentStep
                      )
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
              )}
            >
              {index <
              ["upload", "analyzing", "review", "complete"].indexOf(
                currentStep
              ) ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < 3 && (
              <div
                className={cn(
                  "h-0.5 w-8",
                  index <
                    ["upload", "analyzing", "review", "complete"].indexOf(
                      currentStep
                    )
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === "upload" && (
        <UploadStep path={path} setPath={setPath} onNext={handleAnalyzeImage} />
      )}
      {currentStep === "analyzing" && <AnalyzingStep />}
      {currentStep === "review" && (
        <ReviewStep
          onBack={handleBackToUpload}
          onNext={() => setCurrentStep("complete")}
        />
      )}
      {currentStep === "complete" && <CompleteStep onStartOver={resetFlow} />}
    </div>
  )
}

const Btn = () => {
  const t = useTranslations()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2Icon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">{t("Import with AI")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-dvh sm:max-w-2xl">
        <ProductBulkFormProvider>
          <Content />
        </ProductBulkFormProvider>
      </SheetContent>
    </Sheet>
  )
}

export { Btn as AiItemImportBtn }
