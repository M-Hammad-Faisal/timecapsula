import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createUserClient } from '../../../../lib/supabase/server'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
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

    // Only delete if it belongs to this user and hasn't been delivered
    const { error } = await supabase
      .from('capsules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('delivered', false)

    if (error) throw error
    return Response.json({ success: true })
  } catch (_err) {
    console.error('Delete error:', _err)
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
      .eq('delivered', false) // can't edit delivered capsules
      .select('id')
      .single()

    if (error) throw error
    if (!data)
      return Response.json({ error: 'Capsule not found or already delivered' }, { status: 404 })

    return Response.json({ success: true })
  } catch (_err) {
    console.error('Update error:', _err)
    return Response.json({ error: 'Failed to update capsule' }, { status: 500 })
  }
}

// ── GET /api/capsules/[id] — public preview ───────────────────────
export async function GET(_request, { params }) {
  try {
    const { id } = await params
    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('capsules')
      .select('id, to_name, from_name, subject, deliver_at, delivered, share_enabled, created_at')
      .eq('id', id)
      .eq('share_enabled', true)
      .single()

    if (error || !data) return Response.json({ error: 'Capsule not found' }, { status: 404 })

    // Never expose message content in public preview
    return Response.json({ capsule: data })
  } catch (_err) {
    console.error('Preview error:', _err)
    return Response.json({ error: 'Failed to fetch capsule' }, { status: 500 })
  }
}
