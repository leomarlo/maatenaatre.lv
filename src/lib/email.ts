import nodemailer from 'nodemailer';

function createTransport() {
  if (process.env.NODE_ENV !== 'production') {
    // In development, use a no-op transport — we just log
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendMagicLink(email: string, link: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n[DEV] Magic link for ${email}:\n${link}\n`);
    return;
  }

  const transport = createTransport();
  if (!transport) return;

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? 'noreply@maatenaatre.lv',
    to: email,
    subject: 'Your Maate Naatre login link',
    text: `Click to log in: ${link}\n\nThis link expires in 15 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4B5A2A;">Maate Naatre</h2>
        <p>Click below to log in. This link expires in 15 minutes.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#4B5A2A;color:#fff;text-decoration:none;border-radius:4px;">
          Log in
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}
