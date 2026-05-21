import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating a state value until after the user stops changing it for a specified duration
 * 
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export const useDebounce = <T,>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay is complete
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
