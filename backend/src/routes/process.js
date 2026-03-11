/**
 * Process Routes - Complete workflow: Upload, Generate Summary, Send Email
 */

import express from 'express';
import multer from 'multer';
import { parseFile, validateFile } from '../services/fileService.js';
import { generateSalesSummary } from '../services/aiService.js';
import { sendEmailReport } from '../services/emailService.js';
import { sanitizeEmail, validateEmail } from '../utils/validators.js';

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.csv', '.xlsx', '.xls'];
        const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
        }
    }
});

/**
 * @swagger
 * /api/process-and-send:
 *   post:
 *     summary: Complete workflow - Upload, generate summary, and send email
 *     tags: [Complete Workflow]
 *     description: |
 *       This is an all-in-one endpoint that:
 *       1. Validates and parses the uploaded file
 *       2. Generates an AI-powered executive summary
 *       3. Sends the report to the specified email address
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - recipient_email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX file with sales data
 *               recipient_email:
 *                 type: string
 *                 format: email
 *                 description: Email address for report delivery
 *     responses:
 *       200:
 *         description: Report generated and sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: string
 *       400:
 *         description: Invalid file or email
 *       500:
 *         description: Processing or email error
 */
router.post('/process-and-send', upload.single('file'), async (req, res, next) => {
    try {
        // Validate file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded',
                status_code: 400
            });
        }

        // Validate email
        const { recipient_email } = req.body;
        if (!recipient_email) {
            return res.status(400).json({
                success: false,
                error: 'Recipient email is required',
                status_code: 400
            });
        }

        if (!validateEmail(recipient_email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address',
                status_code: 400
            });
        }

        const sanitizedEmail = sanitizeEmail(recipient_email);

        // Parse the file
        const data = await parseFile(req.file);

        // Validate data
        const validation = validateFile(data);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.error,
                status_code: 400
            });
        }

        // Generate AI summary
        const summary = await generateSalesSummary(data);

        // Send email
        try {
            await sendEmailReport(
                sanitizedEmail,
                summary,
                'Sales Insight Report - Executive Summary'
            );
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                error: `Summary generated but email failed: ${emailError.message}`,
                summary,
                status_code: 500
            });
        }

        res.json({
            success: true,
            message: `Report generated and sent successfully to ${sanitizedEmail}`,
            summary
        });

    } catch (error) {
        console.error('Process error:', error);
        next(error);
    }
});

export default router;
