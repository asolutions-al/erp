import { entityStatus, invitationStatus, payMethod } from "@/orm/app/schema"

type EntityStatusT = (typeof entityStatus.enumValues)[number]
type PayMethodT = (typeof payMethod.enumValues)[number]
type InvitationStatusT = (typeof invitationStatus.enumValues)[number]
