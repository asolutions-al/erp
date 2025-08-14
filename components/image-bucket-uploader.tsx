import { Button } from "@/components/ui/button"
import { publicStorageUrl } from "@/constants/consts"
import { createClient } from "@/db/app/client"
import { generateAiImage } from "@/lib/ai"
import { cn } from "@/lib/utils"
import { LoaderIcon, TrashIcon, Wand2Icon } from "lucide-react"
import { nanoid } from "nanoid"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useId, useState } from "react"
import { toast } from "sonner"

interface Props {
  bucket: "productImages" | "customerImages" | "supplier" | "ai-analysis"
  path: string | null | undefined
  setPath: (path: string | null) => void

  aiGeneration?: {
    name: string
    description?: string | null
  }
}

const ImageBucketUploader = ({
  bucket,
  path,
  setPath,
  aiGeneration,
}: Props) => {
  const t = useTranslations()
  const id = useId()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setError(null)
    setIsUploading(true)
    const client = createClient()
    const res = await client.storage.from(bucket).upload(nanoid(), file)

    if (res.error) {
      setError(res.error.message)
      toast.error(res.error.message)
    }
    if (res.data) {
      setPath(res.data.path)
    }

    setIsUploading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      upload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      upload(file)
    }
  }

  return (
    <div className="grid gap-4">
      <div
        className={cn(
          "relative mx-auto flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted bg-muted/50"
        )}
        tabIndex={0}
        role="button"
        aria-label={t("Upload Image")}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (isUploading) return
          document.getElementById(id)?.click()
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isUploading) {
            document.getElementById(id)?.click()
          }
        }}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <svg
              className="mb-2 h-8 w-8 animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span className="text-sm text-muted-foreground">
              {t("Uploading")}...
            </span>
          </div>
        ) : path ? (
          <>
            <Image
              alt={t("Image")}
              className="aspect-square w-full rounded-md object-cover"
              height={300}
              src={`${publicStorageUrl}/${bucket}/${path}`}
              width={300}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={(e) => {
                e.preventDefault()
                setPath(null)
              }}
              disabled={isUploading}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <svg
              className="mb-2 h-12 w-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v8.25M3 16.5A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l1.4 1.4m0 0l2.1-2.1a2.25 2.25 0 013.18 0L21 16.5m-8.25-2.1l.97.97"
              />
            </svg>
            <span className="mb-1 text-center text-sm text-muted-foreground">
              {t("Drag & drop or click to upload")}
            </span>
          </div>
        )}
        {error && (
          <div className="absolute bottom-2 left-2 right-2 rounded bg-destructive/10 p-1 text-center text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      {aiGeneration && (
        <div className="space-y-2">
          <div className="text-center text-xs text-muted-foreground">
            {t("or")}
          </div>
          <AiGeneratorBtn
            name={aiGeneration.name}
            description={aiGeneration.description}
            onImageGenerated={upload}
          />
        </div>
      )}
    </div>
  )
}

const AiGeneratorBtn = ({
  name,
  description,
  onImageGenerated,
}: {
  name: string
  description?: string | null
  onImageGenerated: (imageFile: File) => void
}) => {
  const t = useTranslations()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateImage = async () => {
    setIsGenerating(true)

    const result = await generateAiImage({
      name,
      description,
    })

    if (result.error) return toast.error(result.error.message)

    if (result.success) {
      onImageGenerated(result.success.data.file)
      toast.success(t("Image generated successfully!"))
    }
    setIsGenerating(false)
  }

  const Icon = isGenerating ? LoaderIcon : Wand2Icon
  const text = isGenerating ? t("Generating") : t("Generate with AI")

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerateImage}
      disabled={isGenerating || !name.trim()}
      className="w-full"
    >
      <Icon className={cn(isGenerating && "animate-spin")} />
      {text}
    </Button>
  )
}

export { ImageBucketUploader }
