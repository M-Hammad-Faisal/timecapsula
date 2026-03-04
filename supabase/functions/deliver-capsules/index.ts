// @ts-nocheck -- Deno runtime, not Node.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL = 'TimeCapsula <capsule@timecapsula.website>'

// ─── Main Handler ────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Security: only allow calls from Supabase cron or your server
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // 1. Find all capsules due for delivery (deliver_at <= now, not yet delivered)
    const { data: capsules, error } = await supabase
      .from('capsules')
      .select('*')
      .lte('deliver_at', new Date().toISOString())
      .eq('delivered', false)
      .limit(50) // process max 50 at a time to stay within limits

    if (error) throw error
    if (!capsules || capsules.length === 0) {
      return Response.json({ delivered: 0, message: 'No capsules due today' })
    }

    console.log(`Found ${capsules.length} capsule(s) to deliver`)

    // 2. Send each capsule
    const results = await Promise.allSettled(
      capsules.map(capsule => deliverCapsule(capsule))
    )

    // 3. Count successes and failures
    const delivered = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    console.log(`Delivered: ${delivered}, Failed: ${failed}`)

    return Response.json({ delivered, failed, total: capsules.length })

  } catch (err) {
    console.error('Edge function error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
})

// ─── Deliver one capsule ──────────────────────────────────────────────────────
async function deliverCapsule(capsule: any) {
  // Send email via Resend
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: capsule.to_email,
      subject: capsule.subject
        ? `✦ ${capsule.subject} — A message from your past`
        : `✦ A message from your past has arrived`,
      html: buildEmailHTML(capsule),
    }),
  })

  if (!emailRes.ok) {
    const err = await emailRes.text()
    throw new Error(`Resend error for capsule ${capsule.id}: ${err}`)
  }

  // Mark as delivered in Supabase
  const { error } = await supabase
    .from('capsules')
    .update({ delivered: true, delivered_at: new Date().toISOString() })
    .eq('id', capsule.id)

  if (error) throw error

  console.log(`✅ Delivered capsule ${capsule.id} to ${capsule.to_email}`)
}

// ─── Beautiful HTML Email Template ───────────────────────────────────────────
function buildEmailHTML(capsule: any): string {
  const sentDate = new Date(capsule.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const fromLine = capsule.from_name ? `from ${capsule.from_name}` : 'from someone who cares'

  // Convert newlines to <br> for HTML
  const messageHTML = capsule.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>A message from your past</title>
</head>
<body style="margin:0;padding:0;background:#080c14;font-family:Georgia,serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080c14;padding:40px 20px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d1525;border:1px solid rgba(232,168,76,0.2);border-radius:4px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d1525,#111d35);padding:48px 40px 32px;text-align:center;border-bottom:1px solid rgba(232,168,76,0.15);">
            <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#e8a84c;">✦ &nbsp; Time Capsula &nbsp; ✦</p>
            <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:32px;font-weight:700;color:#f2e8d5;line-height:1.2;">
              A message<br><em style="color:#e8a84c;">from your past</em>
            </h1>
            <p style="margin:0;font-size:14px;color:#c8b898;font-style:italic;">
              Written ${sentDate} &mdash; ${fromLine}
            </p>
          </td>
        </tr>

        <!-- Envelope decoration -->
        <tr>
          <td style="padding:0;text-align:center;background:#080c14;">
            <div style="display:inline-block;width:0;height:0;border-left:300px solid transparent;border-right:300px solid transparent;border-top:32px solid #111d35;"></div>
          </td>
        </tr>

        <!-- Message Body -->
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#e8a84c;font-family:monospace;">
              Dear ${escapeHTML(capsule.to_name)},
            </p>
            <div style="margin:24px 0;padding:28px 32px;background:rgba(255,255,255,0.02);border-left:2px solid rgba(232,168,76,0.4);border-radius:0 4px 4px 0;">
              <p style="margin:0;font-size:17px;line-height:1.9;color:#f2e8d5;font-family:Georgia,serif;">
                ${messageHTML}
              </p>
            </div>
            ${capsule.from_name ? `
            <p style="margin:24px 0 0;font-size:15px;color:#c8b898;font-style:italic;text-align:right;">
              — ${escapeHTML(capsule.from_name)}
            </p>` : ''}
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 48px;">
            <div style="height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.2),transparent);"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px 48px 40px;text-align:center;">
            <p style="margin:0 0 16px;font-size:13px;color:#c8b898;line-height:1.7;">
              This capsule was sealed and waiting for you.<br>
              It traveled through time to reach you today.
            </p>
            <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,184,152,0.3);font-family:monospace;">
              timecapsula.com &nbsp;✦&nbsp; words sealed with care
            </p>
          </td>
        </tr>

      </table>
      <!-- End Card -->

    </td></tr>
  </table>

</body>
</html>`
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
