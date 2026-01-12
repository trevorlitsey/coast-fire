import {
  AccountBalances,
  CalculatorInputs,
  CalculatorResults,
  FutureValue,
  GapAnalysisResult,
  ReturnRateResult,
  TaxSettings,
} from '../types';

/**
 * Calculate target portfolio based on 4% rule
 */
export function calculateTargetPortfolio(annualSpending: number): number {
  return annualSpending / 0.04;
}

/**
 * Calculate future value of a single account
 */
export function calculateFutureValue(
  currentBalance: number,
  returnRate: number,
  years: number
): number {
  return currentBalance * Math.pow(1 + returnRate, years);
}

/**
 * Calculate future values for all accounts
 */
export function calculateAllFutureValues(
  balances: AccountBalances,
  returnRate: number,
  years: number
): FutureValue {
  const traditionalIRA = calculateFutureValue(balances.traditionalIRA, returnRate, years);
  const rothIRA = calculateFutureValue(balances.rothIRA, returnRate, years);
  const brokerage = calculateFutureValue(balances.brokerage, returnRate, years);

  return {
    traditionalIRA,
    rothIRA,
    brokerage,
    total: traditionalIRA + rothIRA + brokerage,
  };
}

/**
 * Calculate after-tax value using tax-efficient withdrawal order
 */
export function calculateAfterTaxValue(
  futureValue: FutureValue,
  taxSettings: TaxSettings,
  targetPortfolio: number
): number {
  let remainingNeeded = targetPortfolio;
  let afterTaxTotal = 0;

  // Step 1: Withdraw from Brokerage (capital gains tax on 100%)
  const brokerageAfterTax = futureValue.brokerage * (1 - taxSettings.capitalGainsTaxRate);
  const fromBrokerage = Math.min(brokerageAfterTax, remainingNeeded);
  afterTaxTotal += fromBrokerage;
  remainingNeeded -= fromBrokerage;

  // Step 2: Withdraw from Traditional IRA (ordinary income tax)
  if (remainingNeeded > 0) {
    const tradIRAAfterTax = futureValue.traditionalIRA * (1 - taxSettings.traditionalIRATaxRate);
    const fromTradIRA = Math.min(tradIRAAfterTax, remainingNeeded);
    afterTaxTotal += fromTradIRA;
    remainingNeeded -= fromTradIRA;
  }

  // Step 3: Withdraw from Roth IRA (tax-free)
  if (remainingNeeded > 0) {
    const fromRothIRA = Math.min(futureValue.rothIRA, remainingNeeded);
    afterTaxTotal += fromRothIRA;
    remainingNeeded -= fromRothIRA;
  }

  return afterTaxTotal;
}

/**
 * Calculate results for a single return rate
 */
export function calculateReturnRateResult(
  inputs: CalculatorInputs,
  returnRate: number
): ReturnRateResult {
  const years = inputs.planning.targetRetirementAge - inputs.planning.currentAge;
  const targetPortfolio = calculateTargetPortfolio(inputs.planning.desiredAnnualSpending);

  const futureValue = calculateAllFutureValues(inputs.balances, returnRate, years);
  const afterTaxValue = calculateAfterTaxValue(futureValue, inputs.taxSettings, targetPortfolio);

  return {
    returnRate,
    futureValue,
    afterTaxValue,
    meetsGoal: afterTaxValue >= targetPortfolio,
    targetPortfolio,
  };
}

/**
 * Calculate gap analysis for a return rate
 */
export function calculateGapAnalysis(
  inputs: CalculatorInputs,
  returnRate: number,
  currentAfterTaxValue: number
): GapAnalysisResult {
  const years = inputs.planning.targetRetirementAge - inputs.planning.currentAge;
  const targetPortfolio = calculateTargetPortfolio(inputs.planning.desiredAnnualSpending);
  const gap = targetPortfolio - currentAfterTaxValue;

  // One-time contribution needed today
  const oneTimeContribution = gap > 0 ? gap / Math.pow(1 + returnRate, years) : 0;

  // Monthly contribution (using future value of annuity formula)
  let monthlyContribution = 0;
  if (gap > 0) {
    const monthlyRate = returnRate / 12;
    const monthlyPeriods = years * 12;
    monthlyContribution = gap / (
      ((Math.pow(1 + monthlyRate, monthlyPeriods) - 1) / monthlyRate) *
      (1 + monthlyRate)
    );
  }

  // Annual contribution
  let annualContribution = 0;
  if (gap > 0) {
    annualContribution = gap / (
      ((Math.pow(1 + returnRate, years) - 1) / returnRate) *
      (1 + returnRate)
    );
  }

  return {
    returnRate,
    oneTimeContribution: Math.max(0, oneTimeContribution),
    monthlyContribution: Math.max(0, monthlyContribution),
    annualContribution: Math.max(0, annualContribution),
  };
}

/**
 * Main calculation function - orchestrates all calculations
 */
export function calculateCoastFire(inputs: CalculatorInputs): CalculatorResults {
  const returnRates = [0.04, 0.05, 0.06, 0.07, 0.08];
  const targetPortfolio = calculateTargetPortfolio(inputs.planning.desiredAnnualSpending);

  const returnRateResults = returnRates.map(rate =>
    calculateReturnRateResult(inputs, rate)
  );

  const gapAnalysis = returnRateResults.map(result =>
    calculateGapAnalysis(inputs, result.returnRate, result.afterTaxValue)
  );

  return {
    targetPortfolio,
    returnRateResults,
    gapAnalysis,
  };
}
