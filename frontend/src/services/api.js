import axios from 'axios';

// API base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60 second timeout for AI processing
    headers: {
        'Accept': 'application/json'
    }
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'An unexpected error occurred';

        if (error.response) {
            // Server responded with error
            message = error.response.data?.error ||
                error.response.data?.message ||
                `Server error: ${error.response.status}`;
        } else if (error.request) {
            // No response received
            message = 'Unable to connect to server. Please check your connection.';
        } else {
            // Request setup error
            message = error.message;
        }

        return Promise.reject(new Error(message));
    }
);

/**
 * Upload and validate a sales data file
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Upload response with preview data
 */
export async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-sales-data', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

/**
 * Generate AI summary from sales data
 * @param {File} file - The sales data file
 * @returns {Promise<Object>} Summary response
 */
export async function generateSummary(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/generate-summary', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

/**
 * Send report via email
 * @param {string} email - Recipient email address
 * @param {string} summary - The summary content to send
 * @param {string} subject - Optional email subject
 * @returns {Promise<Object>} Send response
 */
export async function sendReport(email, summary, subject = 'Sales Insight Report') {
    const response = await api.post('/send-report', {
        recipient_email: email,
        summary,
        subject
    });

    return response.data;
}

/**
 * Complete workflow: Upload, generate summary, and send email
 * @param {File} file - The sales data file
 * @param {string} email - Recipient email address
 * @returns {Promise<Object>} Process response with summary
 */
export async function processAndSend(file, email) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipient_email', email);

    const response = await api.post('/process-and-send', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

/**
 * Health check
 * @returns {Promise<Object>} Health status
 */
export async function healthCheck() {
    const response = await api.get('/health');
    return response.data;
}

export default api;
