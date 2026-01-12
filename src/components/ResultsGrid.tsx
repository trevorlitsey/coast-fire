import { ReturnRateResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ResultsGridProps {
  results: ReturnRateResult[];
  targetPortfolio: number;
}

export default function ResultsGrid({ results, targetPortfolio }: ResultsGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Coast FIRE Results</h2>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Target Portfolio:</strong> {formatCurrency(targetPortfolio)}
          <span className="text-gray-500 ml-2">(based on 4% rule)</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Rate</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Future Value</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">After-Tax</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.returnRate}
                className={`border-b border-gray-100 ${
                  result.meetsGoal ? 'bg-emerald-50' : ''
                }`}
              >
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {formatPercentage(result.returnRate)}
                </td>
                <td className="py-3 px-2 text-sm text-right text-gray-700">
                  {formatCurrency(result.futureValue.total)}
                </td>
                <td className="py-3 px-2 text-sm text-right text-gray-700">
                  {formatCurrency(result.afterTaxValue)}
                </td>
                <td className="py-3 px-2 text-center">
                  {result.meetsGoal ? (
                    <span className="text-emerald-600 text-lg font-bold">✓</span>
                  ) : (
                    <span className="text-gray-400 text-lg">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
