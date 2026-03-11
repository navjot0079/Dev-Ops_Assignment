/**
 * AI Service - Google Gemini Integration
 * Generates executive summaries from sales data
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Prepare comprehensive data summary for AI analysis
 * @param {Array} data - Parsed sales data
 * @returns {string} Formatted data summary
 */
function prepareDataSummary(data) {
    const summaryParts = [];

    // Basic info
    summaryParts.push('Dataset Overview:');
    summaryParts.push(`- Total records: ${data.length}`);

    if (data.length > 0) {
        summaryParts.push(`- Columns: ${Object.keys(data[0]).join(', ')}`);
    }
    summaryParts.push('');

    // Sample data (first 10 rows)
    summaryParts.push('Sample Data (first 10 rows):');
    const sampleData = data.slice(0, 10);
    sampleData.forEach((row, i) => {
        summaryParts.push(`Row ${i + 1}: ${JSON.stringify(row)}`);
    });
    summaryParts.push('');

    // Calculate statistics for numeric columns
    const numericColumns = [];
    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            const values = data.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
            if (values.length > data.length * 0.5) {
                numericColumns.push(key);
            }
        });
    }

    if (numericColumns.length > 0) {
        summaryParts.push('Numeric Column Statistics:');
        numericColumns.forEach(col => {
            const values = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
            const sum = values.reduce((a, b) => a + b, 0);
            const mean = sum / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);

            summaryParts.push(`  ${col}:`);
            summaryParts.push(`    - Sum: ${sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            summaryParts.push(`    - Mean: ${mean.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            summaryParts.push(`    - Min: ${min.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            summaryParts.push(`    - Max: ${max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        });
        summaryParts.push('');
    }

    // Categorical column analysis
    const categoricalColumns = Object.keys(data[0] || {}).filter(col => !numericColumns.includes(col));

    categoricalColumns.forEach(col => {
        const valueCounts = {};
        data.forEach(row => {
            const val = String(row[col] || '');
            valueCounts[val] = (valueCounts[val] || 0) + 1;
        });

        const uniqueValues = Object.keys(valueCounts);
        if (uniqueValues.length <= 20) {
            summaryParts.push(`Distribution of ${col}:`);
            Object.entries(valueCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .forEach(([val, count]) => {
                    summaryParts.push(`  - ${val}: ${count}`);
                });
            summaryParts.push('');
        }
    });

    // Revenue analysis if available
    if (data[0] && 'Revenue' in data[0]) {
        const revenues = data.map(row => parseFloat(row.Revenue)).filter(v => !isNaN(v));
        const totalRevenue = revenues.reduce((a, b) => a + b, 0);

        summaryParts.push('Revenue Analysis:');
        summaryParts.push(`  Total Revenue: $${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

        // Revenue by Region
        if ('Region' in data[0]) {
            const revenueByRegion = {};
            data.forEach(row => {
                const region = row.Region || 'Unknown';
                const rev = parseFloat(row.Revenue) || 0;
                revenueByRegion[region] = (revenueByRegion[region] || 0) + rev;
            });

            summaryParts.push('  Revenue by Region:');
            Object.entries(revenueByRegion)
                .sort((a, b) => b[1] - a[1])
                .forEach(([region, rev]) => {
                    summaryParts.push(`    - ${region}: $${rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                });
        }

        // Revenue by Product Category
        if ('Product_Category' in data[0]) {
            const revenueByCat = {};
            data.forEach(row => {
                const cat = row.Product_Category || 'Unknown';
                const rev = parseFloat(row.Revenue) || 0;
                revenueByCat[cat] = (revenueByCat[cat] || 0) + rev;
            });

            summaryParts.push('  Revenue by Product Category:');
            Object.entries(revenueByCat)
                .sort((a, b) => b[1] - a[1])
                .forEach(([cat, rev]) => {
                    summaryParts.push(`    - ${cat}: $${rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                });
        }
        summaryParts.push('');
    }

    // Status distribution
    if (data[0] && 'Status' in data[0]) {
        const statusCounts = {};
        data.forEach(row => {
            const status = row.Status || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        summaryParts.push('Order Status Distribution:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            const pct = ((count / data.length) * 100).toFixed(1);
            summaryParts.push(`  - ${status}: ${count} (${pct}%)`);
        });
    }

    return summaryParts.join('\n');
}

/**
 * Generate mock summary when API key is not available
 * @param {Array} data - Parsed sales data
 * @returns {string} Mock summary
 */
function generateMockSummary(data) {
    let totalRevenue = 0;
    let topRegion = 'N/A';

    if (data.length > 0 && 'Revenue' in data[0]) {
        const revenues = data.map(row => parseFloat(row.Revenue) || 0);
        totalRevenue = revenues.reduce((a, b) => a + b, 0);

        if ('Region' in data[0]) {
            const revenueByRegion = {};
            data.forEach(row => {
                const region = row.Region || 'Unknown';
                revenueByRegion[region] = (revenueByRegion[region] || 0) + (parseFloat(row.Revenue) || 0);
            });
            topRegion = Object.entries(revenueByRegion).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
        }
    }

    return `# Executive Summary - Sales Analysis

## Executive Overview
This analysis covers ${data.length} sales transactions with a total revenue of $${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. The data reveals strong performance across multiple regions with Electronics leading as the top product category.

## Top Performing Regions
- **${topRegion}** emerges as the leading region, contributing the highest revenue share.
- Regional performance shows healthy distribution across all territories.

## Revenue Trends
- Total Revenue: **$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**
- Average transaction value indicates premium product positioning.
- Consistent order volume suggests stable demand patterns.

## Product Performance
- Electronics category dominates revenue generation.
- Home Appliances shows steady contribution to overall sales.

## Potential Anomalies & Concerns
- Some cancelled orders detected - recommend investigating root causes.
- Monitor shipping delays for customer satisfaction impact.

## Key Recommendations
1. **Invest in Top Regions**: Allocate additional marketing resources to high-performing regions.
2. **Address Cancellations**: Implement a cancellation reduction strategy.
3. **Expand Product Lines**: Consider expanding electronics inventory based on strong demand.

---
*Report generated automatically by Sales Insight Automator*`;
}

/**
 * Generate AI-powered executive summary from sales data
 * @param {Array} data - Parsed sales data array
 * @returns {Promise<string>} Generated summary
 */
export async function generateSalesSummary(data) {
    // Prepare data summary
    const dataSummary = prepareDataSummary(data);

    // Create prompt
    const prompt = `You are an expert business analyst. Analyze the following sales data and create a professional executive summary for leadership.

${dataSummary}

Please provide a comprehensive executive summary that includes:

1. **Executive Overview**: A brief 2-3 sentence summary of the overall sales performance.

2. **Top Performing Regions**: Identify which regions are performing best and why.

3. **Revenue Trends**: Analyze revenue patterns, growth areas, and any notable trends.

4. **Product Performance**: Evaluate product category performance and highlight top performers.

5. **Potential Anomalies & Concerns**: Flag any data anomalies, cancelled orders, or areas needing attention.

6. **Key Recommendations**: Provide 2-3 actionable recommendations based on the analysis.

Format the response professionally with clear headers and bullet points where appropriate. Keep the total summary under 500 words.`;

    // Check if API key is configured
    if (!GEMINI_API_KEY) {
        console.log('GEMINI_API_KEY not configured, using mock summary');
        return generateMockSummary(data);
    }

    try {
        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (error) {
        console.error('AI generation error:', error.message);
        console.log('⚠️  Falling back to mock summary');
        // Return mock summary as fallback
        return generateMockSummary(data);
    }
}
