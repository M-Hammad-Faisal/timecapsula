// @ts-nocheck -- Deno runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL = 'TimeCapsula <capsule@timecapsula.website>'

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const [deliveryResult, reminderResult] = await Promise.all([
      processDeliveries(),
      processReminders(),
    ])

    return Response.json({
      delivered: deliveryResult.delivered,
      deliveryFailed: deliveryResult.failed,
      reminders: reminderResult.sent,
      reminderFailed: reminderResult.failed,
    })

  } catch (err) {
    console.error('Edge function error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
})

// ── Deliver capsules that are due ─────────────────────────────────
async function processDeliveries() {
  const { data: capsules, error } = await supabase
    .from('capsules')
    .select('*')
    .lte('deliver_at', new Date().toISOString())
    .eq('delivered', false)
    .limit(50)

  if (error) throw error
  if (!capsules?.length) {
    console.log('No capsules due for delivery')
    return { delivered: 0, failed: 0 }
  }

  console.log(`Delivering ${capsules.length} capsule(s)`)
  const results = await Promise.allSettled(capsules.map(c => deliverCapsule(c)))
  const delivered = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  console.log(`Delivered: ${delivered}, Failed: ${failed}`)
  return { delivered, failed }
}

// ── Send reminders for capsules due in ~7 days ────────────────────
async function processReminders() {
  const now = new Date()
  const in6Days = new Date(now); in6Days.setDate(now.getDate() + 6)
  const in8Days = new Date(now); in8Days.setDate(now.getDate() + 8)

  const { data: capsules, error } = await supabase
    .from('capsules')
    .select('*')
    .gte('deliver_at', in6Days.toISOString())
    .lte('deliver_at', in8Days.toISOString())
    .eq('delivered', false)
    .eq('reminder_sent', false)
    .not('from_name', 'is', null) // only remind if sender left their name
    .limit(50)

  if (error) throw error
  if (!capsules?.length) {
    console.log('No reminders to send')
    return { sent: 0, failed: 0 }
  }

  console.log(`Sending ${capsules.length} reminder(s)`)
  const results = await Promise.allSettled(capsules.map(c => sendReminder(c)))
  const sent = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  console.log(`Reminders sent: ${sent}, Failed: ${failed}`)
  return { sent, failed }
}

// ── Send one delivery email ───────────────────────────────────────
async function deliverCapsule(capsule: any) {
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: capsule.to_email,
      subject: capsule.subject
        ? `✦ ${capsule.subject} — A message from your past`
        : `✦ A message from your past has arrived`,
      html: buildDeliveryEmail(capsule),
    }),
  })

  if (!emailRes.ok) throw new Error(`Resend error: ${await emailRes.text()}`)

  const { error } = await supabase
    .from('capsules')
    .update({ delivered: true, delivered_at: new Date().toISOString() })
    .eq('id', capsule.id)

  if (error) throw error
  console.log(`✅ Delivered ${capsule.id} to ${capsule.to_email}`)
}

// ── Send one reminder email to the SENDER ────────────────────────
async function sendReminder(capsule: any) {
  // We email the recipient's address but address it to the sender
  // In a future version we'd store sender email separately
  const daysLeft = Math.ceil((new Date(capsule.deliver_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const deliveryDate = new Date(capsule.deliver_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: capsule.to_email,
      subject: `✦ Your time capsule opens in ${daysLeft} days`,
      html: buildReminderEmail(capsule, daysLeft, deliveryDate),
    }),
  })

  if (!emailRes.ok) throw new Error(`Resend reminder error: ${await emailRes.text()}`)

  const { error } = await supabase
    .from('capsules')
    .update({ reminder_sent: true })
    .eq('id', capsule.id)

  if (error) throw error
  console.log(`🔔 Reminder sent for ${capsule.id}`)
}

// ── Email Templates ───────────────────────────────────────────────
function buildDeliveryEmail(capsule: any): string {
  const sentDate = new Date(capsule.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const fromLine = capsule.from_name ? `from ${capsule.from_name}` : 'from someone who cares'
  const messageHTML = capsule.message.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080c14;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d1525;border:1px solid rgba(232,168,76,0.2);border-radius:4px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0d1525,#111d35);padding:48px 40px 32px;text-align:center;border-bottom:1px solid rgba(232,168,76,0.15);">
<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#e8a84c;">✦ &nbsp; Time Capsula &nbsp; ✦</p>
<h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:32px;font-weight:700;color:#f2e8d5;line-height:1.2;">A message<br><em style="color:#e8a84c;">from your past</em></h1>
<p style="margin:0;font-size:14px;color:#c8b898;font-style:italic;">Written ${sentDate} — ${fromLine}</p>
</td></tr>
<tr><td style="padding:40px 48px;">
<p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#e8a84c;font-family:monospace;">Dear ${escapeHTML(capsule.to_name)},</p>
<div style="margin:24px 0;padding:28px 32px;background:rgba(255,255,255,0.02);border-left:2px solid rgba(232,168,76,0.4);border-radius:0 4px 4px 0;">
<p style="margin:0;font-size:17px;line-height:1.9;color:#f2e8d5;font-family:Georgia,serif;">${messageHTML}</p>
</div>
${capsule.from_name ? `<p style="margin:24px 0 0;font-size:15px;color:#c8b898;font-style:italic;text-align:right;">— ${escapeHTML(capsule.from_name)}</p>` : ''}
</td></tr>
<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.2),transparent);"></div></td></tr>
<tr><td style="padding:32px 48px 40px;text-align:center;">
<p style="margin:0 0 16px;font-size:13px;color:#c8b898;line-height:1.7;">This capsule was sealed and waiting for you.<br>It traveled through time to reach you today.</p>
<p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,184,152,0.3);font-family:monospace;">timecapsula.website &nbsp;✦&nbsp; words sealed with care</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

function buildReminderEmail(capsule: any, daysLeft: number, deliveryDate: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080c14;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d1525;border:1px solid rgba(232,168,76,0.2);border-radius:4px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0d1525,#111d35);padding:48px 40px 32px;text-align:center;border-bottom:1px solid rgba(232,168,76,0.15);">
<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#e8a84c;">✦ &nbsp; Time Capsula &nbsp; ✦</p>
<h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:32px;font-weight:700;color:#f2e8d5;line-height:1.2;">Opening in<br><em style="color:#e8a84c;">${daysLeft} days</em></h1>
<p style="margin:0;font-size:14px;color:#c8b898;font-style:italic;">A message sealed for ${escapeHTML(capsule.to_name)} is almost ready.</p>
</td></tr>
<tr><td style="padding:40px 48px;text-align:center;">
<p style="font-size:16px;color:#f2e8d5;line-height:1.8;margin:0 0 24px;">The time capsule addressed to <strong style="color:#e8a84c;">${escapeHTML(capsule.to_name)}</strong> will be delivered on <strong style="color:#e8a84c;">${deliveryDate}</strong>.</p>
<p style="font-size:14px;color:#c8b898;font-style:italic;line-height:1.7;margin:0;">The words you sealed are waiting. In ${daysLeft} days, they will find their way.</p>
</td></tr>
<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(to right,transparent,rgba(232,168,76,0.2),transparent);"></div></td></tr>
<tr><td style="padding:32px 48px 40px;text-align:center;">
<p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,184,152,0.3);font-family:monospace;">timecapsula.website &nbsp;✦&nbsp; words sealed with care</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

function escapeHTML(str: string): string {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
