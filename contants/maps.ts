import { payMethod } from "@/orm/app/schema"
import {
  CoinsIcon,
  CreditCardIcon,
  HandCoinsIcon,
  LandmarkIcon,
} from "lucide-react"

type PayMethodT = (typeof payMethod.enumValues)[number]
type IconT = typeof LandmarkIcon // temp solution, not sure how to get the type of the icon

const mapPayMethodIcon = (method: PayMethodT) => {
  const MAP: Record<PayMethodT, IconT> = {
    bank: LandmarkIcon,
    card: CreditCardIcon,
    cash: HandCoinsIcon,
    other: CoinsIcon,
  }
  return MAP[method]
}

export { mapPayMethodIcon }
