"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-7 w-7"
      type="button"
      onClick={() => router.back()}
      disabled={disabled}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  )
}
