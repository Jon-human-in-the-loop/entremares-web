/**
 * Utility function for merging Tailwind CSS classnames
 * Combines clsx and tailwind-merge for conflict resolution
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
