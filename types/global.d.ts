import en from "../messages/en.json"

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en
  }
}

declare module "@tanstack/react-table" {
  interface FilterFns {
    numberRange: FilterFn<unknown>
    dateRange: FilterFn<unknown>
    multiSelect: FilterFn<unknown>
  }
}
