import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Global logger utility for error and action logging
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
    // TODO: Optionally send to backend or Slack
  },
  action: (action: string, details?: unknown) => {
    console.log(`[ACTION] ${action}`, details);
    // TODO: Optionally send to backend or Slack
  }
};
