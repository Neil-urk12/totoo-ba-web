/**
 * Formats a snake_case or SCREAMING_SNAKE_CASE string to Title Case
 * @param text - The text to format (e.g., "food_product" or "FOOD_PRODUCT")
 * @returns Formatted text (e.g., "Food Product")
 */
export function formatCategoryText(text: string | null | undefined): string {
    if (!text) return 'N/A';
    
    return text
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
