import { EntityStatusT, PayMethodT } from "@/types/enum"
import {
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns"
import {
  ArchiveIcon,
  CalendarDaysIcon,
  CalendarIcon,
  CalendarRangeIcon,
  CircleCheckIcon,
  CoinsIcon,
  CreditCardIcon,
  FileIcon,
  HandCoinsIcon,
  LandmarkIcon,
} from "lucide-react"

type IconT = typeof LandmarkIcon // temp solution, not sure how to get the type of the icon

const mapPayMethodIcon = (value: PayMethodT) => {
  const MAP: Record<PayMethodT, IconT> = {
    bank: LandmarkIcon,
    card: CreditCardIcon,
    cash: HandCoinsIcon,
    other: CoinsIcon,
  }
  return MAP[value]
}
const mapRangeIcon = (value: PeriodT) => {
  const MAP: Record<PeriodT, IconT> = {
    today: CalendarIcon,
    yesterday: CalendarDaysIcon,
    this_week: CalendarRangeIcon,
    last_week: CalendarRangeIcon,
    this_month: CalendarRangeIcon,
    last_month: CalendarRangeIcon, // TODO:
  }
  return MAP[value]
}
const mapStatusIcon = (value: EntityStatusT) => {
  const MAP: Record<EntityStatusT, IconT> = {
    active: CircleCheckIcon,
    archived: ArchiveIcon,
    draft: FileIcon,
  }
  return MAP[value]
}

const mapRangeToStartEnd = (period: PeriodT) => {
  const weekStartsOn = 1

  const MAP: Record<PeriodT, [Date, Date]> = {
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
  return MAP[period]
}

const mapRangeToPrevStartEnd = (period: PeriodT) => {
  const weekStartsOn = 1

  const MAP: Record<PeriodT, [Date, Date]> = {
    today: [startOfYesterday(), endOfYesterday()],
    yesterday: [
      startOfDay(subDays(new Date(), 2)),
      endOfDay(subDays(new Date(), 2)),
    ],
    this_week: [
      startOfWeek(subWeeks(new Date(), 1), { weekStartsOn }),
      endOfWeek(subWeeks(new Date(), 1), { weekStartsOn }),
    ],
    last_week: [
      startOfWeek(subWeeks(new Date(), 2), { weekStartsOn }),
      endOfWeek(subWeeks(new Date(), 2), { weekStartsOn }),
    ],
    this_month: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
    last_month: [
      startOfMonth(subMonths(new Date(), 2)),
      endOfMonth(subMonths(new Date(), 2)),
    ],
  }
  return MAP[period]
}

export {
  mapPayMethodIcon,
  mapRangeIcon,
  mapRangeToPrevStartEnd,
  mapRangeToStartEnd,
  mapStatusIcon,
}
