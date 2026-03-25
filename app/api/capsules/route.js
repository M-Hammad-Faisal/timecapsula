import { createClient as createUserClient } from '../../../lib/supabase/server'
import { getServiceClient } from '../../../lib/supabase/admin'
import { computeDeliveryDate } from '../../../lib/delivery'
import { validateEmail } from '../../../lib/validation'
import { GUEST_LIMIT, FREE_USER_LIMIT, MAX_MESSAGE_LENGTH } from '../../../lib/constants'

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { to, toEmail, from, subject, message, when, customDate, template } = body

    if (!to || !toEmail || !message || !when) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!validateEmail(toEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` },
        { status: 400 }
      )
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

    if (!user) {
      // ── Guest rate limit ───────────────────────────────────────
      const ip = getIP(request)
      const { count } = await supabase
        .from('capsules')
        .select('id', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .is('user_id', null)

      if (count >= GUEST_LIMIT) {
        return Response.json(
          {
            error: `Guests can send up to ${GUEST_LIMIT} capsules. Sign in for up to ${FREE_USER_LIMIT}.`,
            limitReached: true,
          },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
    } else {
      // ── Free user limit ────────────────────────────────────────
      const { count } = await supabase
        .from('capsules')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (count >= FREE_USER_LIMIT) {
        return Response.json(
          {
            error: `Free plan allows up to ${FREE_USER_LIMIT} capsules.`,
            limitReached: true,
          },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
    }

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
        ip_address: user ? null : getIP(request),
        template: template || 'cosmic',
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
      .select(
        'id, to_name, to_email, subject, deliver_at, delivered, created_at, share_enabled, template'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ capsules: data })
  } catch (_err) {
    return Response.json({ error: 'Failed to fetch capsules' }, { status: 500 })
  }
}
