import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createUserClient } from '../../../lib/supabase/server'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { to, toEmail, from, subject, message, when, customDate } = body

    if (!to || !toEmail || !message || !when) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(toEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (message.length > 5000) {
      return Response.json({ error: 'Message too long (max 5000 chars)' }, { status: 400 })
    }

    const deliverAt = computeDeliveryDate(when, customDate)
    if (!deliverAt) return Response.json({ error: 'Invalid delivery time' }, { status: 400 })
    if (deliverAt <= new Date())
      return Response.json({ error: 'Delivery date must be in the future' }, { status: 400 })

    const userClient = await createUserClient()
    const {
      data: { user },
    } = await userClient.auth.getUser()

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('capsules')
      .insert({
        to_name: to.trim(),
        to_email: toEmail.trim().toLowerCase(),
        from_name: from?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        deliver_at: deliverAt.toISOString(),
        user_id: user?.id || null,
      })
      .select('id, deliver_at')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return Response.json({ error: 'Failed to save capsule' }, { status: 500 })
    }

    return Response.json({ success: true, id: data.id, deliverAt: data.deliver_at })
  } catch (_err) {
    console.error('Unexpected error:', _err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const userClient = await createUserClient()
    const {
      data: { user },
    } = await userClient.auth.getUser()

    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('capsules')
      .select('id, to_name, to_email, subject, deliver_at, delivered, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json({ capsules: data })
  } catch (_err) {
    console.error('Error fetching capsules:', _err)
    return Response.json({ error: 'Failed to fetch capsules' }, { status: 500 })
  }
}

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
