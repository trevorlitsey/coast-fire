export interface AccountBalances {
  traditionalIRA: number;
  rothIRA: number;
  brokerage: number;
}

export interface PlanningInputs {
  birthDate: string; // YYYY-MM-DD format
  targetRetirementAge: number;
  desiredMonthlySpending: number;
}

export interface TaxSettings {
  traditionalIRATaxRate: number; // decimal (0.25 for 25%)
  capitalGainsTaxRate: number;   // decimal (0.25 for 25%)
  brokerageCostBasis: number;    // always 1.0 (100% gains)
}

export interface CalculatorInputs {
  balances: AccountBalances;
  planning: PlanningInputs;
  taxSettings: TaxSettings;
}

export interface FutureValue {
  traditionalIRA: number;
  rothIRA: number;
  brokerage: number;
  total: number;
}

export interface ReturnRateResult {
  returnRate: number;           // 0.04, 0.05, etc.
  futureValue: FutureValue;
  afterTaxValue: number;
  meetsGoal: boolean;
  targetPortfolio: number;
}

export interface GapAnalysisResult {
  returnRate: number;
  oneTimeContribution: number;
  monthlyContribution: number;
  annualContribution: number;
}

export interface CalculatorResults {
  targetPortfolio: number;
  returnRateResults: ReturnRateResult[];
  gapAnalysis: GapAnalysisResult[];
}
