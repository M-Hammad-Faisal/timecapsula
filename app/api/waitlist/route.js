import { getServiceClient } from '../../../lib/supabase/admin'
import { validateEmail } from '../../../lib/validation'

export async function POST(request) {
  try {
    const { email, template } = await request.json()
    if (!validateEmail(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('waitlist')
      .upsert(
        { email: email.trim().toLowerCase(), template: template || null },
        { onConflict: 'email' }
      )

    // If the table doesn't exist yet, still return success gracefully
    if (error && error.code !== '42P01') {
      console.error('Waitlist insert error:', error)
      // Still return success to user — we don't want to surface DB errors
    }

    return Response.json({ success: true })
  } catch (_err) {
    return Response.json({ success: true }) // Graceful degradation
  }
}
