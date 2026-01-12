import { useCoastFireCalculator } from "./hooks/useCoastFireCalculator";
import AccountBalancesInput from "./components/AccountBalancesInput";
import PlanningInputs from "./components/PlanningInputs";
import TaxSettings from "./components/TaxSettings";
import ResultsGrid from "./components/ResultsGrid";
import Logo from "./components/Logo";

function App() {
  const { inputs, setInputs, results } = useCoastFireCalculator();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <Logo />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Coasty</h1>
          <p className="text-lg text-gray-600">A Coast FIRE Calculator</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div>
            <AccountBalancesInput
              balances={inputs.balances}
              onChange={(balances) => setInputs({ ...inputs, balances })}
            />

            <PlanningInputs
              planning={inputs.planning}
              onChange={(planning) => setInputs({ ...inputs, planning })}
            />

            <TaxSettings
              taxSettings={inputs.taxSettings}
              onChange={(taxSettings) => setInputs({ ...inputs, taxSettings })}
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
            This calculator uses the 4% rule and assumes tax-efficient
            withdrawal order: Brokerage → Traditional IRA → Roth IRA → HYS
          </p>
          <p className="mt-1 text-xs">
            HYS uses its own return rate. Other accounts use the scenario rates
            (4-8%).
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
