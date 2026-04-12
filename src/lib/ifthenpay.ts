/**
 * Ifthenpay Payment Gateway Client
 * Docs: https://ifthenpay.com/docs/en/
 *
 * Required env vars:
 *   IFTHENPAY_MBWAY_KEY  — e.g. "ZZZ-000000"  (assigned by Ifthenpay)
 *   IFTHENPAY_MB_KEY     — e.g. "ZZZ-000000"  (assigned by Ifthenpay)
 *   IFTHENPAY_ANTI_PHISHING_KEY — secret to validate webhook callbacks
 *   NEXT_PUBLIC_BASE_URL — your deployed domain, e.g. https://entremares.pt
 */

const MBWAY_API = 'https://api.ifthenpay.com/spg/payment/mbway'
const MULTIBANCO_API = 'https://api.ifthenpay.com/multibanco/reference/init'
const MULTIBANCO_SANDBOX_API = 'https://api.ifthenpay.com/multibanco/reference/sandbox'

const isSandbox = process.env.NODE_ENV !== 'production'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MBWayPaymentRequest {
  orderId: string
  /** Amount in CENTS (we convert to euros internally) */
  amountCents: number
  mobileNumber: string // e.g. "912345678" – we prepend "351#"
  email?: string
  description?: string
}

export interface MBWayPaymentResult {
  success: boolean
  requestId?: string
  error?: string
}

export interface MultibancoPaymentRequest {
  orderId: string
  /** Amount in CENTS */
  amountCents: number
  clientEmail?: string
  clientName?: string
  /** Expiry in days (default 3) */
  expiryDays?: number
}

export interface MultibancoPaymentResult {
  success: boolean
  entidade?: string
  referencia?: string
  valor?: string
  error?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert cents to "10.99" string expected by Ifthenpay */
function centsToEuroString(cents: number): string {
  return (cents / 100).toFixed(2)
}

/** Format portuguese phone: "912345678" → "351#912345678" */
function formatPortuguesePhone(phone: string): string {
  // Strip spaces, dashes, leading +351 or 00351
  const clean = phone.replace(/[\s\-]/g, '').replace(/^(\+351|00351)/, '')
  return `351#${clean}`
}

// ─── MB WAY ───────────────────────────────────────────────────────────────────

export async function createMBWayPayment(
  req: MBWayPaymentRequest
): Promise<MBWayPaymentResult> {
  const mbWayKey = process.env.IFTHENPAY_MBWAY_KEY

  if (!mbWayKey) {
    console.error('[Ifthenpay] IFTHENPAY_MBWAY_KEY is not set')
    return { success: false, error: 'Payment service not configured' }
  }

  const payload = {
    mbWayKey,
    orderId: req.orderId.slice(0, 15), // max 15 chars
    amount: centsToEuroString(req.amountCents),
    mobileNumber: formatPortuguesePhone(req.mobileNumber),
    email: req.email ?? '',
    description: req.description ?? `Entremares order ${req.orderId}`,
  }

  try {
    const res = await fetch(MBWAY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    // Ifthenpay returns RequestId on success and Status "000"
    if (data.Status === '000' || data.RequestId) {
      return { success: true, requestId: data.RequestId }
    }

    console.error('[Ifthenpay] MB WAY error response:', data)
    return {
      success: false,
      error: data.Message || data.Status || 'MB WAY payment failed',
    }
  } catch (err) {
    console.error('[Ifthenpay] MB WAY fetch error:', err)
    return { success: false, error: 'Network error contacting payment gateway' }
  }
}

// ─── Multibanco ───────────────────────────────────────────────────────────────

export async function createMultibancoReference(
  req: MultibancoPaymentRequest
): Promise<MultibancoPaymentResult> {
  const mbKey = process.env.IFTHENPAY_MB_KEY

  if (!mbKey) {
    console.error('[Ifthenpay] IFTHENPAY_MB_KEY is not set')
    return { success: false, error: 'Payment service not configured' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://entremares.pt'
  const callbackUrl = `${baseUrl}/api/ifthenpay/callback`

  const payload: Record<string, string> = {
    mbKey,
    orderId: req.orderId.slice(0, 25), // max 25 chars
    amount: centsToEuroString(req.amountCents),
    clientEmail: req.clientEmail ?? '',
    clientName: req.clientName ?? '',
    expiryDays: String(req.expiryDays ?? 3),
    callbackUrl,
  }

  const endpoint = isSandbox ? MULTIBANCO_SANDBOX_API : MULTIBANCO_API

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    // Success: Ifthenpay returns Entidade and Referencia
    if (data.Entidade && data.Referencia) {
      return {
        success: true,
        entidade: data.Entidade,
        referencia: data.Referencia,
        valor: centsToEuroString(req.amountCents),
      }
    }

    console.error('[Ifthenpay] Multibanco error response:', data)
    return {
      success: false,
      error: data.Message || 'Failed to generate Multibanco reference',
    }
  } catch (err) {
    console.error('[Ifthenpay] Multibanco fetch error:', err)
    return { success: false, error: 'Network error contacting payment gateway' }
  }
}

// ─── Webhook validation ───────────────────────────────────────────────────────

/**
 * Validate that a webhook callback comes from Ifthenpay.
 * Ifthenpay sends an anti-phishing key as a query param: ?chave=YOUR_KEY
 */
export function validateIfthenpayCallback(chave: string | null): boolean {
  const expected = process.env.IFTHENPAY_ANTI_PHISHING_KEY
  if (!expected) {
    console.warn('[Ifthenpay] IFTHENPAY_ANTI_PHISHING_KEY not set — skipping validation')
    return true // lenient in dev
  }
  return chave === expected
}
