/**
 * useProductReport Hook
 *
 * Owns form state, validation, and submission orchestration for
 * the ProductReport domain. The Report.tsx UI delegates all
 * business logic to this hook.
 *
 * @module hooks/useProductReport
 */

import { useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createProductReport } from '../domain/productReport';
import type { ReportInput, ReportFieldErrors, ReportFieldName } from '../domain/productReport';
import { supabaseReporter } from '../domain/adapters/supabaseReporter';

const INITIAL_FORM: ReportInput = {
  productName: '',
  brandName: '',
  description: '',
  storeName: '',
  location: '',
  fullName: '',
  email: '',
  phone: '',
};

export function useProductReport() {
  const queryClient = useQueryClient();
  const report = useMemo(() => createProductReport(supabaseReporter), []);

  const [formData, setFormData] = useState<ReportInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<ReportFieldErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const fieldName = name as ReportFieldName;

      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      if (errors[fieldName]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[fieldName];
          return next;
        });
      }
    },
    [errors],
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError('');

      setIsSubmitting(true);

      try {
        const result = await report.submit(formData);
        if (!result.valid) {
          setErrors(result.errors);
          return;
        }
        setIsSubmitted(true);
        queryClient.invalidateQueries({ queryKey: ['reports'] });
      } catch (err) {
        console.error('Error submitting report:', err);
        setSubmitError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, report, queryClient],
  );

  return {
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
  };
}
