import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

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
