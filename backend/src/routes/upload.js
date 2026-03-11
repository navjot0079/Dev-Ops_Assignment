/**
 * Upload Routes - Handle file upload and validation
 */

import express from 'express';
import multer from 'multer';
import { parseFile, validateFile } from '../services/fileService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/octet-stream'
        ];

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
 * /api/upload-sales-data:
 *   post:
 *     summary: Upload and validate a sales data file
 *     tags: [Data Processing]
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
 *                 description: CSV or XLSX file (max 10MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data_preview:
 *                   type: object
 *                 rows_count:
 *                   type: integer
 *                 columns:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid file
 *       413:
 *         description: File too large
 */
router.post('/upload-sales-data', upload.single('file'), async (req, res, next) => {
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

        // Return preview (first 5 rows)
        const preview = data.slice(0, 5);
        const columns = data.length > 0 ? Object.keys(data[0]) : [];

        res.json({
            success: true,
            message: 'File uploaded and validated successfully',
            data_preview: { rows: preview },
            rows_count: data.length,
            columns
        });

    } catch (error) {
        if (error.message.includes('Invalid file type')) {
            return res.status(400).json({
                success: false,
                error: error.message,
                status_code: 400
            });
        }
        next(error);
    }
});

// Handle multer errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                error: 'File too large. Maximum size is 10MB',
                status_code: 413
            });
        }
        return res.status(400).json({
            success: false,
            error: error.message,
            status_code: 400
        });
    }
    next(error);
});

export default router;
