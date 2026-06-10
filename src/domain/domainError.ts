/**
 * DomainError
 *
 * Structured error type used across all domain modules and adapters.
 * Every adapter throws DomainError instead of plain Error, giving callers
 * a programmatic way to distinguish transient from permanent failures
 * without string matching.
 *
 * @module domainError
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Error classification.
 *
 * - `transient`: Network timeout, rate limit, server error. Safe to retry.
 * - `permanent`: Bad input, validation failure, auth error. Should not retry.
 * - `not_found`: Resource does not exist. Should show "not found" UI.
 */
export type ErrorKind = 'transient' | 'permanent' | 'not_found';

// ---------------------------------------------------------------------------
// DomainError
// ---------------------------------------------------------------------------

export class DomainError extends Error {
  /** Structured error classification */
  readonly kind: ErrorKind;

  /** Optional structured context for debugging / logging */
  readonly context?: Record<string, unknown>;

  constructor(
    kind: ErrorKind,
    message: string,
    options?: { context?: Record<string, unknown>; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = 'DomainError';
    this.kind = kind;
    this.context = options?.context;
  }
}
