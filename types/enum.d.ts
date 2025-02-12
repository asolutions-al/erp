import { entityStatus, payMethod } from "@/orm/app/schema"

type EntityStatusT = (typeof entityStatus.enumValues)[number]
type PayMethodT = (typeof payMethod.enumValues)[number]
