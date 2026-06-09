import { ShieldCheck, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { useProductReport } from '../hooks/useProductReport';

const NEXT_STEPS = [
  'Your report will be reviewed by our team within 24-48 hours',
  'Verified reports are forwarded to FDA Philippines and relevant authorities',
  'You will receive email updates on the status of your report',
  'Authorities may contact you if additional information is needed',
];

export default function Report() {
  const {
    formData,
    errors,
    isSubmitted,
    isSubmitting,
    selectedFiles,
    submitError,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit,
  } = useProductReport();

  if (isSubmitted) {
    return (
      <section className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-3xl text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Report Submitted Successfully</h1>
              <p style={{ color: 'var(--muted)' }}>Thank you for helping protect consumers by reporting this product.</p>
              <p style={{ color: 'var(--muted)' }}>Your report has been submitted and will be reviewed by our team.</p>
            </div>

            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--fg)' }}>What Happens Next?</h2>
              <ol className="space-y-3" style={{ color: 'var(--fg)' }}>
                {NEXT_STEPS.map((message, index) => (
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
    <section className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }} role="main" aria-label="Product Report Form">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="text-center mb-8" role="banner">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <ShieldCheck className="text-2xl text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Report a Product</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Help protect consumers by reporting suspicious, counterfeit, or non-compliant products.
          </p>
        </header>

        {/* Alert Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start" role="alert" aria-labelledby="alert-heading">
          <AlertTriangle className="text-yellow-600 text-lg mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
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
            <AlertTriangle className="text-red-600 text-lg mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 id="error-heading" className="sr-only">Submission Error</h2>
              <p className="text-red-800">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" role="form" aria-label="Product Report Form">
          {/* Product Information Section */}
          <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Product Information</h2>
              <p style={{ color: 'var(--muted)' }}>Provide details about the product you want to report.</p>
            </div>

            <div className="space-y-6">
              <FieldInput
                id="productName"
                label="Product Name"
                required
                value={formData.productName}
                error={errors.productName}
                onChange={handleInputChange}
                placeholder="Enter the product name"
              />

              <FieldInput
                id="brandName"
                label="Brand Name"
                required
                value={formData.brandName}
                error={errors.brandName}
                onChange={handleInputChange}
                placeholder="Enter the brand name"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldInput
                  id="storeName"
                  label="Store Name"
                  value={formData.storeName}
                  error={errors.storeName}
                  onChange={handleInputChange}
                  placeholder="Where did you find this product?"
                />

                <FieldInput
                  id="location"
                  label="Location"
                  value={formData.location}
                  error={errors.location}
                  onChange={handleInputChange}
                  placeholder="City/Province, Country"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
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
                  style={{ backgroundColor: 'var(--bg)', borderColor: errors.description ? '#ef4444' : 'var(--border)', color: 'var(--fg)' }}
                  minLength={50}
                />
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  Minimum 50 characters. {formData.description.length > 0 && `${formData.description.length}/50`}
                </p>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Report Details Section */}
          <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} role="region" aria-labelledby="report-details-heading">
            <div className="mb-6">
              <h2 id="report-details-heading" className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Report Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="supportingEvidence" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
                  Supporting Evidence (Optional)
                </label>

                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
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
                  <Upload className="text-3xl mx-auto mb-3" style={{ color: 'var(--muted)' }} aria-hidden="true" />
                  <p className="mb-1" style={{ color: 'var(--fg)' }}>Upload photos or documents</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Product photos, receipts, packaging, or other evidence (Max 10MB each)</p>
                  <div className="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--muted)', color: 'var(--bg)' }}>
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

                {selectedFiles.length > 0 && (
                  <div className="mt-4" role="region" aria-label="Selected files">
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
                      Selected Files ({selectedFiles.length}):
                    </p>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--fg)' }}>
                          <div className="flex items-center">
                            <Upload className="text-sm mr-2 text-black" aria-hidden="true" />
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
          <div className="rounded-xl shadow-md p-8" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} role="region" aria-labelledby="contact-info-heading">
            <div className="mb-6">
              <h2 id="contact-info-heading" className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Your Contact Information</h2>
              <p style={{ color: 'var(--muted)' }}>We may need to contact you for additional information.</p>
            </div>

            <div className="space-y-6">
              <FieldInput
                id="fullName"
                label="Full Name"
                required
                value={formData.fullName}
                error={errors.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldInput
                  id="email"
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  error={errors.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />

                <FieldInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  required
                  value={formData.phone}
                  error={errors.phone}
                  onChange={handleInputChange}
                  placeholder="09XXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--fg)', color: 'var(--bg)' }}
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

// ---------------------------------------------------------------------------
// Extracted field component to reduce repetition
// ---------------------------------------------------------------------------

function FieldInput({
  id,
  label,
  type = 'text',
  required = false,
  value,
  error,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : ''}`}
        style={{ backgroundColor: 'var(--bg)', borderColor: error ? '#ef4444' : 'var(--border)', color: 'var(--fg)' }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
