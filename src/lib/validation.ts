export type ValidationError = {
  field: string
  message: string
}

export function validateContactForm(data: {
  name?: string
  email?: string
  message?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' })
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' })
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' })
  }

  return errors
}

export function validateCheckoutForm(data: {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' })
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' })
  }

  if (!data.phone || data.phone.trim().length < 6) {
    errors.push({ field: 'phone', message: 'Phone number must be at least 6 characters' })
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push({ field: 'address', message: 'Address must be at least 5 characters' })
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.push({ field: 'city', message: 'City is required' })
  }

  if (!data.postalCode || data.postalCode.trim().length < 4) {
    errors.push({ field: 'postalCode', message: 'Postal code must be at least 4 characters' })
  }

  return errors
}
