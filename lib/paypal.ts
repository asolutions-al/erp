import { APP_URL } from "@/constants/env"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE!

const brand_name = "Invoice Asolutions" // This can be customized as needed

type AccessTokenRes = {
  access_token: string
  token_type: "Bearer"
  app_id: string
  expires_in: number
  nonce: string
}

type CancelSubReqBody = {
  reason: string
}

type Link = {
  href: string
  rel:
    | "approve"
    | "edit"
    | "self"
    | "cancel"
    | "suspend"
    | "reactivate"
    | "capture"
  method: "GET" | "POST" | "PATCH" | "DELETE"
}

type SubStatus =
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED"

type BillingInfo = {
  outstanding_balance: {
    currency_code: string
    value: string
  }
  cycle_executions: Array<{
    tenure_type: "TRIAL" | "REGULAR"
    sequence: number
    cycles_completed: number
    cycles_remaining?: number
    current_pricing_scheme_version?: number
    total_cycles?: number
  }>
  last_payment?: {
    amount: {
      currency_code: string
      value: string
    }
    time: string
  }
  next_billing_time?: string
  failed_payments_count: number
}

type SubRes = {
  status: SubStatus
  id: string
  plan_id: string
  start_time?: string
  create_time: string
  update_time?: string
  billing_info?: BillingInfo
  subscriber?: {
    name?: {
      given_name?: string
      surname?: string
    }
    email_address?: string
    payer_id?: string
  }
  links: Link[]
  custom_id?: string // This is the orgId we set during subscription creation
}

type ErrorRes = {
  name: string
  message: string
  debug_id: string
  details?: Array<{
    issue: string
    description: string
    location?: string
  }>
  links?: Link[]
}

const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64")
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data: AccessTokenRes = await res.json()

  return data.access_token || ""
}

const getPayPalSub = async (subscriptionId: string): Promise<ResT<SubRes>> => {
  const accessToken = await getAccessToken()
  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!res.ok) {
    const errorData: ErrorRes = await res.json()
    return {
      success: null,
      error: {
        message: errorData.message || "Failed to retrieve subscription",
      },
    }
  }
  const data: SubRes = await res.json()
  return {
    success: { data },
    error: null,
  }
}

type CreateSubReqBody = {
  plan_id: string
  custom_id: string
  application_context: {
    brand_name: string
    return_url: string
    cancel_url: string
    user_action: "SUBSCRIBE_NOW" | "CONTINUE"
    shipping_preference:
      | "NO_SHIPPING"
      | "SET_PROVIDED_ADDRESS"
      | "GET_FROM_FILE"
  }
}

const createPayPalSubs = async (
  planId: string,
  orgId: string
): Promise<ResT<SubRes>> => {
  const accessToken = await getAccessToken()
  const returnUrl = `${APP_URL}/o/${orgId}/billing/subscription/payment/success`
  const cancelUrl = `${APP_URL}/o/${orgId}/billing/subscription/payment/cancel`

  const requestBody: CreateSubReqBody = {
    plan_id: planId,
    custom_id: orgId, // Critical: This links the PayPal subscription to your org
    application_context: {
      brand_name,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      user_action: "SUBSCRIBE_NOW",
      shipping_preference: "NO_SHIPPING",
    },
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  if (!res.ok) {
    const errorData: ErrorRes = await res.json()
    return {
      success: null,
      error: {
        message: errorData.message || "Failed to create subscription",
      },
    }
  }
  const data: SubRes = await res.json()
  return {
    success: { data },
    error: null,
  }
}

const cancelPayPalSub = async (subscriptionId: string): Promise<ResT<true>> => {
  const accessToken = await getAccessToken()

  const requestBody: CancelSubReqBody = {
    reason: "User requested cancellation",
  }

  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (res.status === 204) {
    return {
      success: { data: true },
      error: null,
    }
  }

  const errorData: ErrorRes = await res.json()

  return {
    success: null,
    error: {
      message: errorData.message || "Failed to cancel subscription",
    },
  }
}

type ReviseSubReqBody = {
  plan_id: string
  application_context: {
    brand_name: string
    user_action: "CONTINUE" | "SUBSCRIBE_NOW"
  }
  plan: {
    id: string
  }
}

type RevisionRes = {
  plan_id: string
  plan_overridden: boolean
  links: Link[]
}

const revisePayPalSub = async (
  subscriptionId: string,
  newPlanId: string
): Promise<ResT<RevisionRes>> => {
  const accessToken = await getAccessToken()

  const requestBody: ReviseSubReqBody = {
    plan_id: newPlanId,
    application_context: {
      brand_name,
      user_action: "CONTINUE",
    },
    plan: {
      id: newPlanId,
    },
  }

  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/revise`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (!res.ok) {
    const errorData: ErrorRes = await res.json()
    console.error("PayPal revision error:", errorData)
    return {
      success: null,
      error: {
        message: errorData.message || "Failed to revise subscription",
      },
    }
  }
  const data: RevisionRes = await res.json()

  return {
    success: { data },
    error: null,
  }
}

export { cancelPayPalSub, createPayPalSubs, getPayPalSub, revisePayPalSub }
