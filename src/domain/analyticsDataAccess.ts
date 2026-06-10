/**
 * AnalyticsDataAccess Module
 *
 * Owns the data access interface, raw data shapes, pure processing functions,
 * and factory for analytics data. Two seams sit behind it:
 * - AnalyticsAdapter: fetches raw data from any source
 *
 * Adding or changing analytics data sources requires editing exactly one
 * place — the adapter implementation. Processing logic is pure and
 * testable without any database connection.
 *
 * @module analyticsDataAccess
 */

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------

import { CATEGORY_REGISTRY, analyticsLabelForDbType } from './categoryRegistry';

// ---------------------------------------------------------------------------
// Raw data types (what the adapter returns)
// ---------------------------------------------------------------------------

export type AnalyticsRawData = {
  foodCount: number;
  drugCount: number;
  foodExpiringCount: number;
  drugExpiringCount: number;
  foodCompanyNames: string[];
  drugManufacturerNames: string[];
  foodCategoryTypes: (string | null)[];
  drugBrandNames: string[];
  recentFoodProducts: {
    product_name: string | null;
    issuance_date: string | null;
    company_name: string | null;
  }[];
  recentDrugProducts: {
    brand_name: string | null;
    issuance_date: string | null;
    manufacturer: string | null;
  }[];
};

// ---------------------------------------------------------------------------
// Adapter interface
// ---------------------------------------------------------------------------

export interface AnalyticsAdapter {
  fetchRawData(
    today: string,
    expiryThreshold: string,
  ): Promise<AnalyticsRawData>;
}

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export type CategoryTrend = 'up' | 'down' | 'neutral';

export type AnalyticsData = {
  totalProducts: number;
  complianceRate: number;
  activeBusinesses: number;
  expiringSoon: number;
  productsByCategory: {
    name: string;
    count: number;
    trend: CategoryTrend;
  }[];
  recentActivity: {
    type: string;
    product: string;
    time: string;
    status: 'success' | 'warning' | 'error';
  }[];
  topManufacturers: {
    rank: number;
    name: string;
    products: number;
  }[];
};

// ---------------------------------------------------------------------------
// Pure processing functions
// ---------------------------------------------------------------------------

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
  return rtf.format(-Math.floor(diffDays / 365), 'year');
}

export function computeTotalProducts(raw: AnalyticsRawData): number {
  return raw.foodCount + raw.drugCount;
}

export function computeExpiringSoon(raw: AnalyticsRawData): number {
  return raw.foodExpiringCount + raw.drugExpiringCount;
}

export function computeComplianceRate(raw: AnalyticsRawData): number {
  const total = computeTotalProducts(raw);
  const expiring = computeExpiringSoon(raw);
  return total === 0 ? 0 : Math.round(((total - expiring) / total) * 100);
}

export function computeActiveBusinesses(raw: AnalyticsRawData): number {
  return new Set([...raw.foodCompanyNames, ...raw.drugManufacturerNames]).size;
}

export function computeProductsByCategory(
  raw: AnalyticsRawData,
): { name: string; count: number; trend: CategoryTrend }[] {
  const categoryCounts: Record<string, number> = {};

  for (const dbType of raw.foodCategoryTypes) {
    if (!dbType) continue;
    const label = analyticsLabelForDbType(dbType) ?? dbType;
    categoryCounts[label] = (categoryCounts[label] || 0) + 1;
  }

  if (raw.drugBrandNames.length > 0) {
    categoryCounts['Drugs'] =
      (categoryCounts['Drugs'] || 0) + raw.drugBrandNames.length;
  }

  const seenLabels = new Set<string>();
  return CATEGORY_REGISTRY.filter(
    (entry) =>
      !seenLabels.has(entry.analyticsLabel) &&
      (seenLabels.add(entry.analyticsLabel), true),
  )
    .filter((entry) => (categoryCounts[entry.analyticsLabel] || 0) > 0)
    .map((entry) => {
      const count = categoryCounts[entry.analyticsLabel] || 0;
      const trend: CategoryTrend =
        entry.analyticsLabel === 'Medical Devices'
          ? 'down'
          : entry.analyticsLabel === 'Drugs'
            ? 'neutral'
            : 'up';
      return { name: entry.analyticsLabel, count, trend };
    });
}

export function computeTopManufacturers(
  raw: AnalyticsRawData,
): { rank: number; name: string; products: number }[] {
  const manufacturerCounts: Record<string, number> = {};

  for (const name of raw.foodCompanyNames) {
    manufacturerCounts[name] = (manufacturerCounts[name] || 0) + 1;
  }

  for (const name of raw.drugManufacturerNames) {
    manufacturerCounts[name] = (manufacturerCounts[name] || 0) + 1;
  }

  return Object.entries(manufacturerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, products], index) => ({
      rank: index + 1,
      name,
      products,
    }));
}

export function computeRecentActivity(
  raw: AnalyticsRawData,
): {
  type: string;
  product: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}[] {
  const foodActivities = raw.recentFoodProducts.map((product) => ({
    type: 'New Food Product Registration',
    product: product.product_name || 'Unknown Food Product',
    time: product.issuance_date ? formatRelativeTime(product.issuance_date) : 'Recently',
    status: 'success' as const,
  }));

  const drugActivities = raw.recentDrugProducts.map((product) => ({
    type: 'New Drug Registration',
    product: product.brand_name || 'Unknown Drug Product',
    time: product.issuance_date ? formatRelativeTime(product.issuance_date) : 'Recently',
    status: 'success' as const,
  }));

  return [...foodActivities, ...drugActivities].slice(0, 5);
}

// ---------------------------------------------------------------------------
// Orchestrator (pure)
// ---------------------------------------------------------------------------

export function processAnalyticsData(raw: AnalyticsRawData): AnalyticsData {
  return {
    totalProducts: computeTotalProducts(raw),
    complianceRate: computeComplianceRate(raw),
    activeBusinesses: computeActiveBusinesses(raw),
    expiringSoon: computeExpiringSoon(raw),
    productsByCategory: computeProductsByCategory(raw),
    recentActivity: computeRecentActivity(raw),
    topManufacturers: computeTopManufacturers(raw),
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createAnalyticsDataAccess(adapter: AnalyticsAdapter) {
  return {
    getAnalytics: async (): Promise<AnalyticsData> => {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const expiryThreshold = thirtyDaysFromNow.toISOString().split('T')[0];

      const raw = await adapter.fetchRawData(today, expiryThreshold);
      return processAnalyticsData(raw);
    },
  };
}
