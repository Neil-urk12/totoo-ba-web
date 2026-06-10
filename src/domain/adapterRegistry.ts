/**
 * Adapter Registry
 *
 * Single wiring point for all domain modules and their concrete adapters.
 * Every query hook and mutation hook imports pre-wired domain functions
 * from this module instead of creating their own instances.
 *
 * To swap adapters (e.g. for testing), replace the adapter imports
 * here or refactor to a factory pattern with overrides.
 *
 * @module adapterRegistry
 */

import { createProductListing } from './productListing';
import { supabaseProductListingAdapter } from './adapters/supabaseProductListing';

import { createProductVerification } from './productVerification';
import { supabaseVerificationAdapter } from './adapters/supabaseVerification';

import { createCommunityReportListing } from './communityReport';
import { supabaseCommunityReportAdapter } from './adapters/supabaseCommunityReportAdapter';

import { createAnalyticsDataAccess } from './analyticsDataAccess';
import { supabaseAnalyticsAdapter } from './adapters/supabaseAnalyticsAdapter';

import { createImageVerification } from './imageVerification';
import { apiImageVerificationAdapter } from './adapters/apiImageVerification';

import { createProductReport } from './productReport';
import { supabaseReporter } from './adapters/supabaseReporter';

// ---------------------------------------------------------------------------
// Singletons — one wiring point for the entire application
// ---------------------------------------------------------------------------

export const productListing = createProductListing(supabaseProductListingAdapter);
export const productVerification = createProductVerification(supabaseVerificationAdapter);
export const communityReportListing = createCommunityReportListing(supabaseCommunityReportAdapter);
export const analyticsDataAccess = createAnalyticsDataAccess(supabaseAnalyticsAdapter);
export const imageVerification = createImageVerification(apiImageVerificationAdapter);
export const productReport = createProductReport(supabaseReporter);
