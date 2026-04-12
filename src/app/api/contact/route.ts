import { NextResponse } from 'next/server'
import { validateContactForm } from '@/lib/validation'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate
    const errors = validateContactForm(body)
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Send email
    await sendContactEmail({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
