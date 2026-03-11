/**
 * Validation Utilities
 * Input sanitization and validation helpers
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;

    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
export function sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return '';

    // Trim whitespace
    let sanitized = email.trim().toLowerCase();

    // Remove any potential injection characters
    sanitized = sanitized.replace(/[<>'"\\;]/g, '');

    return sanitized;
}

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, maxLength = 1000) {
    if (!input || typeof input !== 'string') return '';

    let sanitized = input.trim();

    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    // Remove potential XSS vectors
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    return sanitized;
}

/**
 * Validate file extension
 * @param {string} filename - Filename to check
 * @param {Array<string>} allowedExtensions - List of allowed extensions
 * @returns {boolean} True if valid
 */
export function validateFileExtension(filename, allowedExtensions = ['.csv', '.xlsx', '.xls']) {
    if (!filename || typeof filename !== 'string') return false;

    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    return allowedExtensions.includes(ext);
}

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {boolean} True if valid
 */
export function validateFileSize(size, maxSize = 10 * 1024 * 1024) {
    return typeof size === 'number' && size > 0 && size <= maxSize;
}
