import { useState } from 'react';

function EmailInput({ email, onChange, disabled }) {
    const [isFocused, setIsFocused] = useState(false);

    const isValidEmail = (email) => {
        if (!email) return true; // Don't show error for empty
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const showError = email && !isValidEmail(email);

    return (
        <div>
            <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
            >
                📧 Recipient Email
            </label>

            <div className="relative">
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    placeholder="Enter email address for the report"
                    className={`
            w-full px-4 py-3 rounded-xl
            bg-white/10 backdrop-blur
            border-2 transition-all duration-200
            text-white placeholder-purple-300/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${showError
                            ? 'border-red-400 focus:border-red-400'
                            : isFocused
                                ? 'border-purple-400'
                                : 'border-white/20'}
            focus:outline-none focus:ring-2 focus:ring-purple-400/30
          `}
                />

                {email && isValidEmail(email) && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                        ✓
                    </span>
                )}
            </div>

            {showError && (
                <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                    <span>⚠️</span>
                    Please enter a valid email address
                </p>
            )}

            <p className="mt-2 text-purple-300 text-xs">
                The AI-generated report will be sent to this email
            </p>
        </div>
    );
}

export default EmailInput;
