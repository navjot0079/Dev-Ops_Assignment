# 📊 Sales Insight Automator

A secure, AI-powered application that transforms raw sales data into professional executive summaries delivered directly to your inbox.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🎯 Overview

Sales Insight Automator helps sales teams quickly generate AI-powered insights from their data. Simply upload a CSV or Excel file, enter an email address, and receive a professionally formatted executive summary.

### Key Features

- **📤 Easy File Upload**: Drag-and-drop CSV/XLSX files (up to 10MB)
- **🤖 AI-Powered Analysis**: Google Gemini generates comprehensive insights
- **📧 Direct Delivery**: Professional reports sent to your inbox
- **🔒 Secure Processing**: Rate limiting, input validation, and safe file handling
- **📚 API Documentation**: Full Swagger/OpenAPI documentation

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API    │────▶│  Google Gemini  │
│  (Vite + TW)    │     │  (Node.js)      │     │  (AI)           │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Email Service  │
                        │  (Nodemailer)   │
                        │                 │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- SMTP credentials (Gmail, SendGrid, etc.)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd sales-insight-automator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

1. **Backend Environment**

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=your_email@gmail.com
```

2. **Frontend Environment**

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### Running Locally

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Detailed health status |
| `POST` | `/api/upload-sales-data` | Upload and validate file |
| `POST` | `/api/generate-summary` | Generate AI summary |
| `POST` | `/api/send-report` | Send email report |
| `POST` | `/api/process-and-send` | Complete workflow |

### Example: Complete Workflow

```bash
curl -X POST http://localhost:8000/api/process-and-send \
  -F "file=@sales_data.csv" \
  -F "recipient_email=user@example.com"
```

## 🔒 Security Features

### 1. Rate Limiting
- **10 requests/minute** for data processing endpoints
- **5 requests/minute** for email sending
- Prevents abuse and resource exhaustion

### 2. File Validation
- **File type validation**: Only CSV, XLS, XLSX allowed
- **File size limit**: Maximum 10MB
- **Row limit**: Maximum 100,000 rows
- **MIME type checking**: Validates actual file content

### 3. Input Sanitization
- Email address validation and sanitization
- XSS prevention in summary content
- SQL injection protection

### 4. Security Headers
- Helmet.js middleware for HTTP security headers
- CORS configured for specific origins
- Content Security Policy enforcement

### 5. Safe File Handling
- Files processed in memory (no disk storage)
- Temporary data cleared after processing
- No file persistence

## 📁 Project Structure

```
sales-insight-automator/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── index.js            # Express server entry
│   │   ├── routes/
│   │   │   ├── upload.js       # File upload routes
│   │   │   ├── summary.js      # AI summary routes
│   │   │   ├── email.js        # Email routes
│   │   │   └── process.js      # Complete workflow
│   │   ├── services/
│   │   │   ├── fileService.js  # File parsing
│   │   │   ├── aiService.js    # Gemini integration
│   │   │   └── emailService.js # Nodemailer
│   │   └── utils/
│   │       └── validators.js   # Input validation
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── FileUploader.jsx
│   │   │   ├── EmailInput.jsx
│   │   │   ├── ProcessButton.jsx
│   │   │   ├── StatusDisplay.jsx
│   │   │   └── SummaryDisplay.jsx
│   │   └── services/
│   │       └── api.js
│   ├── .env.example
│   └── package.json
├── sample_data/
│   └── sales_data.csv          # Test data
└── README.md
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow runs on:
- Push to `main` branch
- Pull requests to `main` branch

### Pipeline Steps:

1. **Backend CI**
   - Install dependencies
   - Run ESLint
   - Run tests
   - Build validation

2. **Frontend CI**
   - Install dependencies
   - Run ESLint
   - Build production bundle
   - Upload artifacts

3. **Integration Check**
   - Verify both services work together

## 🌐 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

**Vercel Configuration:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=<your-backend-url>/api`

### Backend (Render/Railway)

**Render Configuration:**
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: Set all from `.env.example`

## 📋 Environment Variables

### Backend `.env.example`

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Backend URL (for Swagger docs)
BACKEND_URL=http://localhost:8000

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=your_email@gmail.com
```

### Frontend `.env.example`

```env
VITE_API_URL=http://localhost:8000/api
```

## 🧪 Testing

### Sample Data

Use the provided test dataset in `sample_data/sales_data.csv`:

```csv
Date,Product_Category,Region,Units_Sold,Unit_Price,Revenue,Status
2026-01-05,Electronics,North,150,1200,180000,Shipped
2026-01-12,Home Appliances,South,45,450,20250,Shipped
2026-01-20,Electronics,East,80,1100,88000,Delivered
2026-02-15,Electronics,North,210,1250,262500,Delivered
2026-02-28,Home Appliances,North,60,400,24000,Cancelled
2026-03-10,Electronics,West,95,1150,109250,Shipped
```

## 📝 AI Summary Output

The AI generates insights including:

1. **Executive Overview**: High-level performance summary
2. **Top Performing Regions**: Regional analysis
3. **Revenue Trends**: Growth patterns and trends
4. **Product Performance**: Category analysis
5. **Anomalies & Concerns**: Issues to address
6. **Recommendations**: Actionable next steps

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Google Gemini 1.5 Flash |
| Email | Nodemailer (SMTP) |
| Validation | express-validator |
| Security | Helmet, express-rate-limit |
| Documentation | Swagger/OpenAPI |
| CI/CD | GitHub Actions |

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

---

Built with ❤️ by Rabbitt AI
