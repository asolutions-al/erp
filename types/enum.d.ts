import { currency } from "@/orm/app/schema"

type CurrencyT = (typeof currency.enumValues)[number]
