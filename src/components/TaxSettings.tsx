import { useState } from 'react';
import { TaxSettings as TaxSettingsType } from '../types';

interface TaxSettingsProps {
  taxSettings: TaxSettingsType;
  onChange: (taxSettings: TaxSettingsType) => void;
}

export default function TaxSettings({ taxSettings, onChange }: TaxSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof TaxSettingsType, value: number) => {
    onChange({
      ...taxSettings,
      [field]: value,
    });
  };

  const handlePercentageChange = (field: keyof TaxSettingsType, inputValue: string) => {
    const numericValue = parseFloat(inputValue) || 0;
    handleChange(field, numericValue / 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-left"
      >
        <h2 className="text-xl font-semibold text-gray-800">Tax Settings</h2>
        <span className="text-gray-500 text-xl">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traditional IRA Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={(taxSettings.traditionalIRATaxRate * 100).toFixed(1)}
              onChange={(e) => handlePercentageChange('traditionalIRATaxRate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capital Gains Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={(taxSettings.capitalGainsTaxRate * 100).toFixed(1)}
              onChange={(e) => handlePercentageChange('capitalGainsTaxRate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Assumption:</strong> Brokerage cost basis is 100% gains (conservative estimate)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
