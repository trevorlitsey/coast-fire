import { useState, useMemo } from 'react';
import { CalculatorInputs, CalculatorResults } from '../types';
import { calculateCoastFire } from '../utils/calculations';

export function useCoastFireCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    balances: {
      traditionalIRA: 0,
      rothIRA: 0,
      brokerage: 0,
    },
    planning: {
      currentAge: 30,
      targetRetirementAge: 65,
      desiredAnnualSpending: 80000,
    },
    taxSettings: {
      traditionalIRATaxRate: 0.25,
      capitalGainsTaxRate: 0.25,
      brokerageCostBasis: 1.0,
    },
  });

  // Memoize calculations to avoid recalculating on every render
  const results = useMemo<CalculatorResults>(() => {
    return calculateCoastFire(inputs);
  }, [inputs]);

  return {
    inputs,
    setInputs,
    results,
  };
}
