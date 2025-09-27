import { User } from 'better-auth';

export default defineEventHandler(async (event) => {
  const resend = useResend();
  const sendVerificationEmail = async ({ user, subject, verificationUrl, token }: { 
    user: User; 
    subject: string; 
    verificationUrl: string;
    token: string;
  }) => {
    const emailContent = await render({
      user,
      verificationUrl,
      token
    }); 

    const result = resend.emails.send({
      from: 'Neomons Auth <no-reply@neomons.com>',
      to: user.email,
      subject,
      html: emailContent,
    });
    return result
  }
  const sendEmail = await sendVerificationEmail(await readBody(event));
  return sendEmail;
})

// Function to render Vue component to HTML string
async function render({user, verificationUrl, token}: { user: User; verificationUrl: string; token: string }) {
  return`
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Welcome to Neomons Auth!</h1>
      <p>Hi ${user.name || user.email || 'there'},</p>
      <p>Thanks for signing up! Please verify your email by clicking this link:</p>
      <a href="${verificationUrl}" style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
    </div>
  `
}