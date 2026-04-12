/**
 * Ifthenpay Payment Callback Webhook
 *
 * Ifthenpay will POST to: /api/ifthenpay/callback?chave=YOUR_ANTI_PHISHING_KEY
 *
 * For Multibanco, the body contains: { orderId, referencia, entidade, valor }
 * For MB WAY, Ifthenpay sends status updates with requestId and status codes.
 *
 * Configure this URL in your Ifthenpay backoffice under each payment method.
 */

import { NextResponse } from 'next/server'
import { validateIfthenpayCallback } from '@/lib/ifthenpay'
import fs from 'fs/promises'
import path from 'path'

async function updateOrderStatus(orderId: string, status: string, extra?: object) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'orders', `${orderId}.json`)
    const raw = await fs.readFile(filePath, 'utf-8')
    const order = JSON.parse(raw)
    const updated = { ...order, status, paymentConfirmedAt: new Date().toISOString(), ...extra }
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2))
    console.log(`[Ifthenpay Callback] Order ${orderId} updated to status: ${status}`)
  } catch (err) {
    // On serverless (Vercel), filesystem writes don't persist — log only
    // In production you should update a database (Supabase) instead
    console.warn(`[Ifthenpay Callback] Could not persist order update for ${orderId}:`, err)
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const chave = searchParams.get('chave')

  // Validate anti-phishing key
  if (!validateIfthenpayCallback(chave)) {
    console.warn('[Ifthenpay Callback] Invalid anti-phishing key:', chave)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  console.log('[Ifthenpay Callback] Received:', body)

  const { orderId, requestId, estado } = body

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }

  // Ifthenpay payment states:
  // MB WAY:     "000" = success, "020" = rejected, "101" = timeout
  // Multibanco: payment received callback means it's paid
  if (estado === '000' || !estado) {
    // Payment confirmed (Multibanco callbacks don't include estado)
    await updateOrderStatus(orderId, 'paid', { requestId })
  } else if (estado === '020') {
    await updateOrderStatus(orderId, 'rejected', { requestId })
  } else if (estado === '101') {
    await updateOrderStatus(orderId, 'expired', { requestId })
  } else {
    await updateOrderStatus(orderId, `unknown_${estado}`, { requestId })
  }

  // Always return 200 to Ifthenpay
  return NextResponse.json({ success: true })
}

// Also handle GET (some payment gateways send GET pings)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chave = searchParams.get('chave')

  if (!validateIfthenpayCallback(chave)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ status: 'ok', service: 'Entremares Ifthenpay Callback' })
}
