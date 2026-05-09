// We use Brevo's HTTP API to send emails instead of SMTP because Render 
// blocks outbound SMTP ports (465, 587) on its Free Tier.

async function sendBrevoEmail({ to, subject, htmlContent }: { to: string; subject: string; htmlContent: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error("BREVO_API_KEY is not set in environment variables!");
    throw new Error("Missing Brevo API Key");
  }

  // We still use EMAIL_USER as the sender address (it must be verified in Brevo)
  const senderEmail = process.env.EMAIL_USER || "noreply@skillsphere.com";

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'Skill Sphere', email: senderEmail },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Brevo API Error:", errorData);
    throw new Error(`Failed to send email via Brevo: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function sendOtpEmail(email: string, otp: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 4px solid black; border-radius: 12px;">
      <h1 style="text-align: center; color: #4F7DF3; font-weight: 900;">SKILL SPHERE</h1>
      <p style="font-size: 18px; font-weight: bold; text-align: center;">Your verification code is:</p>
      <div style="background: #F5C84C; padding: 20px; text-align: center; font-size: 48px; font-weight: 900; border: 4px solid black; border-radius: 12px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="text-align: center; color: #666;">This code will expire in 10 minutes.</p>
      <p style="text-align: center; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return sendBrevoEmail({
    to: email,
    subject: "Your Skill Sphere Verification Code",
    htmlContent: html
  });
}

export async function sendNewPasswordEmail(email: string, newPassword: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 4px solid black; border-radius: 12px;">
      <h1 style="text-align: center; color: #4F7DF3; font-weight: 900;">SKILL SPHERE</h1>
      <p style="font-size: 18px; font-weight: bold; text-align: center;">Your password has been reset.</p>
      <p style="text-align: center;">Your temporary new password is:</p>
      <div style="background: #34D399; padding: 20px; text-align: center; font-size: 24px; font-weight: 900; border: 4px solid black; border-radius: 12px; margin: 20px 0;">
        ${newPassword}
      </div>
      <p style="text-align: center; color: #666;">Please log in and change your password immediately from your profile settings.</p>
    </div>
  `;

  return sendBrevoEmail({
    to: email,
    subject: "Your New Skill Sphere Password",
    htmlContent: html
  });
}

export async function sendFeedbackEmail(userEmail: string, userName: string, feedbackType: string, content: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 4px solid black; border-radius: 20px; background: white;">
      <h1 style="text-align: center; color: black; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px;">
        <span style="background: #F5C84C; padding: 5px 15px; border: 3px solid black; border-radius: 10px;">USER FEEDBACK</span>
      </h1>
      
      <div style="background: #f0f0f0; padding: 20px; border: 3px solid black; border-radius: 15px; margin-bottom: 25px;">
        <p style="margin: 0; font-weight: 900; text-transform: uppercase; font-size: 12px; color: #666;">Feedback Category</p>
        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 900; color: #4F7DF3;">${feedbackType.toUpperCase()}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0; font-weight: 900; text-transform: uppercase; font-size: 12px; color: #666;">User Message</p>
        <div style="margin-top: 10px; padding: 20px; border: 3px solid black; border-radius: 15px; font-size: 16px; font-weight: 500; line-height: 1.6; background: #fff;">
          ${content}
        </div>
      </div>

      <div style="border-top: 3px solid black; padding-top: 20px; margin-top: 30px;">
        <p style="margin: 0; font-size: 14px; font-weight: 900;">SENT BY:</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 700;">${userName} (${userEmail})</p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: "skillspheretest@gmail.com",
    subject: `New Feedback: [${feedbackType.toUpperCase()}] from ${userName}`,
    htmlContent: html
  });
}
