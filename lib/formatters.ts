export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export function formatDuration(years: number, months: number, days: number): string {
  const parts: string[] = [];
  
  if (years > 0) {
    parts.push(`${years} ${pluralize(years, 'year')}`);
  }
  if (months > 0) {
    parts.push(`${months} ${pluralize(months, 'month')}`);
  }
  if (days > 0) {
    parts.push(`${days} ${pluralize(days, 'day')}`);
  }
  
  return parts.join(', ');
}
