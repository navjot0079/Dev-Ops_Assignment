/**
 * Summary Routes - Generate AI-powered summaries
 */

import express from 'express';
import multer from 'multer';
import { parseFile, validateFile } from '../services/fileService.js';
import { generateSalesSummary } from '../services/aiService.js';

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
 * /api/generate-summary:
 *   post:
 *     summary: Generate an AI-powered executive summary from sales data
 *     tags: [AI Analysis]
 *     description: |
 *       Uses Google Gemini to analyze the data and generate insights including:
 *       - Top performing regions
 *       - Revenue trends
 *       - Product performance
 *       - Potential anomalies
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX file with sales data
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 summary:
 *                   type: string
 *                 generated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid file or data
 *       500:
 *         description: AI service error
 */
router.post('/generate-summary', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded',
                status_code: 400
            });
        }

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

        res.json({
            success: true,
            summary,
            generated_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Summary generation error:', error);
        next(error);
    }
});

export default router;
