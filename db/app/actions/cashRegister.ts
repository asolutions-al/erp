"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { cashRegister, invoiceConfig } from "@/orm/app/schema"
import { CashRegisterFormSchemaT } from "@/providers"
import { eq } from "drizzle-orm"

type FormSchemaT = CashRegisterFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return // user not found
  await db.insert(cashRegister).values({
    ...values,
    unitId,
    orgId,
    balance: values.openingBalance,
    isOpen: true, // all new cash registers are open by default
    openedAt: new Date().toISOString(),
    openedBy: user.id,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.update(cashRegister).set(values).where(eq(cashRegister.id, id))
}

const close = async (id: string) => {
  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return // user not found

  await db.transaction(async (tx) => {
    await tx
      .update(cashRegister)
      .set({
        isOpen: false,
        closedAt: new Date().toISOString(),
        closedBy: user.id,
        closingBalanace: cashRegister.balance,
        status: "archived",
      })
      .where(eq(cashRegister.id, id))

    await tx
      .update(invoiceConfig)
      .set({
        cashRegisterId: null,
      })
      .where(eq(invoiceConfig.cashRegisterId, id))
  })
}

export {
  close as closeCashRegister,
  create as createCashRegister,
  update as updateCashRegister,
}
