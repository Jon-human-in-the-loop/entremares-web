import { NextResponse } from 'next/server'
import { validateCheckoutForm } from '@/lib/validation'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { createMBWayPayment, createMultibancoReference } from '@/lib/ifthenpay'
import fs from 'fs/promises'
import path from 'path'

import Stripe from 'stripe'

// Initialize Stripe with the secret key (must be set in .env)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any }) 
  : null

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `EM-${timestamp}-${random}`
}

async function saveOrder(orderId: string, order: object) {
  try {
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    await fs.mkdir(ordersDir, { recursive: true })
    await fs.writeFile(
      path.join(ordersDir, `${orderId}.json`),
      JSON.stringify(order, null, 2)
    )
  } catch {
    // Vercel serverless doesn't have a writable FS
    console.warn('[Checkout] Could not save order to filesystem')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'

    // Validate shipping form
    const errors = validateCheckoutForm(body.shipping)
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const orderId = generateOrderId()
    const paymentMethod: 'mbway' | 'multibanco' | 'stripe' = body.paymentMethod || 'mbway'

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending_payment',
      paymentMethod,
      customer: {
        name: body.shipping.name.trim(),
        email: body.shipping.email.trim(),
        phone: body.shipping.phone.trim(),
      },
      shipping: {
        address: body.shipping.address.trim(),
        city: body.shipping.city.trim(),
        postalCode: body.shipping.postalCode.trim(),
      },
      items: body.items.map((item: any) => ({
        packId: item.pack.id,
        name: item.pack.name,
        price: item.pack.price,
        quantity: item.quantity,
      })),
      total: body.total, // in cents
    }

    // ── Call real Ifthenpay payment API ──────────────────────────────────────

    let paymentDetails: Record<string, any> | null = null

    if (paymentMethod === 'mbway') {
      const result = await createMBWayPayment({
        orderId,
        amountCents: order.total,
        mobileNumber: order.customer.phone,
        email: order.customer.email,
        description: `Entremares ${orderId}`,
      })

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'MB WAY payment initiation failed' },
          { status: 502 }
        )
      }

      paymentDetails = {
        method: 'mbway',
        mbwayPhone: order.customer.phone,
        requestId: result.requestId,
      }
    } else if (paymentMethod === 'multibanco') {
      const result = await createMultibancoReference({
        orderId,
        amountCents: order.total,
        clientEmail: order.customer.email,
        clientName: order.customer.name,
        expiryDays: 3,
      })

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Multibanco reference generation failed' },
          { status: 502 }
        )
      }

      paymentDetails = {
        method: 'multibanco',
        entidade: result.entidade,
        referencia: result.referencia,
        valor: result.valor,
      }
    } else if (paymentMethod === 'stripe') {
      if (!stripe) {
        return NextResponse.json(
          { error: 'Stripe is not configured on this server.' },
          { status: 500 }
        )
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: order.customer.email,
        line_items: order.items.map((item: any) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price, // in cents
          },
          quantity: item.quantity,
        })),
        success_url: `${protocol}://${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${protocol}://${host}/checkout?canceled=true`,
        metadata: {
          orderId: orderId
        }
      })

      paymentDetails = {
        method: 'stripe',
        sessionId: session.id,
      }
      
      // Save order early for Stripe since they will be redirected
      await saveOrder(orderId, { ...order, paymentDetails, status: 'pending_stripe_checkout' })
      
      return NextResponse.json({
        success: true,
        orderId,
        paymentDetails,
        stripeUrl: session.url
      })
    }

    // ── Persist order ────────────────────────────────────────────────────────
    await saveOrder(orderId, { ...order, paymentDetails })

    // ── Send confirmation email ──────────────────────────────────────────────
    try {
      await sendOrderConfirmationEmail({
        orderId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        items: order.items,
        total: order.total,
        shippingAddress: order.shipping,
      })
    } catch (emailErr) {
      console.error('[Checkout] Failed to send confirmation email:', emailErr)
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
      paymentDetails,
    })
  } catch (error) {
    console.error('[Checkout] API error:', error)
    return NextResponse.json(
      { error: 'Failed to process order. Please try again.' },
      { status: 500 }
    )
  }
}
