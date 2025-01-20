import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ProductSchemaT } from "@/db/(inv)/schema"
import { PlusIcon } from "lucide-react"
import Image from "next/image"

const Component = ({
  data,
  onSelect,
}: {
  data: ProductSchemaT
  onSelect: () => void
}) => {
  const category = "Clothing"
  const unit = "pcs"
  return (
    <Card className="group relative space-y-4 overflow-hidden">
      <figure className="group-hover:opacity-90">
        <Badge className="absolute top-3 right-3" variant="secondary">
          {category}
        </Badge>
        <Image
          className="aspect-square w-full"
          src="/placeholder.svg"
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
      <CardFooter className="p-0 border-t">
        <Button
          variant="ghost"
          className="w-full"
          type="button"
          onClick={() => onSelect()}
        >
          <PlusIcon className="size-4 me-1" /> Add to Card
        </Button>
      </CardFooter>
    </Card>
  )
}

export { Component as SaleProductCard }
