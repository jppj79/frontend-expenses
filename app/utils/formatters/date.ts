/**
 * Format date string to localized format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "13 Jan 2026")
 */
export function formatDate(dateString: string): string {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns Date string for input[type="date"]
 */
export function getCurrentDate(): string {
    return new Date().toISOString().split('T')[0]!
}
