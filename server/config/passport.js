// server/config/passport.js
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import pool from "./db.js";

// 1. How to verify a local login
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find user by email
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email],
        );
        if (result.rows.length === 0) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const user = result.rows[0];

        // Compare hashed password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user); // Success!
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// 2. Save user ID to the session cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 3. Get user details from the database using the ID in the cookie
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id],
    );
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});
