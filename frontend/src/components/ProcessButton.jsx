function ProcessButton({ onClick, disabled, loading, label, primary, variant }) {
    const baseClasses = `
    px-8 py-3 rounded-xl font-semibold
    transition-all duration-200
    flex items-center justify-center gap-2
    disabled:cursor-not-allowed
  `;

    const primaryClasses = `
    bg-gradient-to-r from-purple-500 to-pink-500
    text-white shadow-lg shadow-purple-500/30
    hover:from-purple-600 hover:to-pink-600
    hover:shadow-xl hover:shadow-purple-500/40
    disabled:from-gray-500 disabled:to-gray-600
    disabled:shadow-none disabled:opacity-50
  `;

    const secondaryClasses = `
    bg-white/10 backdrop-blur
    text-white border-2 border-white/20
    hover:bg-white/20 hover:border-white/30
    disabled:opacity-50
  `;

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseClasses}
        ${primary ? primaryClasses : secondaryClasses}
        ${variant === 'secondary' ? secondaryClasses : ''}
      `}
        >
            {loading ? (
                <>
                    <LoadingSpinner />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {primary && <span>🚀</span>}
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}

function LoadingSpinner() {
    return (
        <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

export default ProcessButton;
