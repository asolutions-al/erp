import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { ProductSchemaT } from "@/db/app/schema"
import { PlusIcon } from "lucide-react"
import Image from "next/image"

const Component = ({
  data,
  onSelect,
}: {
  data: ProductSchemaT
  onSelect: () => void
}) => {
  const { imageBucketPath } = data
  const category = "Clothing"
  const unit = "pcs"

  return (
    <Card className="group relative space-y-4 overflow-hidden">
      <figure className="group-hover:opacity-90">
        <Badge className="absolute right-3 top-3" variant="secondary">
          {category}
        </Badge>
        <Image
          className="aspect-square w-full"
          src={
            imageBucketPath
              ? `${publicStorageUrl}/${productImagesBucket}/${imageBucketPath}`
              : "/placeholder.svg"
          }
          width={300}
          height={300}
          alt={data.name}
        />
      </figure>
      <CardContent className="px-4 py-0">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg">{data.name}</h3>
            <p className="text-sm text-muted-foreground">{unit}</p>
          </div>
          <p className="text-lg font-semibold">{data.price}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t p-0">
        <Button
          variant="ghost"
          className="w-full"
          type="button"
          onClick={() => onSelect()}
        >
          <PlusIcon className="me-1 size-4" /> Add to Card
        </Button>
      </CardFooter>
    </Card>
  )
}

export { Component as SaleProductCard }
