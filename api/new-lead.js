import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://footprintforge.in');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, mobile, address, tier, price, clientRef } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const firstName = name.split(' ')[0] || 'there';
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // ── 1. Notify Yogaprabhu ──────────────────────────────
    await resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to:   process.env.NOTIFY_EMAIL,
      subject: `🔥 New Lead: ${name} — ${tier || 'No tier'}`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#07090f;color:#e6edf3;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#c27e42,#e6b981);padding:24px 28px">
            <h1 style="margin:0;font-size:20px;color:#07090f;font-weight:800">🔥 New Lead Received</h1>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(7,9,15,0.7)">${date}</p>
          </div>
          <div style="padding:28px">
            <table style="width:100%;border-collapse:collapse">
              ${[
                ['Name',    name],
                ['Email',   email    || '—'],
                ['Mobile',  mobile   || '—'],
                ['Address', address  || '—'],
                ['Package', tier     || '—'],
                ['Price',   price ? '₹' + price : '—'],
                ['Ref',     clientRef || 'Being generated'],
              ].map(([k,v]) => `
                <tr>
                  <td style="padding:8px 0;font-size:11px;color:#7d8590;text-transform:uppercase;letter-spacing:0.08em;width:90px">${k}</td>
                  <td style="padding:8px 0;font-size:13px;color:#e6edf3;font-weight:600">${v}</td>
                </tr>
              `).join('')}
            </table>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08)">
              ${mobile ? `<a href="https://wa.me/${mobile.replace(/\D/g,'')}?text=Hi+${encodeURIComponent(firstName)}%2C+thanks+for+your+interest+in+Footprint+Forge%21+I%27m+Yogaprabhu.+Could+you+share+more+about+what+you%27re+looking+for%3F" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;margin-right:10px">💬 Reply on WhatsApp</a>` : ''}
              <a href="https://footprintforge.in/command-center-v2.html" style="display:inline-block;background:rgba(194,126,66,0.15);color:#e6b981;border:1px solid rgba(194,126,66,0.3);padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700">Open Command Center</a>
            </div>
          </div>
        </div>
      `,
    });

    // ── 2. Auto-reply to client ───────────────────────────
    if (email) {
      await resend.emails.send({
        from:    `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to:      email,
        replyTo: process.env.NOTIFY_EMAIL,
        subject: `Thanks for reaching out, ${firstName}! — Footprint Forge`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#07090f;color:#e6edf3;border-radius:16px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#c27e42,#e6b981);padding:24px 28px">
              <h1 style="margin:0;font-size:20px;color:#07090f;font-weight:800">Footprint Forge</h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(7,9,15,0.7)">Identity Infrastructure · Chennai</p>
            </div>
            <div style="padding:28px">
              <p style="font-size:16px;color:#e6edf3;margin:0 0 16px">Hi ${firstName},</p>
              <p style="font-size:14px;color:#7d8590;line-height:1.7;margin:0 0 16px">
                Thank you for your interest in Footprint Forge! 🙏
              </p>
              <p style="font-size:14px;color:#7d8590;line-height:1.7;margin:0 0 16px">
                I've received your enquiry for <strong style="color:#e6b981">${tier || 'our package'}</strong> and will personally reach out to you on WhatsApp within a few hours to understand your requirements and get things moving.
              </p>
              <p style="font-size:14px;color:#7d8590;line-height:1.7;margin:0 0 24px">
                In the meantime, feel free to explore our work at <a href="https://footprintforge.in" style="color:#c27e42">footprintforge.in</a>.
              </p>
              <div style="background:rgba(194,126,66,0.08);border:1px solid rgba(194,126,66,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px">
                <p style="margin:0;font-size:12px;color:#7d8590;text-transform:uppercase;letter-spacing:0.1em">Your Selected Package</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#e6b981">${tier || '—'}</p>
                ${price ? `<p style="margin:2px 0 0;font-size:13px;color:#c27e42;font-family:monospace">₹${price}</p>` : ''}
              </div>
              <p style="font-size:14px;color:#e6edf3;margin:0 0 4px;font-weight:700">Yogaprabhu S.</p>
              <p style="font-size:12px;color:#7d8590;margin:0">Founder · Footprint Forge</p>
              <p style="font-size:12px;color:#c27e42;margin:4px 0 0">+91 99520 41493</p>
            </div>
          </div>
        `,
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('new-lead error:', error);
    return res.status(500).json({ error: error.message });
  }
}
