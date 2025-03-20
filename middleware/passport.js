import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

const initialize = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const userQuery = "SELECT * FROM users WHERE email = $1";
          const result = await pool.query(userQuery, [email]);

          if (result.rows.length === 0) {
            return done(null, false, { message: "Incorrect email." });
          }

          const user = result.rows[0];

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const query = "SELECT * FROM users WHERE id = $1";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return done(null, false);
      }

      return done(null, result.rows[0]);
    } catch (error) {
      return done(error);
    }
  });

  return passport;
};

export default initialize;
