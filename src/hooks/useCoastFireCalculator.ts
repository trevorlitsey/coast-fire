import { useState, useMemo, useEffect } from "react";
import { CalculatorInputs, CalculatorResults } from "../types";
import { calculateCoastFire } from "../utils/calculations";
import { loadInputs, saveInputs } from "../utils/storage";

const defaultInputs: CalculatorInputs = {
  balances: {
    hys: 0,
    traditionalIRA: 0,
    rothIRA: 0,
    brokerage: 0,
  },
  planning: {
    birthDate: "1996-01-01",
    targetRetirementAge: 65,
    desiredMonthlySpending: 6667,
    hysReturnRate: 0.04,
  },
  taxSettings: {
    traditionalIRATaxRate: 0.25,
    capitalGainsTaxRate: 0.2,
    brokerageCostBasis: 1.0,
  },
};

export function useCoastFireCalculator() {
  // Initialize state from localStorage or use defaults
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const stored = loadInputs();
    return stored || defaultInputs;
  });

  // Save to localStorage whenever inputs change
  useEffect(() => {
    saveInputs(inputs);
  }, [inputs]);

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
