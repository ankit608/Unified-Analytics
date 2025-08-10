import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { RegisterApp, Get_API_KEY, RevokeAPI_Key } from "../controllers/auth.js";
import { User } from "../model/user.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User and application authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new application
 *     description: Registers a new application and issues an API key.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appName
 *             properties:
 *               appName:
 *                 type: string
 *                 example: My Web App
 *     responses:
 *       201:
 *         description: Application registered successfully
 *       400:
 *         description: Invalid request
 */
router.post("/register", RegisterApp);

/**
 * @swagger
 * /auth/api-key:
 *   get:
 *     summary: Retrieve your API key
 *     description: Returns the API key for the authenticated application.
 *     tags: [Authentication]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: API key retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/api-key", Get_API_KEY);

/**
 * @swagger
 * /auth/revoke:
 *   post:
 *     summary: Revoke an API key
 *     description: Revokes the API key for the authenticated application.
 *     tags: [Authentication]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/revoke", RevokeAPI_Key);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google OAuth2 login
 *     description: Redirects the user to Google for authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     description: Handles the callback from Google, signs a JWT, and sets it as an HTTP-only cookie.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       302:
 *         description: Redirect if authentication fails
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res, next) => {
    console.log("hello");

    if (!req.user) {
      return res.redirect("https://www.google.com");
    }

    // Check if user exists
    const exist = await User.findOne({
      where: { email: req.user.emails?.[0]?.value }
    });

    if (!exist) {
      await User.create({
        name: req.user.displayName,
        email: req.user.emails?.[0]?.value
      });
    }

    const payload = {
      id: req.user.id,
      name: req.user.displayName,
      email: req.user.emails?.[0]?.value
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000
    });

    res.status(200).json({ success: true });
  }
);

export default router;
