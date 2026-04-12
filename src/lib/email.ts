import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const TO_EMAIL = process.env.TO_EMAIL || 'info@entremares.pt'

export async function sendContactEmail(data: {
  name: string
  email: string
  message: string
}) {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    replyTo: data.email,
    subject: `[Entremares] New contact from ${data.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #3D2B1F; font-size: 28px; margin-bottom: 8px;">New Contact Message</h1>
        <hr style="border: 1px solid #D4A574; margin: 20px 0;" />
        <p><strong>From:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="white-space: pre-wrap; color: #333;">${data.message}</p>
        <hr style="border: 1px solid #D4A574; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px;">Sent via entremares.pt contact form</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send contact email:', error)
    throw new Error('Failed to send email')
  }

  return { success: true }
}

export async function sendOrderConfirmationEmail(data: {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  shippingAddress: {
    address: string
    city: string
    postalCode: string
  }
}) {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('')

  // Email to customer
  const { error: customerError } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [data.customerEmail],
    subject: `[Entremares] Order Confirmation #${data.orderId}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #4A3C31; margin-bottom: 5px; font-size: 24px;">ENTREMARES</h1>
        <p style="color: #8B6914; font-size: 14px; margin-bottom: 30px;">Premium Handcrafted Alfajores</p>
        <h2 style="color: #4A3C31; font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
        <p>Thank you, <strong>${data.customerName}</strong>! Your order has been received.</p>
        <p style="color: #666;">Order ID: <strong>#${data.orderId}</strong></p>
        
        <hr style="border: 1px solid #D4A574; margin: 20px 0;" />
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #FFF8F0;">
              <th style="padding: 10px; text-align: left; color: #3D2B1F;">Product</th>
              <th style="padding: 10px; text-align: center; color: #3D2B1F;">Qty</th>
              <th style="padding: 10px; text-align: right; color: #3D2B1F;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 15px 10px; font-weight: bold; color: #3D2B1F;">Total</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; color: #8B6914; font-size: 18px;">${formatPrice(data.total)}</td>
            </tr>
          </tfoot>
        </table>
        
        <hr style="border: 1px solid #D4A574; margin: 20px 0;" />
        
        <h3 style="color: #3D2B1F;">Shipping Address</h3>
        <p style="color: #666;">
          ${data.shippingAddress.address}<br />
          ${data.shippingAddress.city}, ${data.shippingAddress.postalCode}
        </p>
        
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Entremares - Premium Handcrafted Alfajores | info@entremares.pt</p>
      </div>
    `,
  })

  if (customerError) {
    console.error('Failed to send customer email:', customerError)
  }

  // Email to store owner
  const { error: ownerError } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    subject: `[Entremares] New Order #${data.orderId} from ${data.customerName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #3D2B1F;">🛒 New Order Received!</h1>
        <p><strong>Order ID:</strong> #${data.orderId}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Total:</strong> ${formatPrice(data.total)}</p>
        
        <hr style="border: 1px solid #D4A574; margin: 20px 0;" />
        
        <h3>Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>${itemsHtml}</tbody>
        </table>
        
        <h3>Shipping To:</h3>
        <p>${data.shippingAddress.address}<br/>${data.shippingAddress.city}, ${data.shippingAddress.postalCode}</p>
      </div>
    `,
  })

  if (ownerError) {
    console.error('Failed to send owner notification:', ownerError)
  }

  return { success: true }
}
