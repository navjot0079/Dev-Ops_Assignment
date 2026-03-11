import ReactMarkdown from 'react-markdown';

function SummaryDisplay({ summary }) {
    if (!summary) return null;

    return (
        <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-6 py-4 border-b border-white/10">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <span>📋</span>
                    Generated Summary
                </h3>
                <p className="text-purple-200 text-sm mt-1">
                    AI-powered executive insights
                </p>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[500px] overflow-y-auto">
                <div className="markdown-content">
                    <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex justify-between items-center">
                <span className="text-purple-300 text-xs">
                    Generated at {new Date().toLocaleTimeString()}
                </span>
                <button
                    onClick={() => navigator.clipboard.writeText(summary)}
                    className="text-purple-300 text-xs hover:text-white transition-colors flex items-center gap-1"
                >
                    📋 Copy to clipboard
                </button>
            </div>
        </div>
    );
}

export default SummaryDisplay;
