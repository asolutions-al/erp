import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { publicStorageUrl } from "@/constants/consts"
import { createClient } from "@/db/app/client"
import { cn } from "@/lib/utils"
import { TrashIcon } from "lucide-react"
import { nanoid } from "nanoid"
import Image from "next/image"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"

interface ImageUploaderProps {
  bucket: string
  field: string
  title?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  onUpload?: (path: string | null) => void
}

export function ImageUploader({
  bucket,
  field,
  title = "Image",
  description = "Upload and manage image",
  placeholder = "/placeholder.svg",
  disabled = false,
  onUpload,
}: ImageUploaderProps) {
  const form = useFormContext<any>()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = (s: string) => s // fallback if no i18n

  const imgBucketPath = useWatch({
    control: form.control,
    name: field,
  })

  const upload = async (file: File) => {
    try {
      setError(null)
      setIsUploading(true)
      const client = createClient()
      const res = await client.storage.from(bucket).upload(nanoid(), file)
      if (res.error) throw res.error
      form.setValue(field, res.data?.path, { shouldDirty: true })
      onUpload?.(res.data?.path ?? null)
    } catch (error) {
      setError(t("An error occurred"))
      toast.error(t("An error occurred"))
    } finally {
      setIsUploading(false)
    }
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div
            className={cn(
              "relative mx-auto flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors",
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
              if (isUploading || disabled) return
              document.getElementById(`${field}-image-input`)?.click()
            }}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                !isUploading &&
                !disabled
              ) {
                document.getElementById(`${field}-image-input`)?.click()
              }
            }}
          >
            <input
              id={`${field}-image-input`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading || disabled}
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
            ) : imgBucketPath ? (
              <>
                <Image
                  alt={t("Image")}
                  className="aspect-square w-full rounded-md object-cover"
                  height={300}
                  src={`${publicStorageUrl}/${bucket}/${imgBucketPath}`}
                  width={300}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={(e) => {
                    e.preventDefault()
                    form.setValue(field, null, { shouldDirty: true })
                    onUpload?.(null)
                  }}
                  disabled={isUploading || disabled}
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
        </div>
      </CardContent>
    </Card>
  )
}
