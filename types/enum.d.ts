import { currency, status } from "@/orm/app/schema"

type CurrencyT = (typeof currency.enumValues)[number]
type StatusT = (typeof status.enumValues)[number]
