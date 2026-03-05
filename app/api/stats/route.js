import { getServiceClient } from '../../../lib/supabase/admin'

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { count, error } = await supabase
      .from('capsules')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return Response.json({ capsules: count ?? 0 })
  } catch (_err) {
    return Response.json({ capsules: 0 })
  }
}
