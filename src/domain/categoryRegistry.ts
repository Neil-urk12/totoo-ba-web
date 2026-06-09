/**
 * CategoryRegistry Module
 *
 * Single source of truth for all FDA product category mappings. Owns the
 * canonical list of categories, their display labels, database filter values,
 * target table names, analytics labels, and raw DB type values for grouping.
 *
 * Every consumer — UI dropdowns, query filters, domain table routing,
 * analytics aggregation — imports from this module. Adding or changing a
 * category requires editing exactly one place.
 *
 * @module categoryRegistry
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CategoryEntry = {
  /** What the UI dropdown shows (e.g. "Food Supplement") */
  displayLabel: string;
  /** The source_category value for the unified_products view */
  sourceCategory: 'Food' | 'Drugs';
  /** Which raw DB tables to query for this category */
  targetTables: readonly ('food_products' | 'drug_products')[];
  /** The label used in analytics category bar charts */
  analyticsLabel: string;
  /** Raw type_of_product / brand_name values in the DB that map to this category */
  dbTypeValues: readonly string[];
};

// ---------------------------------------------------------------------------
// Registry — single source of truth
// ---------------------------------------------------------------------------

export const CATEGORY_REGISTRY: readonly CategoryEntry[] = [
  {
    displayLabel: 'Food',
    sourceCategory: 'Food',
    targetTables: ['food_products'],
    analyticsLabel: 'Food Products',
    dbTypeValues: ['Food'],
  },
  {
    displayLabel: 'Food Supplement',
    sourceCategory: 'Food',
    targetTables: ['food_products'],
    analyticsLabel: 'Food Supplements',
    dbTypeValues: ['Food Supplement'],
  },
  {
    displayLabel: 'Cosmetic',
    sourceCategory: 'Food',
    targetTables: ['food_products'],
    analyticsLabel: 'Cosmetics',
    dbTypeValues: ['Cosmetic'],
  },
  {
    displayLabel: 'Medical Device',
    sourceCategory: 'Food',
    targetTables: ['food_products'],
    analyticsLabel: 'Medical Devices',
    dbTypeValues: ['Medical Device'],
  },
  {
    displayLabel: 'Drugs',
    sourceCategory: 'Drugs',
    targetTables: ['drug_products'],
    analyticsLabel: 'Drugs',
    dbTypeValues: [],
  },
  {
    displayLabel: 'Pharmaceutical',
    sourceCategory: 'Drugs',
    targetTables: ['drug_products'],
    analyticsLabel: 'Drugs',
    dbTypeValues: [],
  },
] as const;

// ---------------------------------------------------------------------------
// Sentinel
// ---------------------------------------------------------------------------

/** Sentinel value meaning "don't filter by category" */
export const ALL_CATEGORIES_SENTINEL = 'All Categories';

// ---------------------------------------------------------------------------
// Helpers — pure functions, no framework dependencies
// ---------------------------------------------------------------------------

/** All display labels for use in UI dropdowns */
export const CATEGORY_DISPLAY_LABELS: readonly string[] =
  CATEGORY_REGISTRY.map((c) => c.displayLabel);

/**
 * Find the category entry matching a display label.
 * Returns undefined if not found (including for the "All Categories" sentinel).
 */
export function getCategoryEntry(displayLabel: string): CategoryEntry | undefined {
  return CATEGORY_REGISTRY.find((c) => c.displayLabel === displayLabel);
}

/**
 * Get the source_category filter value for a display label.
 * Returns null for "All Categories" or unknown labels (meaning: don't filter).
 */
export function getSourceCategory(displayLabel: string): 'Food' | 'Drugs' | null {
  if (displayLabel === ALL_CATEGORIES_SENTINEL) return null;
  return getCategoryEntry(displayLabel)?.sourceCategory ?? null;
}

/**
 * Get the target DB table names for a display label.
 * Returns null for "All Categories" or unknown labels (meaning: query all tables).
 */
export function getTargetTables(
  displayLabel: string,
): readonly ('food_products' | 'drug_products')[] | null {
  if (displayLabel === ALL_CATEGORIES_SENTINEL) return null;
  return getCategoryEntry(displayLabel)?.targetTables ?? null;
}

/**
 * Get the analytics label for a display label.
 * Returns null for "All Categories" or unknown labels.
 */
export function getAnalyticsLabel(displayLabel: string): string | null {
  if (displayLabel === ALL_CATEGORIES_SENTINEL) return null;
  return getCategoryEntry(displayLabel)?.analyticsLabel ?? null;
}

/**
 * Get all analytics labels (deduplicated) for use in analytics aggregation.
 */
export function getAllAnalyticsLabels(): readonly string[] {
  const labels = new Set(CATEGORY_REGISTRY.map((c) => c.analyticsLabel));
  return [...labels];
}

/**
 * Map a raw DB type_of_product value to its analytics label.
 * Returns null if no match is found.
 */
export function analyticsLabelForDbType(dbType: string): string | null {
  for (const entry of CATEGORY_REGISTRY) {
    if (entry.dbTypeValues.includes(dbType)) {
      return entry.analyticsLabel;
    }
  }
  return null;
}
