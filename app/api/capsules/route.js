import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role — never expose this client-side
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { to, toEmail, from, subject, message, when, customDate } = body

    // --- Validation ---
    if (!to || !toEmail || !message || !when) {
      return Response.json(
        { error: 'Missing required fields: to, toEmail, message, when' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(toEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (message.length > 5000) {
      return Response.json({ error: 'Message too long (max 5000 chars)' }, { status: 400 })
    }

    // --- Compute delivery date ---
    const deliverAt = computeDeliveryDate(when, customDate)
    if (!deliverAt) {
      return Response.json({ error: 'Invalid delivery time' }, { status: 400 })
    }

    if (deliverAt <= new Date()) {
      return Response.json({ error: 'Delivery date must be in the future' }, { status: 400 })
    }

    // --- Save to Supabase ---
    const { data, error } = await supabase
      .from('capsules')
      .insert({
        to_name: to.trim(),
        to_email: toEmail.trim().toLowerCase(),
        from_name: from?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        deliver_at: deliverAt.toISOString(),
      })
      .select('id, deliver_at')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return Response.json({ error: 'Failed to save capsule' }, { status: 500 })
    }

    return Response.json({
      success: true,
      id: data.id,
      deliverAt: data.deliver_at,
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// --- Helpers ---
function computeDeliveryDate(when, customDate) {
  const now = new Date()

  if (when === 'custom') {
    if (!customDate) return null
    const d = new Date(customDate)
    return isNaN(d.getTime()) ? null : d
  }

  const yearsMap = { '1y': 1, '5y': 5, '10y': 10, '25y': 25 }
  const years = yearsMap[when]
  if (!years) return null

  const target = new Date(now)
  target.setFullYear(now.getFullYear() + years)
  return target
}
