import { useState } from "react";
import { AccountBalances } from "../types";

interface AccountBalancesInputProps {
  balances: AccountBalances;
  onChange: (balances: AccountBalances) => void;
}

export default function AccountBalancesInput({
  balances,
  onChange,
}: AccountBalancesInputProps) {
  const [focusedField, setFocusedField] = useState<keyof AccountBalances | null>(null);

  const handleBalanceChange = (
    account: keyof AccountBalances,
    value: string
  ) => {
    // Allow empty string temporarily for clearing
    const numericValue = value === "" ? 0 : parseFloat(value) || 0;
    onChange({
      ...balances,
      [account]: numericValue,
    });
  };

  const handleFocus = (account: keyof AccountBalances) => {
    setFocusedField(account);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const formatValue = (account: keyof AccountBalances, value: number) => {
    // Show empty string only when focused and value is 0
    if (focusedField === account && value === 0) {
      return "";
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Account Balances
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Traditional IRA Balance
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="10000"
            value={formatValue("traditionalIRA", balances.traditionalIRA)}
            onChange={(e) => handleBalanceChange("traditionalIRA", e.target.value)}
            onFocus={() => handleFocus("traditionalIRA")}
            onBlur={handleBlur}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roth IRA Balance
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="10000"
            value={formatValue("rothIRA", balances.rothIRA)}
            onChange={(e) => handleBalanceChange("rothIRA", e.target.value)}
            onFocus={() => handleFocus("rothIRA")}
            onBlur={handleBlur}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brokerage Account Balance
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="10000"
            value={formatValue("brokerage", balances.brokerage)}
            onChange={(e) => handleBalanceChange("brokerage", e.target.value)}
            onFocus={() => handleFocus("brokerage")}
            onBlur={handleBlur}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          High Yield Savings (HYS)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="10000"
            value={formatValue("hys", balances.hys)}
            onChange={(e) => handleBalanceChange("hys", e.target.value)}
            onFocus={() => handleFocus("hys")}
            onBlur={handleBlur}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
