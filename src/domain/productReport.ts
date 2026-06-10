/**
 * ProductReport Domain Module
 *
 * Owns field rules, validation logic, validation result shape, and the
 * submission orchestration for consumer product reports. The UI and
 * query layers depend on this module — never the reverse.
 *
 * Two seams sit behind it:
 * - Reporter: persists the report row
 * - EvidenceUploader: attaches supporting evidence files (future — not yet implemented)
 *
 * @module productReport
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ReportFieldName =
  | 'productName'
  | 'brandName'
  | 'description'
  | 'storeName'
  | 'location'
  | 'fullName'
  | 'email'
  | 'phone';

export type ReportFieldErrors = Partial<Record<ReportFieldName, string>>;

export type ReportInput = {
  productName: string;
  brandName: string;
  description: string;
  storeName: string;
  location: string;
  fullName: string;
  email: string;
  phone: string;
};

export type ReportSubmissionData = {
  product_name: string;
  brand_name: string;
  registration_number: string | null;
  description: string;
  reporter_name: string;
  location: string;
  store_name: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ReportFieldErrors;
};

export type SubmitResult = ValidationResult;

// ---------------------------------------------------------------------------
// Adapter interfaces
// ---------------------------------------------------------------------------

export interface Reporter {
  submitReport(data: ReportSubmissionData): Promise<{ id: string }>;
}

export interface EvidenceUploader {
  uploadFiles(reportId: string, files: File[]): Promise<void>;
}

// ---------------------------------------------------------------------------
// Field rules — single source of truth for validation
// ---------------------------------------------------------------------------

type FieldRule = {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  patternError?: string;
  label: string;
};

export const FIELD_RULES: Record<ReportFieldName, FieldRule> = {
  productName: { required: true, label: 'Product Name' },
  brandName: { required: true, label: 'Brand Name' },
  description: { required: true, minLength: 50, label: 'Description' },
  storeName: { required: true, label: 'Store Name' },
  location: { required: true, label: 'Location' },
  fullName: { required: true, label: 'Full Name' },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternError: 'Please enter a valid email address',
    label: 'Email Address',
  },
  phone: {
    required: true,
    pattern: /^(\+63|0)[0-9]{10}$/,
    patternError: 'Please enter a valid phone number',
    label: 'Phone Number',
  },
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function getFieldValue(input: ReportInput, name: ReportFieldName): string {
  return input[name] ?? '';
}

export function validateReport(input: ReportInput): ValidationResult {
  const errors: ReportFieldErrors = {};

  for (const [name, rule] of Object.entries(FIELD_RULES) as [ReportFieldName, FieldRule][]) {
    const value = getFieldValue(input, name);

    if (rule.required && !value.trim()) {
      errors[name] = `${rule.label} is required`;
      continue;
    }

    if (rule.minLength && value.trim().length < rule.minLength) {
      errors[name] = `${rule.label} must be at least ${rule.minLength} characters`;
      continue;
    }

    if (rule.pattern && value.trim() && !rule.pattern.test(value.trim())) {
      errors[name] = rule.patternError ?? `Invalid ${rule.label}`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ---------------------------------------------------------------------------
// Submission data mapping
// ---------------------------------------------------------------------------

function toSubmissionData(input: ReportInput): ReportSubmissionData {
  return {
    product_name: input.productName,
    brand_name: input.brandName,
    registration_number: null,
    description: input.description,
    reporter_name: input.fullName || 'Anonymous',
    location: input.location || 'Unknown',
    store_name: input.storeName || 'Unknown',
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createProductReport(reporter: Reporter) {
  return {
    submit: async (input: ReportInput): Promise<SubmitResult> => {
      const validation = validateReport(input);
      if (!validation.valid) return validation;

      await reporter.submitReport(toSubmissionData(input));
      return { valid: true, errors: {} };
    },
  };
}
