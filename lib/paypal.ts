const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"

const getAccessToken = async () => {
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
  const data = await res.json()
  return data.access_token
}

export async function createPayPalSubscription(
  planId: string,
  returnUrl: string,
  cancelUrl: string
) {
  const accessToken = await getAccessToken()
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: "Invoice App",
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "SUBSCRIBE_NOW",
      },
    }),
  })
  const data = await res.json()
  return data
}

export async function getPayPalSubscription(subscriptionId: string) {
  const accessToken = await getAccessToken()
  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return await res.json()
}

export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason: string = "User requested cancellation"
) {
  const accessToken = await getAccessToken()
  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason,
      }),
    }
  )

  if (res.status === 204) {
    return { success: true }
  }

  const data = await res.json()
  return data
}
