import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://footprintforge.in');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { clientName, clientEmail, clientId, tagline, designStyle } = req.body;
    const firstName = (clientName || '').split(' ')[0] || 'Client';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // ── 1. Notify Yogaprabhu ──────────────────────────────
    await resend.emails.send({
      from:    `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to:      process.env.NOTIFY_EMAIL,
      subject: `📥 Brief Submitted: ${clientName}`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#07090f;color:#e6edf3;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#c27e42,#e6b981);padding:24px 28px">
            <h1 style="margin:0;font-size:20px;color:#07090f;font-weight:800">📥 Portfolio Brief Received</h1>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(7,9,15,0.7)">${date}</p>
          </div>
          <div style="padding:28px">
            <p style="font-size:15px;color:#e6edf3;margin:0 0 16px"><strong>${clientName}</strong> just submitted their portfolio brief.</p>
            ${tagline ? `<p style="font-size:13px;color:#7d8590;margin:0 0 8px"><strong style="color:#e6b981">Tagline:</strong> ${tagline}</p>` : ''}
            ${designStyle ? `<p style="font-size:13px;color:#7d8590;margin:0 0 20px"><strong style="color:#e6b981">Design Style:</strong> ${designStyle}</p>` : ''}
            <a href="https://footprintforge.in/command-center-v2.html" style="display:inline-block;background:linear-gradient(135deg,#e6b981,#c27e42);color:#07090f;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:800">
              View Brief in Command Center →
            </a>
          </div>
        </div>
      `,
    });

    // ── 2. Confirm to client ──────────────────────────────
    if (clientEmail) {
      await resend.emails.send({
        from:    `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to:      clientEmail,
        replyTo: process.env.NOTIFY_EMAIL,
        subject: `Brief Received — We're Starting Your Build, ${firstName}! 🎨`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#07090f;color:#e6edf3;border-radius:16px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#c27e42,#e6b981);padding:24px 28px">
              <h1 style="margin:0;font-size:20px;color:#07090f;font-weight:800">Brief Received! 🎨</h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(7,9,15,0.7)">Footprint Forge · Identity Infrastructure</p>
            </div>
            <div style="padding:28px">
              <p style="font-size:16px;color:#e6edf3;margin:0 0 16px">Hi ${firstName},</p>
              <p style="font-size:14px;color:#7d8590;line-height:1.7;margin:0 0 16px">
                Your portfolio brief has been received — thank you! 🙏
              </p>
              <p style="font-size:14px;color:#7d8590;line-height:1.7;margin:0 0 16px">
                I'll review everything carefully and start building your portfolio. You'll receive a preview link for your approval once it's ready — typically within 3–5 working days.
              </p>
              <p style="font-size:14px;color:#7d8590;line-height:1.7;margin:0 0 24px">
                If you think of anything else you'd like to add or change, just reply to this email or reach out on WhatsApp.
              </p>
              <p style="font-size:14px;color:#e6edf3;margin:0 0 4px;font-weight:700">Yogaprabhu S.</p>
              <p style="font-size:12px;color:#7d8590;margin:0">Founder · Footprint Forge</p>
              <p style="font-size:12px;color:#c27e42;margin:4px 0 0">+91 99520 41493 · footprintforge.in</p>
            </div>
          </div>
        `,
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('brief-submitted error:', error);
    return res.status(500).json({ error: error.message });
  }
}
