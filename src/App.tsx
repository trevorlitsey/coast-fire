import { useCoastFireCalculator } from './hooks/useCoastFireCalculator';
import AccountBalancesInput from './components/AccountBalancesInput';
import PlanningInputs from './components/PlanningInputs';
import TaxSettings from './components/TaxSettings';
import ResultsGrid from './components/ResultsGrid';

function App() {
  const { inputs, setInputs, results } = useCoastFireCalculator();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Coast FIRE Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate when you can coast to retirement
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div>
            <AccountBalancesInput
              balances={inputs.balances}
              onChange={(balances) =>
                setInputs({ ...inputs, balances })
              }
            />

            <PlanningInputs
              planning={inputs.planning}
              onChange={(planning) =>
                setInputs({ ...inputs, planning })
              }
            />

            <TaxSettings
              taxSettings={inputs.taxSettings}
              onChange={(taxSettings) =>
                setInputs({ ...inputs, taxSettings })
              }
            />
          </div>

          {/* Right Column - Results */}
          <div>
            <ResultsGrid
              results={results.returnRateResults}
              gapAnalysis={results.gapAnalysis}
              targetPortfolio={results.targetPortfolio}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            This calculator uses the 4% rule and assumes tax-efficient withdrawal order:
            Brokerage → Traditional IRA → Roth IRA
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
