import { useState, useEffect } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaUpload, FaCheckCircle } from 'react-icons/fa';
import { initEmailJS, sendEmailWithAttachments } from '../config/emailjs';

interface FormData {
    productName: string;
    manufacturer: string;
    issueType: string;
    description: string;
    supportingEvidence: FileList | null;
    fullName: string;
    email: string;
    phone: string;
}

interface FormErrors {
    productName?: string;
    issueType?: string;
    manufacturer?: string;
    description?: string;
    fullName?: string;
    email?: string;
    phone?: string;
}

const issueTypes = [
    'Counterfeit Product',
    'Unregistered Product',
    'Expired Product',
    'Misleading Labeling',
    'Adverse Reaction',
    'Quality Issue',
    'Other'
];

const reportMessageSuccessfully = [
    "Your report will be reviewed by our team within 24-48 hours",
    "Verified reports are forwarded to FDA Philippines and relevant authorities",
    "You will receive email updates on the status of your report",
    "Authorities may contact you if additional information is needed"
];

// FDA Email channels based on issue type
const getEmailChannel = (issueType: string): { email: string; description: string } => {
    switch (issueType) {
        case 'Counterfeit Product':
            return {
                email: 'ncwacm@fda.gov.ph',
                description: 'Counterfeit medicines reporting'
            };
        case 'Unregistered Product':
            return {
                email: 'info@fda.gov.ph',
                description: 'Unregistered health products reporting'
            };
        default:
            return {
                email: 'ereport@fda.gov.ph',
                description: 'General product reporting'
            };
    }
};

export default function Report() {
    const [formData, setFormData] = useState<FormData>({
        productName: '',
        manufacturer: '',
        issueType: '',
        description: '',
        supportingEvidence: null,
        fullName: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [submitError, setSubmitError] = useState<string>('');

    // Initialize EmailJS when component mounts
    useEffect(() => {
        initEmailJS();
    }, []);


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        }

        if (!formData.manufacturer.trim()) {
            newErrors.manufacturer = 'Manufacturer is required';
        }

        if (!formData.issueType) {
            newErrors.issueType = 'Please select an issue type';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^(\+63|0)[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);
            setFormData(prev => ({
                ...prev,
                supportingEvidence: files
            }));
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);

        const fileImage = new DataTransfer();
        newFiles.forEach(file => fileImage.items.add(file));
        setFormData(prev => ({
            ...prev,
            supportingEvidence: fileImage.files
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Get the appropriate email channel based on issue type
            const emailChannel = getEmailChannel(formData.issueType);

            // Prepare email template parameters
            const templateParams = {
                to_email: emailChannel.email,
                to_name: 'FDA Philippines',
                from_name: formData.fullName,
                from_email: formData.email,
                phone: formData.phone,
                product_name: formData.productName,
                manufacturer: formData.manufacturer,
                issue_type: formData.issueType,
                description: formData.description,
                email_channel_description: emailChannel.description,
                submitted_at: new Date().toLocaleString('en-PH', {
                    timeZone: 'Asia/Manila',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                report_id: `RPT-${Date.now()}`,
                // Additional context for the email
                subject: `Product Report: ${formData.issueType} - ${formData.productName}`,
                priority: formData.issueType === 'Adverse Reaction' ? 'HIGH' : 'NORMAL'
            };

            console.log('Sending email with parameters:', templateParams);

            // Send email with attachments if any
            const result = selectedFiles.length > 0
                ? await sendEmailWithAttachments(templateParams, selectedFiles)
                : await sendEmailWithAttachments(templateParams, []);

            if (result.success) {
                console.log('Email sent successfully:', result.response);
                setIsSubmitted(true);
            } else {
                console.error('Failed to send email:', result.error);
                setSubmitError('Failed to send report. Please try again or contact support.');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
                <main className="max-w-2xl mx-auto px-4 py-12">
                    <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="text-3xl text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--fg)" }}>Report Submitted Successfully</h1>
                            <p style={{ color: "var(--muted)" }}>Thank you for helping protect consumers by reporting this product. Your report has been sent via email.</p>

                            {/* Show which email channel was used */}
                            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                                <div className="flex items-center justify-center">
                                    <FaShieldAlt className="text-blue-600 text-sm mr-2" />
                                    <span className="text-sm">
                                        Report sent to: <span className="font-mono">{getEmailChannel(formData.issueType).email}</span>
                                    </span>
                                </div>
                                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                                    {getEmailChannel(formData.issueType).description}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg p-6" style={{ backgroundColor: "var(--bg)" }}>
                            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--fg)" }}>What Happens Next?</h2>
                            <ol className="space-y-3" style={{ color: "var(--fg)" }}>
                                {reportMessageSuccessfully.map((message, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">{index + 1}</span>
                                        <span>{message}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </main>
            </section>
        );
    }

    return (
        <section className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }} role="main" aria-label="Product Report Form">
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Header Section */}
                <header className="text-center mb-8" role="banner">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                        <FaShieldAlt className="text-2xl text-amber-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--fg)" }}>Report a Product</h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
                        Help protect consumers by reporting suspicious, counterfeit, or non-compliant products.
                    </p>
                </header>

                {/* Alert Box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start" role="alert" aria-labelledby="alert-heading">
                    <FaExclamationTriangle className="text-yellow-600 text-lg mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                        <h2 id="alert-heading" className="sr-only">Important Notice</h2>
                        <p className="text-yellow-800">
                            Your report will be forwarded to FDA Philippines and relevant authorities. All information provided will be kept confidential and used solely for investigation purposes.
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start" role="alert" aria-labelledby="error-heading">
                        <FaExclamationTriangle className="text-red-600 text-lg mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div>
                            <h2 id="error-heading" className="sr-only">Submission Error</h2>
                            <p className="text-red-800">{submitError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8" role="form" aria-label="Product Report Form">
                    {/* Product Information Section */}
                    <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--fg)" }}>Product Information</h2>
                            <p style={{ color: "var(--muted)" }}>Provide details about the product you want to report.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    placeholder="Enter the product name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.productName ? 'border-red-500' : ''}`}
                                    style={{ backgroundColor: "var(--bg)", borderColor: errors.productName ? '#ef4444' : "var(--border)", color: "var(--fg)" }}
                                />
                                {errors.productName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="manufacturer" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                    Manufacturer/Brand <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="manufacturer"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleInputChange}
                                    placeholder="Enter the manufacturer or brand name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.manufacturer ? 'border-red-500' : ''}`}
                                    style={{
                                        backgroundColor: "var(--bg)",
                                        borderColor: errors.manufacturer ? "#ef4444" : "var(--border)",
                                        color: "var(--fg)"
                                    }}
                                />
                                {errors.manufacturer && (
                                    <p className="text-red-500 text-sm mt-1">{errors.manufacturer}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="issueType" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                    Type of Issue <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="issueType"
                                    name="issueType"
                                    value={formData.issueType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.issueType ? 'border-red-500' : ''}`}
                                    style={{ backgroundColor: "var(--bg)", borderColor: errors.issueType ? '#ef4444' : "var(--border)", color: "var(--fg)" }}
                                    aria-invalid={!!errors.issueType}
                                    aria-describedby={errors.issueType ? "issueType-error" : undefined}
                                >
                                    <option value="">Select an issue type</option>
                                    {issueTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.issueType && (
                                    <p id="issueType-error" className="text-red-500 text-sm mt-1">{errors.issueType}</p>
                                )}

                                {/* Email Channel Information */}
                                {formData.issueType && (
                                    <div className="mt-3 p-3 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                                        <div className="flex items-start">
                                            <FaShieldAlt className="text-blue-600 text-sm mr-2 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                                                    Report will be sent to:
                                                </p>
                                                <p className="text-sm font-mono" style={{ color: "var(--fg)" }}>
                                                    {getEmailChannel(formData.issueType).email}
                                                </p>
                                                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                                                    {getEmailChannel(formData.issueType).description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Provide detailed information about the issue, including where you purchased the product, any adverse effects, or other relevant details..."
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : ''}`}
                                    style={{ backgroundColor: "var(--bg)", borderColor: errors.description ? '#ef4444' : "var(--border)", color: "var(--fg)" }}
                                    minLength={50}
                                />
                                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                                    Minimum 50 characters. {formData.description.length > 0 && `${formData.description.length}/50`}
                                </p>
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Report Details Section */}
                    <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} role="region" aria-labelledby="report-details-heading">
                        <div className="mb-6">
                            <h2 id="report-details-heading" className="text-2xl font-bold mb-2" style={{ color: "var(--fg)" }}>Report Details</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="supportingEvidence" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                    Supporting Evidence (Optional)
                                </label>

                                {/* File Upload Area */}
                                <div
                                    className="border-2 border-dashed rounded-lg p-6 text-center hover:opacity-80 transition-opacity cursor-pointer"
                                    style={{ borderColor: "var(--border)" }}
                                    onClick={() => document.getElementById('supportingEvidence')?.click()}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            document.getElementById('supportingEvidence')?.click();
                                        }
                                    }}
                                    aria-label="Upload supporting evidence files"
                                >
                                    <FaUpload className="text-3xl mx-auto mb-3" style={{ color: "var(--muted)" }} aria-hidden="true" />
                                    <p className="mb-1" style={{ color: "var(--fg)" }}>Upload photos or documents</p>
                                    <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Product photos, receipts, packaging, or other evidence (Max 10MB each)</p>
                                    <div className="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
                                        style={{ backgroundColor: "var(--muted)", color: "var(--bg)" }}>
                                        Choose Files
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    id="supportingEvidence"
                                    name="supportingEvidence"
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*,.pdf,.doc,.docx"
                                    className="hidden"
                                    aria-label="Supporting evidence files"
                                />

                                {/* Selected Files Display */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4" role="region" aria-label="Selected files">
                                        <p className="text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                            Selected Files ({selectedFiles.length}):
                                        </p>
                                        <div className="space-y-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--muted)", color: "var(--fg)" }}>
                                                    <div className="flex items-center">
                                                        <FaUpload className="text-sm mr-2 text-black" aria-hidden="true" />
                                                        <span className="text-sm text-black">
                                                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(index);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                        aria-label={`Remove file ${file.name}`}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} role="region" aria-labelledby="contact-info-heading">
                        <div className="mb-6">
                            <h2 id="contact-info-heading" className="text-2xl font-bold mb-2" style={{ color: "var(--fg)" }}>Your Contact Information</h2>
                            <p style={{ color: "var(--muted)" }}>We may need to contact you for additional information.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : ''}`}
                                    style={{ backgroundColor: "var(--bg)", borderColor: errors.fullName ? '#ef4444' : "var(--border)", color: "var(--fg)" }}
                                    aria-invalid={!!errors.fullName}
                                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                                />
                                {errors.fullName && (
                                    <p id="fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                                        style={{ backgroundColor: "var(--bg)", borderColor: errors.email ? '#ef4444' : "var(--border)", color: "var(--fg)" }}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                    {errors.email && (
                                        <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="09XXXXXXXX"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : ''}`}
                                        style={{ backgroundColor: "var(--bg)", borderColor: errors.phone ? '#ef4444' : "var(--border)", color: "var(--fg)" }}
                                        aria-invalid={!!errors.phone}
                                        aria-describedby={errors.phone ? "phone-error" : undefined}
                                    />
                                    {errors.phone && (
                                        <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}
                            aria-label={isSubmitting ? 'Submitting report' : 'Submit report'}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </main>
        </section>
    );
}
