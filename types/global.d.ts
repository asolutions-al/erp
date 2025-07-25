import en from "../messages/en.json"

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en
  }
}

declare module "@tanstack/react-table" {
  interface FilterFns {
    numberRangeFilter: FilterFn<unknown>
    dateRangeFilter: FilterFn<unknown>
    multiSelectFilter: FilterFn<unknown>
  }
}
