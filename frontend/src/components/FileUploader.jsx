import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUploader({ onFileSelect, file, disabled, uploadInfo }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        disabled
    });

    const getBorderColor = () => {
        if (isDragReject) return 'border-red-400';
        if (isDragActive) return 'border-purple-400';
        if (file) return 'border-green-400';
        return 'border-white/30';
    };

    const getBackgroundColor = () => {
        if (isDragReject) return 'bg-red-500/10';
        if (isDragActive) return 'bg-purple-500/20';
        if (file) return 'bg-green-500/10';
        return 'bg-white/5';
    };

    return (
        <div>
            <label className="block text-white font-medium mb-2">
                📁 Upload Sales Data
            </label>

            <div
                {...getRootProps()}
                className={`
          relative rounded-xl border-2 border-dashed p-8 text-center
          transition-all duration-200 cursor-pointer
          ${getBorderColor()} ${getBackgroundColor()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:bg-purple-500/10'}
        `}
            >
                <input {...getInputProps()} />

                {file ? (
                    <div className="space-y-2">
                        <div className="text-4xl">✅</div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-purple-300 text-sm">
                            {(file.size / 1024).toFixed(1)} KB
                        </p>
                        {uploadInfo && (
                            <div className="mt-3 p-3 bg-white/10 rounded-lg">
                                <p className="text-green-300 text-sm font-medium">
                                    ✓ {uploadInfo.rows_count} rows • {uploadInfo.columns.length} columns
                                </p>
                                <p className="text-purple-200 text-xs mt-1">
                                    Columns: {uploadInfo.columns.slice(0, 5).join(', ')}
                                    {uploadInfo.columns.length > 5 && '...'}
                                </p>
                            </div>
                        )}
                        <p className="text-purple-400 text-xs mt-2">
                            Click or drag to replace
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="text-5xl">
                            {isDragActive ? '📥' : '📊'}
                        </div>
                        <div>
                            <p className="text-white font-medium">
                                {isDragActive
                                    ? 'Drop your file here...'
                                    : 'Drag & drop your sales data file'}
                            </p>
                            <p className="text-purple-300 text-sm mt-1">
                                or click to browse
                            </p>
                        </div>
                        <p className="text-purple-400 text-xs">
                            Supported: CSV, XLS, XLSX • Max 10MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileUploader;
