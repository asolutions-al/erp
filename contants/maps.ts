import { payMethod } from "@/orm/app/schema"
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subMonths,
  subWeeks,
} from "date-fns"
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

const mapRangeToStartEnd = (range: RangeT) => {
  const weekStartsOn = 1

  const MAP: Record<RangeT, [Date, Date]> = {
    today: [startOfToday(), endOfToday()],
    yesterday: [startOfYesterday(), endOfYesterday()],
    this_week: [
      startOfWeek(new Date(), { weekStartsOn }),
      endOfWeek(new Date(), { weekStartsOn }),
    ],
    last_week: [
      startOfWeek(subWeeks(new Date(), 1), { weekStartsOn }),
      endOfWeek(subWeeks(new Date(), 1), { weekStartsOn }),
    ],
    this_month: [startOfMonth(new Date()), endOfMonth(new Date())],
    last_month: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  }
  return MAP[range]
}

export { mapPayMethodIcon, mapRangeToStartEnd }
