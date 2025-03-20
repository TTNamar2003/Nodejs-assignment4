import express from "express";
import passport from "passport";
import {
  signUp,
  login,
  logout,
  getProfile,
  githubCallback,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getProfile);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/login",
    successRedirect: "/api/auth/profile",
    failureFlash: true,
  }),
  githubCallback
);

export default router;
