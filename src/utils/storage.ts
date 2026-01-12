import { CalculatorInputs } from '../types';

const STORAGE_KEY = 'coast-fire-calculator-inputs';

/**
 * Load calculator inputs from localStorage
 */
export function loadInputs(): CalculatorInputs | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
}

/**
 * Save calculator inputs to localStorage
 */
export function saveInputs(inputs: CalculatorInputs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Clear calculator inputs from localStorage
 */
export function clearInputs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
