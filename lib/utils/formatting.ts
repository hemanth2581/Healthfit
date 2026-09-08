export function formatCalories(kcal: number): string {
  return `${Math.round(kcal).toLocaleString()} kcal`;
}

export function formatGrams(grams: number): string {
  return `${Math.round(grams)}g`;
}

export function formatMilliliters(ml: number): string {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)} L`;
  }
  return `${ml} ml`;
}

export function formatPercentage(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}
