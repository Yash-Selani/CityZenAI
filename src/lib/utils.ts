import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function severityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444',
  };
  return colors[severity] || '#94A3B8';
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pothole: 'Pothole',
    garbage_dump: 'Garbage Dump',
    water_leak: 'Water Leak',
    broken_streetlight: 'Broken Streetlight',
    damaged_road: 'Damaged Road',
    illegal_construction: 'Illegal Construction',
    sewage_overflow: 'Sewage Overflow',
    fallen_tree: 'Fallen Tree',
    other: 'Other Issue',
  };
  return labels[category] || 'Unknown';
}

export function categoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    pothole: '🕳️',
    garbage_dump: '🗑️',
    water_leak: '💧',
    broken_streetlight: '💡',
    damaged_road: '🚧',
    illegal_construction: '🏗️',
    sewage_overflow: '🚰',
    fallen_tree: '🌳',
    other: '⚠️',
  };
  return emojis[category] || '⚠️';
}

export function generateMailtoLink(
  email: string,
  subject: string,
  body: string
): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
