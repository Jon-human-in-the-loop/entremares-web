import { NextResponse } from 'next/server'
import { validateCheckoutForm } from '@/lib/validation'
import { sendOrderConfirmationEmail } from '@/lib/email'
import fs from 'fs/promises'
import path from 'path'

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `EM-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate shipping form
    const errors = validateCheckoutForm(body.shipping)
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Validate that cart has items
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const orderId = generateOrderId()

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentMethod: body.paymentMethod || 'mbway',
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
      total: body.total,
    }

    let paymentDetails = null

    if (order.paymentMethod === 'mbway') {
      // TODO: Call Ifthenpay/EuPago MB WAY API here
      paymentDetails = {
        method: 'mbway',
        mbwayPhone: order.customer.phone,
      }
    } else if (order.paymentMethod === 'multibanco') {
      // TODO: Call Ifthenpay/EuPago Multibanco API here
      paymentDetails = {
        method: 'multibanco',
        entidade: '11223', // Mock entity
        referencia: Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(?=\d)/g, '$1 '), // Mock ref format 123 456 789
        valor: order.total,
      }
    }

    // Save order to filesystem
    try {
      const ordersDir = path.join(process.cwd(), 'data', 'orders')
      await fs.mkdir(ordersDir, { recursive: true })
      await fs.writeFile(
        path.join(ordersDir, `${orderId}.json`),
        JSON.stringify(order, null, 2)
      )
    } catch (fsError) {
      // Log but don't fail the order—Vercel serverless may not have writable fs
      console.warn('Could not save order to filesystem (expected on serverless):', fsError)
    }

    // Send confirmation emails
    try {
      await sendOrderConfirmationEmail({
        orderId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        items: order.items,
        total: order.total,
        shippingAddress: order.shipping,
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully',
      paymentDetails,
    })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Failed to process order. Please try again.' },
      { status: 500 }
    )
  }
}
