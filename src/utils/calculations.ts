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
 * Calculate current age from birth date
 */
export function calculateCurrentAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

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
  const hys = calculateFutureValue(balances.hys, returnRate, years);
  const traditionalIRA = calculateFutureValue(balances.traditionalIRA, returnRate, years);
  const rothIRA = calculateFutureValue(balances.rothIRA, returnRate, years);
  const brokerage = calculateFutureValue(balances.brokerage, returnRate, years);

  return {
    hys,
    traditionalIRA,
    rothIRA,
    brokerage,
    total: hys + traditionalIRA + rothIRA + brokerage,
  };
}

/**
 * Calculate total after-tax value of all accounts (no cap)
 */
export function calculateTotalAfterTaxValue(
  futureValue: FutureValue,
  taxSettings: TaxSettings
): number {
  // HYS: taxed at ordinary income rate (100% gains assumption)
  const hysAfterTax = futureValue.hys * (1 - taxSettings.traditionalIRATaxRate);

  // Brokerage: taxed at capital gains rate (100% gains)
  const brokerageAfterTax = futureValue.brokerage * (1 - taxSettings.capitalGainsTaxRate);

  // Traditional IRA: taxed at ordinary income rate
  const tradIRAAfterTax = futureValue.traditionalIRA * (1 - taxSettings.traditionalIRATaxRate);

  // Roth IRA: tax-free
  const rothIRAAfterTax = futureValue.rothIRA;

  return hysAfterTax + brokerageAfterTax + tradIRAAfterTax + rothIRAAfterTax;
}

/**
 * Calculate after-tax value using tax-efficient withdrawal order (capped at target)
 * This is used to determine if the goal is met
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

  // Step 4: Withdraw from HYS last (ordinary income tax on 100%)
  if (remainingNeeded > 0) {
    const hysAfterTax = futureValue.hys * (1 - taxSettings.traditionalIRATaxRate);
    const fromHYS = Math.min(hysAfterTax, remainingNeeded);
    afterTaxTotal += fromHYS;
    remainingNeeded -= fromHYS;
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
  const currentAge = calculateCurrentAge(inputs.planning.birthDate);
  const years = inputs.planning.targetRetirementAge - currentAge;
  const annualSpending = inputs.planning.desiredMonthlySpending * 12;
  const targetPortfolio = calculateTargetPortfolio(annualSpending);

  const futureValue = calculateAllFutureValues(inputs.balances, returnRate, years);

  // Calculate total after-tax value for display
  const afterTaxValue = calculateTotalAfterTaxValue(futureValue, inputs.taxSettings);

  // Check if goal is met using tax-efficient withdrawal order
  const afterTaxValueForGoal = calculateAfterTaxValue(futureValue, inputs.taxSettings, targetPortfolio);

  return {
    returnRate,
    futureValue,
    afterTaxValue,
    meetsGoal: afterTaxValueForGoal >= targetPortfolio,
    targetPortfolio,
  };
}

/**
 * Calculate gap analysis for a return rate
 */
export function calculateGapAnalysis(
  inputs: CalculatorInputs,
  returnRate: number,
  futureValue: FutureValue
): GapAnalysisResult {
  const currentAge = calculateCurrentAge(inputs.planning.birthDate);
  const years = inputs.planning.targetRetirementAge - currentAge;
  const annualSpending = inputs.planning.desiredMonthlySpending * 12;
  const targetPortfolio = calculateTargetPortfolio(annualSpending);

  // Use tax-efficient withdrawal order to calculate current after-tax value
  const currentAfterTaxValue = calculateAfterTaxValue(futureValue, inputs.taxSettings, targetPortfolio);
  const gap = targetPortfolio - currentAfterTaxValue;

  // One-time contribution needed today (accounts for capital gains tax on brokerage)
  // After-tax value needed = contribution * (1 + rate)^years * (1 - capitalGainsTaxRate)
  const oneTimeContribution = gap > 0
    ? gap / (Math.pow(1 + returnRate, years) * (1 - inputs.taxSettings.capitalGainsTaxRate))
    : 0;

  // Monthly contribution (accounts for capital gains tax)
  let monthlyContribution = 0;
  if (gap > 0) {
    const monthlyRate = returnRate / 12;
    const monthlyPeriods = years * 12;
    const futureValueFactor = ((Math.pow(1 + monthlyRate, monthlyPeriods) - 1) / monthlyRate) * (1 + monthlyRate);
    monthlyContribution = gap / (futureValueFactor * (1 - inputs.taxSettings.capitalGainsTaxRate));
  }

  // Annual contribution (accounts for capital gains tax)
  let annualContribution = 0;
  if (gap > 0) {
    const futureValueFactor = ((Math.pow(1 + returnRate, years) - 1) / returnRate) * (1 + returnRate);
    annualContribution = gap / (futureValueFactor * (1 - inputs.taxSettings.capitalGainsTaxRate));
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
  const annualSpending = inputs.planning.desiredMonthlySpending * 12;
  const targetPortfolio = calculateTargetPortfolio(annualSpending);

  const returnRateResults = returnRates.map(rate =>
    calculateReturnRateResult(inputs, rate)
  );

  const gapAnalysis = returnRateResults.map(result =>
    calculateGapAnalysis(inputs, result.returnRate, result.futureValue)
  );

  return {
    targetPortfolio,
    returnRateResults,
    gapAnalysis,
  };
}
