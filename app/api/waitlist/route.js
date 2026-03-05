import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function POST(request) {
  try {
    const { email, template } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
