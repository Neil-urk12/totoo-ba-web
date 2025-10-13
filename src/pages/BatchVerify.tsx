import { useState } from 'react';
import { FaArrowUp, FaFileDownload, FaFileCsv, FaFileExcel } from 'react-icons/fa';

export default function BatchVerify() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleVerifyProducts = () => {
        console.log('Verifying products:', selectedFile);
    };

    const handleDownloadTemplate = () => {
        console.log('Downloading template');
    };

    return (
        <section className="min-h-screen">
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        Batch Product Verification
                    </h1>
                    <p className="text-lg text-muted">
                        Upload a CSV or Excel file to verify multiple products at once. Perfect for businesses and retailers.
                    </p>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <section className="lg:col-span-2">
                        <section className="rounded-lg p-6 bg-card border border-app">
                            <h2 className="text-xl font-semibold mb-6">Upload File</h2>

                            {/* File Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : selectedFile
                                        ? 'border-green-400 bg-green-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <FaArrowUp className="text-4xl mx-auto mb-4" style={{ color: "var(--muted)" }} />
                                <p className="text-lg text-muted mb-4">
                                    Drag and drop your file here, or click to browse
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer btn-invert"
                                >
                                    Choose File
                                </label>

                                {selectedFile && (
                                    <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                                        <p className="text-green-800 font-medium">
                                            Selected: {selectedFile.name}
                                        </p>
                                        <p className="text-green-600 text-sm">
                                            Size: {(selectedFile.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleVerifyProducts}
                                    disabled={!selectedFile}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${selectedFile
                                        ? 'btn-invert'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Verify Products
                                </button>
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center gap-2 py-3 px-6 border rounded-lg font-medium transition-colors border-app"
                                >
                                    <FaFileDownload className="text-sm" />
                                    Download Template
                                </button>
                            </div>
                        </section>
                    </section>

                    {/* Sidebar */}
                    <section className="space-y-6">
                        <section className="rounded-lg p-6 bg-card border border-app">
                            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                            <ol className="space-y-3 text-muted">
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 text-sm font-medium rounded-full flex items-center justify-center btn-invert">1</span>
                                    <span>Download the CSV template</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 text-sm font-medium rounded-full flex items-center justify-center btn-invert">2</span>
                                    <span>Fill in your product information</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 text-sm font-medium rounded-full flex items-center justify-center btn-invert">3</span>
                                    <span>Upload the completed file</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 text-sm font-medium rounded-full flex items-center justify-center btn-invert">4</span>
                                    <span>Review verification results</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 text-sm font-medium rounded-full flex items-center justify-center btn-invert">5</span>
                                    <span>Export results for your records</span>
                                </li>
                            </ol>
                        </section>

                        <section className="rounded-lg p-6 bg-card border border-app">
                            <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-muted">
                                    <FaFileCsv className="text-green-600 text-lg" />
                                    <span>CSV (.csv)</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted">
                                    <FaFileExcel className="text-green-600 text-lg" />
                                    <span>Excel (.xlsx, .xls)</span>
                                </div>
                                <div className="pt-3 border-t border-app">
                                    <p className="text-sm text-muted">
                                        Maximum 1000 products per file
                                    </p>
                                </div>
                            </div>
                        </section>
                    </section>
                </section>
            </main>
        </section>
    );
}
