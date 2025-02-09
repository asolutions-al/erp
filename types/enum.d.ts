import { payMethod, status } from "@/orm/app/schema"

type StatusT = (typeof status.enumValues)[number]
type PayMethodT = (typeof payMethod.enumValues)[number]
