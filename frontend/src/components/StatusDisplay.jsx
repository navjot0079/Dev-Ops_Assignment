function StatusDisplay({ status, error }) {
    if (status === 'idle' || !status) return null;

    const statusConfig = {
        uploading: {
            icon: '📤',
            message: 'Validating file...',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-400',
            textColor: 'text-blue-200'
        },
        generating: {
            icon: '🤖',
            message: 'AI is analyzing your sales data...',
            bgColor: 'bg-purple-500/20',
            borderColor: 'border-purple-400',
            textColor: 'text-purple-200'
        },
        sending: {
            icon: '📧',
            message: 'Sending report to your inbox...',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-400',
            textColor: 'text-yellow-200'
        },
        success: {
            icon: '✅',
            message: 'Report generated and sent successfully!',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-400',
            textColor: 'text-green-200'
        },
        error: {
            icon: '❌',
            message: error || 'An error occurred',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-400',
            textColor: 'text-red-200'
        }
    };

    const config = statusConfig[status];
    if (!config) return null;

    const isLoading = ['uploading', 'generating', 'sending'].includes(status);

    return (
        <div
            className={`
        mb-6 p-4 rounded-xl border-2
        ${config.bgColor} ${config.borderColor}
        flex items-center gap-3
        transition-all duration-300
      `}
        >
            <span className={`text-2xl ${isLoading ? 'animate-bounce' : ''}`}>
                {config.icon}
            </span>

            <div className="flex-1">
                <p className={`font-medium ${config.textColor}`}>
                    {config.message}
                </p>
            </div>

            {isLoading && (
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            )}
        </div>
    );
}

export default StatusDisplay;
