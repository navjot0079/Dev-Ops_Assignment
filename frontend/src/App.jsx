import { useState } from 'react';
import FileUploader from './components/FileUploader';
import EmailInput from './components/EmailInput';
import ProcessButton from './components/ProcessButton';
import StatusDisplay from './components/StatusDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import { processAndSend, uploadFile, generateSummary, sendReport } from './services/api';
import toast from 'react-hot-toast';

function App() {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, uploading, generating, sending, success, error
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [uploadInfo, setUploadInfo] = useState(null);

    const resetState = () => {
        setFile(null);
        setEmail('');
        setStatus('idle');
        setSummary('');
        setError('');
        setUploadInfo(null);
    };

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setError('');
        setSummary('');
        setUploadInfo(null);

        // Validate file on selection
        try {
            setStatus('uploading');
            const response = await uploadFile(selectedFile);
            setUploadInfo(response);
            setStatus('idle');
            toast.success(`File uploaded: ${response.rows_count} rows detected`);
        } catch (err) {
            setStatus('error');
            setError(err.message);
            toast.error(err.message);
            setFile(null);
        }
    };

    const handleProcess = async () => {
        if (!file || !email) {
            toast.error('Please select a file and enter an email address');
            return;
        }

        setError('');

        try {
            // Step 1: Generate summary
            setStatus('generating');
            toast.loading('Analyzing data with AI...', { id: 'process' });

            const summaryResponse = await generateSummary(file);
            setSummary(summaryResponse.summary);

            // Step 2: Send email
            setStatus('sending');
            toast.loading('Sending report to ' + email + '...', { id: 'process' });

            await sendReport(email, summaryResponse.summary);

            setStatus('success');
            toast.success('Report sent successfully!', { id: 'process' });

        } catch (err) {
            setStatus('error');
            setError(err.message);
            toast.error(err.message, { id: 'process' });
        }
    };

    const handleQuickProcess = async () => {
        if (!file || !email) {
            toast.error('Please select a file and enter an email address');
            return;
        }

        setError('');
        setStatus('generating');

        try {
            toast.loading('Processing your data...', { id: 'process' });

            const response = await processAndSend(file, email);
            setSummary(response.summary);
            setStatus('success');
            toast.success('Report generated and sent!', { id: 'process' });

        } catch (err) {
            setStatus('error');
            setError(err.message);
            toast.error(err.message, { id: 'process' });
        }
    };

    const isProcessing = ['uploading', 'generating', 'sending'].includes(status);
    const canProcess = file && email && !isProcessing;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
            {/* Header */}
            <header className="py-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-4xl">📊</span>
                        <h1 className="text-4xl font-bold text-white">
                            Sales Insight Automator
                        </h1>
                    </div>
                    <p className="text-purple-200 text-lg">
                        Upload your sales data and receive AI-powered insights directly in your inbox
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 pb-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

                    {/* Status Display */}
                    <StatusDisplay status={status} error={error} />

                    {/* File Uploader */}
                    <div className="mb-8">
                        <FileUploader
                            onFileSelect={handleFileSelect}
                            file={file}
                            disabled={isProcessing}
                            uploadInfo={uploadInfo}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-8">
                        <EmailInput
                            email={email}
                            onChange={setEmail}
                            disabled={isProcessing}
                        />
                    </div>

                    {/* Process Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <ProcessButton
                            onClick={handleQuickProcess}
                            disabled={!canProcess}
                            loading={isProcessing}
                            label="Generate & Send Report"
                            primary
                        />
                        {status === 'success' && (
                            <ProcessButton
                                onClick={resetState}
                                label="Process Another File"
                                variant="secondary"
                            />
                        )}
                    </div>

                    {/* Summary Display */}
                    {summary && (
                        <div className="mt-8">
                            <SummaryDisplay summary={summary} />
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon="🔒"
                        title="Secure Processing"
                        description="Your data is processed securely with rate limiting and input validation"
                    />
                    <FeatureCard
                        icon="🤖"
                        title="AI-Powered Analysis"
                        description="Google Gemini analyzes your sales data to extract key insights"
                    />
                    <FeatureCard
                        icon="📧"
                        title="Direct Delivery"
                        description="Professional reports delivered straight to your inbox"
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-purple-300 text-sm">
                <p>Built with ❤️ by Rabbitt AI • Sales Insight Automator v1.0</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 text-center">
            <span className="text-3xl mb-3 block">{icon}</span>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-purple-200 text-sm">{description}</p>
        </div>
    );
}

export default App;
