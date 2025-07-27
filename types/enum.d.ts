import {
  entityStatus,
  invitationStatus,
  payMethod,
  role,
} from "@/orm/app/schema"

type EntityStatusT = (typeof entityStatus.enumValues)[number]
type PayMethodT = (typeof payMethod.enumValues)[number]
type InvitationStatusT = (typeof invitationStatus.enumValues)[number]
type OrgMemberRoleT = (typeof role.enumValues)[number]
