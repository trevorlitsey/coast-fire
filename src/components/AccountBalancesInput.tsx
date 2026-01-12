import { AccountBalances } from '../types';
import CurrencyInput from './CurrencyInput';

interface AccountBalancesInputProps {
  balances: AccountBalances;
  onChange: (balances: AccountBalances) => void;
}

export default function AccountBalancesInput({ balances, onChange }: AccountBalancesInputProps) {
  const handleBalanceChange = (account: keyof AccountBalances, value: number) => {
    onChange({
      ...balances,
      [account]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Balances</h2>

      <CurrencyInput
        label="Traditional IRA Balance"
        value={balances.traditionalIRA}
        onChange={(value) => handleBalanceChange('traditionalIRA', value)}
      />

      <CurrencyInput
        label="Roth IRA Balance"
        value={balances.rothIRA}
        onChange={(value) => handleBalanceChange('rothIRA', value)}
      />

      <CurrencyInput
        label="Brokerage Account Balance"
        value={balances.brokerage}
        onChange={(value) => handleBalanceChange('brokerage', value)}
      />
    </div>
  );
}
