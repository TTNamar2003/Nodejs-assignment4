import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import {
  findUserByEmail,
  createUserFromGitHub,
  findUserByGitHubId,
  updateUserGitHubId,
} from "../models/userModel.js";

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

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          "http://localhost:5000/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await findUserByGitHubId(profile.id);

          if (existingUser) {
            return done(null, existingUser);
          }

          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value;

          if (email) {
            const userWithEmail = await findUserByEmail(email);

            if (userWithEmail) {
              const updatedUser = await updateUserGitHubId(
                userWithEmail.id,
                profile.id
              );
              return done(null, updatedUser);
            }
          }

          const newUser = await createUserFromGitHub({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: email || `${profile.id}@github.example.com`,
            password: await bcrypt.hash(
              Math.random().toString(36).substring(2),
              10
            ),
            age: 0,
          });

          return done(null, newUser);
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
