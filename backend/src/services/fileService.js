/**
 * File Service - Parse CSV and Excel files
 */

import * as XLSX from 'xlsx';

/**
 * Parse uploaded file (CSV or Excel) into JSON array
 * @param {Object} file - Multer file object
 * @returns {Promise<Array>} Array of row objects
 */
export async function parseFile(file) {
    try {
        const buffer = file.buffer;
        const filename = file.originalname.toLowerCase();

        let data;

        if (filename.endsWith('.csv')) {
            // Parse CSV
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        } else {
            // Parse Excel (xlsx/xls)
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to parse file: ${error.message}`);
    }
}

/**
 * Validate parsed file data
 * @param {Array} data - Parsed data array
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
export function validateFile(data) {
    // Check if data is empty
    if (!data || data.length === 0) {
        return {
            valid: false,
            error: 'The uploaded file is empty'
        };
    }

    // Check row limit (prevent resource abuse)
    if (data.length > 100000) {
        return {
            valid: false,
            error: 'File contains too many rows. Maximum is 100,000 rows'
        };
    }

    // Check if data has at least one column
    const firstRow = data[0];
    if (!firstRow || Object.keys(firstRow).length === 0) {
        return {
            valid: false,
            error: 'The uploaded file has no valid columns'
        };
    }

    return { valid: true };
}

/**
 * Get file statistics for preview
 * @param {Array} data - Parsed data array
 * @returns {Object} Statistics object
 */
export function getFileStats(data) {
    if (!data || data.length === 0) {
        return {
            rowCount: 0,
            columns: [],
            preview: []
        };
    }

    return {
        rowCount: data.length,
        columns: Object.keys(data[0]),
        preview: data.slice(0, 5)
    };
}
