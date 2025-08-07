"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { getUserId } from "@/db/auth/loaders"
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
  const userId = await getUserId()

  await db.insert(cashRegister).values({
    ...values,
    unitId,
    orgId,
    balance: values.openingBalance,
    isOpen: true, // all new cash registers are open by default
    openedAt: new Date().toISOString(),
    openedBy: userId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.transaction(async (tx) => {
    await tx.update(cashRegister).set(values).where(eq(cashRegister.id, id))

    if (values.status !== "active")
      await tx
        .update(invoiceConfig)
        .set({
          cashRegisterId: null,
        })
        .where(eq(invoiceConfig.cashRegisterId, id))
  })
}

const close = async (id: string) => {
  const userId = await getUserId()

  await db.transaction(async (tx) => {
    await tx
      .update(cashRegister)
      .set({
        isOpen: false,
        closedAt: new Date().toISOString(),
        closedBy: userId,
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

const markAsFavorite = async ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => {
  await db
    .update(cashRegister)
    .set({ isFavorite })
    .where(eq(cashRegister.id, id))
}

export {
  close as closeCashRegister,
  create as createCashRegister,
  markAsFavorite as markCashRegisterAsFavorite,
  update as updateCashRegister,
}
