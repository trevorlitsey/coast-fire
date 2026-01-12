import React, { useState, useEffect } from 'react';
import { formatCurrency, parseCurrency } from '../utils/formatters';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
}

export default function CurrencyInput({ value, onChange, label, placeholder }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value > 0 ? formatCurrency(value) : '');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value > 0 ? value.toString() : '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numericValue = parseCurrency(displayValue);
    onChange(numericValue);
    setDisplayValue(numericValue > 0 ? formatCurrency(numericValue) : '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Update parent state in real-time when focused
    const numericValue = parseCurrency(inputValue);
    onChange(numericValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || '$0'}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
