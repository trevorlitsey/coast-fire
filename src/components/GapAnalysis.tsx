import { GapAnalysisResult, ReturnRateResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface GapAnalysisProps {
  gapAnalysis: GapAnalysisResult[];
  results: ReturnRateResult[];
}

export default function GapAnalysis({ gapAnalysis, results }: GapAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Gap Analysis</h2>
      <p className="text-sm text-gray-600 mb-4">
        Contributions needed to reach Coast FIRE at each return rate (invested in brokerage account):
      </p>

      <div className="space-y-6">
        {gapAnalysis.map((gap, index) => {
          const meetsGoal = results[index]?.meetsGoal;

          return (
            <div
              key={gap.returnRate}
              className={`border rounded-lg p-4 ${
                meetsGoal ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {formatPercentage(gap.returnRate)} Return
                </h3>
                {meetsGoal && (
                  <span className="text-emerald-600 text-sm font-medium">
                    Goal Met ✓
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">One-Time Today</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(gap.oneTimeContribution)}
                  </p>
                </div>

                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Monthly</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(gap.monthlyContribution)}
                  </p>
                </div>

                <div className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Annual</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(gap.annualContribution)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
