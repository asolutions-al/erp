import {
  entityStatus,
  invitationStatus,
  payMethod,
  productUnit,
  role,
} from "@/orm/app/schema"

type EntityStatusT = (typeof entityStatus.enumValues)[number]
type ProductUnitT = (typeof productUnit.enumValues)[number]
type PayMethodT = (typeof payMethod.enumValues)[number]
type InvitationStatusT = (typeof invitationStatus.enumValues)[number]
type OrgMemberRoleT = (typeof role.enumValues)[number]
