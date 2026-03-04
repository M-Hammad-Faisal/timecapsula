import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createUserClient } from '../../../../lib/supabase/server'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// ── GET /api/capsules/[id] ─────────────────────────────────────────
// - Auth'd owner: returns full capsule including message
// - Public: returns preview (no message) if share_enabled
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = getServiceClient()

    // Check if authenticated user is the owner → return full content
    const userClient = await createUserClient()
    const {
      data: { user },
    } = await userClient.auth.getUser()

    if (user) {
      const { data: owned } = await supabase
        .from('capsules')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (owned) return Response.json({ capsule: owned })
    }

    // Public preview — no message content
    const { data, error } = await supabase
      .from('capsules')
      .select('id, to_name, from_name, subject, deliver_at, delivered, share_enabled, created_at')
      .eq('id', id)
      .eq('share_enabled', true)
      .single()

    if (error || !data) return Response.json({ error: 'Capsule not found' }, { status: 404 })
    return Response.json({ capsule: data })
  } catch (_err) {
    return Response.json({ error: 'Failed to fetch capsule' }, { status: 500 })
  }
}

// ── DELETE /api/capsules/[id] ─────────────────────────────────────
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params
    const userClient = await createUserClient()
    const {
      data: { user },
    } = await userClient.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('capsules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('delivered', false)

    if (error) throw error
    return Response.json({ success: true })
  } catch (_err) {
    return Response.json({ error: 'Failed to delete capsule' }, { status: 500 })
  }
}

// ── PATCH /api/capsules/[id] ──────────────────────────────────────
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const userClient = await createUserClient()
    const {
      data: { user },
    } = await userClient.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { subject, message, shareEnabled } = body

    const updates = {}
    if (subject !== undefined) updates.subject = subject?.trim() || null
    if (message !== undefined) {
      if (message.length > 5000)
        return Response.json({ error: 'Message too long' }, { status: 400 })
      updates.message = message.trim()
    }
    if (shareEnabled !== undefined) updates.share_enabled = shareEnabled

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('capsules')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('delivered', false)
      .select('id')
      .single()

    if (error) throw error
    if (!data)
      return Response.json({ error: 'Capsule not found or already delivered' }, { status: 404 })
    return Response.json({ success: true })
  } catch (_err) {
    return Response.json({ error: 'Failed to update capsule' }, { status: 500 })
  }
}
