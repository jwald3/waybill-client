/**
 * Format large numbers into human readable strings with K/M suffixes
 * @param num Number to format
 * @param currency Whether to include currency symbol
 */
export function formatLargeNumber(num: number, currency: boolean = true): string {
  const prefix = currency ? '$' : '';
  
  if (num >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(1)}K`;
  }
  return currency ? formatCurrency(num) : num.toString();
}

/**
 * Format number as USD currency
 * @param amount Number to format
 * @param decimals Number of decimal places (default: 0)
 */
export function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Format date to localized string
 * @param dateString Date string to format
 * @param format Format options (default: 'short')
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    : {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
}