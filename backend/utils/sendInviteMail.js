import nodemailer from "nodemailer";

export const sendAdminInviteEmail = async (receiverEmail, inviteLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.OTP_EMAIL,  // Sender's email
        pass: process.env.OTP_EMAIL_PSWD,  // App password from Google
      },
    });

    const mailOptions = {
      from: `"TktPlz Admin Team" <${process.env.OTP_EMAIL}>`,
      to: receiverEmail,
      subject: "You're Invited to Join TktPlz as an Admin!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1A73E8;">Welcome to TktPlz 🎉</h2>
          <p>Hi there,</p>
          <p>You've been invited to join <strong>TktPlz</strong> as an admin. We’re thrilled to have you onboard!</p>
          <p>To get started, click the button below to accept your invitation and complete the setup:</p>
          <p><b>This link is valid for 60 minutes</b></p>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${inviteLink}" style="background-color: #1A73E8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>

          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p style="word-break: break-word;"><a href="${inviteLink}">${inviteLink}</a></p>

          <hr style="margin: 30px 0;" />
          <p style="font-size: 13px; color: #888;">This invitation link is valid for one-time use. If you did not expect this invitation, you can safely ignore this email.</p>
          <p style="font-size: 13px; color: #888;">— The TktPlz Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Invite email sent to:", receiverEmail);
  } catch (err) {
    console.error("Failed to send invite email:", err);
    throw new Error("Could not send invitation email");
  }
};
