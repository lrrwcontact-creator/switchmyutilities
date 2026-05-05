import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Customer confirmation email ────────────────────────────────────────────
export async function sendConfirmationEmail({ to, submission }) {
  const { id, role, firstName, lastName, propertyAddress, closeDate, utilities, fee } = submission;

  const utilitiesList = utilities.map((u) => `• ${u.type} — ${u.provider}`).join("\n");

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject: `We've got it from here — Confirmation ${id}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F4EF;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1A1612;border-radius:8px 8px 0 0;">
        <tr><td style="padding:32px 40px;border-bottom:4px solid #C85C2D;">
          <p style="margin:0;color:#C85C2D;font-size:11px;letter-spacing:3px;text-transform:uppercase;">SwitchMyUtilities.com</p>
          <h1 style="margin:12px 0 0;color:#ffffff;font-size:28px;font-weight:400;">We've got it from here.</h1>
        </td></tr>
      </table>
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E2DDD8;border-top:none;">
        <tr><td style="padding:32px 40px;">
          <p style="color:#1A1612;font-size:15px;line-height:1.7;">Hi ${firstName},</p>
          <p style="color:#6B6560;font-size:14px;line-height:1.7;">
            Your utility transfer request has been received and we'll begin processing within <strong style="color:#1A1612;">1 business day</strong>. 
            We'll email you as each utility is transferred.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0E8E0;border-radius:6px;margin:24px 0;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6B6560;">Confirmation</p>
              <p style="margin:0 0 16px;font-size:22px;color:#C85C2D;">${id}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#6B6560;">Property</p>
              <p style="margin:0 0 12px;font-size:14px;color:#1A1612;">${propertyAddress}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#6B6560;">Transfer Type</p>
              <p style="margin:0 0 12px;font-size:14px;color:#1A1612;">${role}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#6B6560;">Transfer Date</p>
              <p style="margin:0 0 12px;font-size:14px;color:#1A1612;">${closeDate}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#6B6560;">Utilities</p>
              <p style="margin:0 0 12px;font-size:14px;color:#1A1612;">${utilities.map((u) => u.type).join(", ")}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#6B6560;">Fee Paid</p>
              <p style="margin:0;font-size:14px;color:#1A1612;">$${fee}</p>
            </td></tr>
          </table>
          <p style="color:#6B6560;font-size:13px;line-height:1.7;">
            Questions? Reply to this email anytime.
          </p>
        </td></tr>
      </table>
      <table width="600" cellpadding="0" cellspacing="0" style="background:#F7F4EF;border:1px solid #E2DDD8;border-top:none;border-radius:0 0 8px 8px;">
        <tr><td style="padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#6B6560;">SwitchMyUtilities.com · Utility transfer service</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

// ─── Internal alert email (to you) ─────────────────────────────────────────
export async function sendAdminAlert({ submission }) {
  const { id, role, firstName, lastName, email, phone, propertyAddress, closeDate, utilities, fee, pmDirection } = submission;

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New submission ${id} — ${firstName} ${lastName} (${role})`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#F7F4EF;padding:32px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E2DDD8;border-radius:8px;overflow:hidden;">
    <div style="background:#1A1612;padding:20px 28px;border-bottom:3px solid #C85C2D;">
      <p style="margin:0;color:#C85C2D;font-size:11px;letter-spacing:2px;text-transform:uppercase;">New Submission</p>
      <h2 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:400;">${id} — ${firstName} ${lastName}</h2>
    </div>
    <div style="padding:24px 28px;">
      <table width="100%" cellpadding="6">
        <tr><td style="color:#6B6560;font-size:12px;width:140px;">Role</td><td style="font-size:14px;">${role}${pmDirection ? ` (${pmDirection})` : ""}</td></tr>
        <tr><td style="color:#6B6560;font-size:12px;">Email</td><td style="font-size:14px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="color:#6B6560;font-size:12px;">Phone</td><td style="font-size:14px;">${phone}</td></tr>
        <tr><td style="color:#6B6560;font-size:12px;">Property</td><td style="font-size:14px;">${propertyAddress}</td></tr>
        <tr><td style="color:#6B6560;font-size:12px;">Transfer Date</td><td style="font-size:14px;">${closeDate}</td></tr>
        <tr><td style="color:#6B6560;font-size:12px;">Utilities</td><td style="font-size:14px;">${utilities.map((u) => `${u.type} (${u.provider || "provider TBD"})`).join(", ")}</td></tr>
        <tr><td style="color:#6B6560;font-size:12px;">Fee</td><td style="font-size:14px;color:#C85C2D;font-weight:700;">$${fee}</td></tr>
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #E2DDD8;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/ops" style="background:#C85C2D;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;font-size:13px;">
          View in Dashboard →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`,
  });
}
