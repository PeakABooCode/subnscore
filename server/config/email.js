import nodemailer from "nodemailer";

// Configure Nodemailer transporter
// For local development, you might use a service like Mailtrap or Ethereal.email
// For production, use SendGrid, Mailgun, or a configured SMTP server.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_PORT === "465", // SSL/TLS for 465, STARTTLS (false) for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("📧 SMTP Server is ready to take our messages");
  }
});

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const mailOptions = {
    from:
      process.env.EMAIL_FROM || "SubNScore Support <no-reply@subnscore.com>",
    to: toEmail,
    subject: "SubNScore Password Reset Request",
    html: `
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      console.log(`✅ Email delivered: ${info.messageId}`);
    }

    // Generate preview URL if using Ethereal (helpful for local debugging)
    if (process.env.EMAIL_HOST?.includes("ethereal")) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`📧 Ethereal Preview URL: ${previewUrl}`);
    }
  } catch (error) {
    console.error(
      `❌ Failed to send password reset email to ${toEmail}:`,
      error,
    );
    throw new Error("Email sending failed."); // Re-throw to be caught by calling function
  }
};
