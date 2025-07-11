import { PlanSchemaT } from "@/db/auth/schema"

export const generatePlanFeatures = (planData: PlanSchemaT) => {
  const features = []

  if (planData.maxInvoices === -1) {
    features.push("Unlimited invoices")
  } else {
    features.push(
      `Up to ${planData.maxInvoices.toLocaleString()} invoices per month`
    )
  }

  if (planData.maxUnits === -1) {
    features.push("Unlimited units")
  } else {
    features.push(`Up to ${planData.maxUnits} units`)
  }

  if (planData.maxMembers === -1) {
    features.push("Unlimited team members")
  } else {
    features.push(`Up to ${planData.maxMembers} team members`)
  }

  if (planData.maxCustomers === -1) {
    features.push("Unlimited customers")
  } else {
    features.push(`Up to ${planData.maxCustomers.toLocaleString()} customers`)
  }

  if (planData.maxProducts === -1) {
    features.push("Unlimited products")
  } else {
    features.push(`Up to ${planData.maxProducts.toLocaleString()} products`)
  }

  return features
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800"
    case "CANCELED":
      return "bg-red-100 text-red-800"
    case "SUSPENDED":
      return "bg-yellow-100 text-yellow-800"
    case "EXPIRED":
      return "bg-orange-100 text-orange-800"
    case "CREATED":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
