import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate random position within bounds
 */
export function randomPosition(maxX: number, maxY: number) {
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY
  }
}

/**
 * Calculate distance between two points
 */
export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

/**
 * Generate a random delay for animations
 */
export function randomDelay(min = 0, max = 2) {
  return Math.random() * (max - min) + min
}

/**
 * Agent role colors mapping
 */
export const roleColors = {
  'cto': '#8B5CF6',
  'product-owner': '#06B6D4', 
  'scrum-master': '#10B981',
  'backend': '#F59E0B',
  'frontend': '#EF4444',
  'qa': '#8B5A2B',
  'devops': '#6366F1',
  'solution-engineer': '#EC4899',
  'content-creator': '#84CC16',
  'marketing': '#F97316',
  'sales': '#14B8A6',
  'support': '#A855F7',
  'personal-assistant': '#F43F5E',
  'hr': '#3B82F6',
  'finance': '#059669',
  'legal': '#7C3AED'
} as const

export type AgentRole = keyof typeof roleColors