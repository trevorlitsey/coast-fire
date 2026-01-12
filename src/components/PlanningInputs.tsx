import { useState, useEffect } from 'react';
import { PlanningInputs as PlanningInputsType } from '../types';
import CurrencyInput from './CurrencyInput';

interface PlanningInputsProps {
  planning: PlanningInputsType;
  onChange: (planning: PlanningInputsType) => void;
}

export default function PlanningInputs({ planning, onChange }: PlanningInputsProps) {
  const [hysRateDisplay, setHysRateDisplay] = useState('');
  const [hysRateFocused, setHysRateFocused] = useState(false);

  // Update display value when not focused
  useEffect(() => {
    if (!hysRateFocused) {
      setHysRateDisplay((planning.hysReturnRate * 100).toFixed(1));
    }
  }, [planning.hysReturnRate, hysRateFocused]);

  const handleChange = (field: keyof PlanningInputsType, value: number) => {
    onChange({
      ...planning,
      [field]: value,
    });
  };

  const handlePercentageChange = (inputValue: string) => {
    const numericValue = parseFloat(inputValue) || 0;
    handleChange('hysReturnRate', numericValue / 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Planning Parameters</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birth Date
        </label>
        <input
          type="date"
          value={planning.birthDate}
          onChange={(e) => onChange({ ...planning, birthDate: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Retirement Age
        </label>
        <input
          type="number"
          min="0"
          max="120"
          value={planning.targetRetirementAge}
          onChange={(e) => handleChange('targetRetirementAge', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          HYSA Return Rate (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={hysRateDisplay}
          onChange={(e) => {
            setHysRateDisplay(e.target.value);
            handlePercentageChange(e.target.value);
          }}
          onFocus={() => setHysRateFocused(true)}
          onBlur={() => {
            setHysRateFocused(false);
            const numericValue = parseFloat(hysRateDisplay) || 0;
            setHysRateDisplay(numericValue.toFixed(1));
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <CurrencyInput
          label="Desired Monthly Spending in Retirement"
          value={planning.desiredMonthlySpending}
          onChange={(value) => handleChange('desiredMonthlySpending', value)}
        />
        <p className="text-xs text-gray-500 -mt-3 mb-4">
          Post-tax spending power (what you want available to spend after taxes)
        </p>
      </div>
    </div>
  );
}
