/**
 * Format number as currency (USD)
 * @param value - Number to format
 * @returns Formatted currency string (e.g., "$1,234")
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(value)
}

/**
 * Format number with comma separators
 * @param value - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value)
}
