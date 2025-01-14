"use client"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export function BackButton() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-7 w-7"
      type="button"
      onClick={() => router.back()}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  )
}
