/**
 * Email Routes - Send report via email
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendEmailReport } from '../services/emailService.js';
import { sanitizeEmail } from '../utils/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/send-report:
 *   post:
 *     summary: Send a generated summary report via email
 *     tags: [Email Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_email
 *               - summary
 *             properties:
 *               recipient_email:
 *                 type: string
 *                 format: email
 *                 description: Email address to send the report to
 *               summary:
 *                 type: string
 *                 description: The AI-generated summary content
 *               subject:
 *                 type: string
 *                 description: Optional email subject line
 *                 default: Sales Insight Report
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Email service error
 */
router.post('/send-report', [
    body('recipient_email')
        .isEmail()
        .withMessage('Valid email address is required')
        .normalizeEmail(),
    body('summary')
        .isString()
        .isLength({ min: 10 })
        .withMessage('Summary must be at least 10 characters')
        .trim(),
    body('subject')
        .optional()
        .isString()
        .isLength({ max: 200 })
        .trim()
], async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg,
                status_code: 400
            });
        }

        const { recipient_email, summary, subject = 'Sales Insight Report' } = req.body;

        // Sanitize email
        const sanitizedEmail = sanitizeEmail(recipient_email);

        // Send email
        await sendEmailReport(sanitizedEmail, summary, subject);

        res.json({
            success: true,
            message: `Report sent successfully to ${sanitizedEmail}`
        });

    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({
            success: false,
            error: `Failed to send email: ${error.message}`,
            status_code: 500
        });
    }
});

export default router;
