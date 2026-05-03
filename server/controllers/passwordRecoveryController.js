import pool from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../config/email.js"; // We'll create this next

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log(`🔑 Password reset request received for: ${email}`);

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    console.log(`🔎 Checking database for email: ${email}`);
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      // For security, always return a generic success message even if user not found
      // This prevents email enumeration attacks.
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const user = userResult.rows[0];

    // 1. Generate a secure, URL-safe token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Hash before storing — if the DB is ever breached, raw tokens can't be used directly.
    // The plaintext token goes only in the email link; we never store it.
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // 2. Save HASHED token to DB (not the plaintext one)
    console.log(`💾 Saving hashed reset token for user ID: ${user.id}`);
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires_at = $2 WHERE id = $3",
      [hashedToken, resetTokenExpiresAt, user.id],
    );

    // 3. Construct URL with plaintext token (user's link) and send email
    console.log(`📧 Attempting to send email via SMTP...`);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    console.log(`✅ Success: Reset link sent to ${email}`);
    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process password reset request." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  console.log("🔄 Password reset attempt received with token");

  if (!token || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Token, new password, and confirmation are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Hash the received token to compare against the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("🔎 Verifying reset token in database...");
    const userResult = await pool.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires_at > NOW()",
      [hashedToken],
    );

    if (userResult.rows.length === 0) {
      console.log("⚠️ Invalid or expired token used.");
      return res
        .status(400)
        .json({ error: "Invalid or expired password reset token." });
    }

    const user = userResult.rows[0];

    // Hash the new password
    console.log(`🔐 Hashing new password for user ID: ${user.id}`);
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token fields
    console.log("💾 Updating database and clearing token...");
    await pool.query(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires_at = NULL WHERE id = $2",
      [passwordHash, user.id],
    );

    console.log("✅ Password reset successful!");
    res.json({
      message: "Your password has been reset successfully. Please log in.",
    });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ error: "Failed to reset password." });
  }
};
