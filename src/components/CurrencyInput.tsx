import React, { useState } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
  step?: number;
}

export default function CurrencyInput({ value, onChange, label, step = 100 }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue === "" ? 0 : parseFloat(inputValue) || 0;
    onChange(numericValue);
  };

  const formatValue = () => {
    // Show empty string only when focused and value is 0
    if (isFocused && value === 0) {
      return "";
    }
    return value;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <input
          type="number"
          min="0"
          step={step}
          value={formatValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  );
}
