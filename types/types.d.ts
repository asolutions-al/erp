type FormIdT =
  | "product"
  | "invoice"
  | "unit"
  | "user"
  | "customer"
  | "invoiceConfig"
  | "cashRegister"
  | "warehouse"
  | "category"

type RangeT =
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"

type GlobalParamsT = {
  orgId: string
  unitId: string
}

type GrowthT = {
  diff: number
  diffPercent: number
  status: "equal" | "up" | "down"
}

type ResT<T> = {
  success: {
    data: T
  } | null
  error: {
    message: string
  } | null
}
