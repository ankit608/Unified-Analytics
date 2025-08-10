import express from "express";
import { collectEvent, getSummary, userStats } from "../controllers/analytics.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics event tracking and reporting
 */

/**
 * @swagger
 * /analytics/collect:
 *   post:
 *     summary: Collect an analytics event
 *     description: Records an event for analytics tracking.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - url
 *               - device
 *             properties:
 *               app_id:
 *                 type: string
 *                 format: uuid
 *                 example: "e65387b3-ae87-4d50-afc9-2286c85cb94d"
 *               event:
 *                 type: string
 *                 example: login_form_cta_click
 *               url:
 *                 type: string
 *                 example: "https://example.com/page"
 *               referrer:
 *                 type: string
 *                 example: "https://google.com"
 *               device:
 *                 type: string
 *                 example: desktop
 *               ipAddress:
 *                 type: string
 *                 example: "192.168.0.1"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *               userId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       201:
 *         description: Event collected successfully
 *       500:
 *         description: Server error
 */
router.post("/collect", rateLimiter, collectEvent);

/**
 * @swagger
 * /analytics/event-summary:
 *   get:
 *     summary: Get analytics event summary
 *     description: Returns total event count, unique users, and device breakdown for a given event.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: event
 *         required: true
 *         schema:
 *           type: string
 *         example: login_form_cta_click
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2025-08-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2025-08-09
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *           format: uuid
 *         example: e65387b3-ae87-4d50-afc9-2286c85cb94d
 *     responses:
 *       200:
 *         description: Event summary returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 uniqueUsers:
 *                   type: integer
 *                 deviceData:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *       400:
 *         description: Missing event parameter
 *       500:
 *         description: Server error
 */
router.get("/event-summary", rateLimiter, getSummary);

/**
 * @swagger
 * /analytics/user-stats:
 *   get:
 *     summary: Get user statistics
 *     description: Returns total events for a user and latest device/IP details.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 totalEvents:
 *                   type: integer
 *                 deviceDetails:
 *                   type: object
 *                   properties:
 *                     browser:
 *                       type: string
 *                     os:
 *                       type: string
 *                 ipAddress:
 *                   type: string
 *       400:
 *         description: Missing userId parameter
 *       404:
 *         description: No events found for this user
 *       500:
 *         description: Server error
 */
router.get("/user-stats", rateLimiter, userStats);

export default router;
