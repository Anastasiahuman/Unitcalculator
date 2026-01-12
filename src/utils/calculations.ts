import type { InputParams, CalculatedMetrics, HealthStatus, MonthlyData, CalculationResult } from './types';

/**
 * Calculate Lifetime Value (LTV)
 * Formula: LTV = MRR × Gross Margin / Churn Rate
 */
export const calculateLTV = (mrr: number, grossMargin: number, churnRate: number): number => {
  if (churnRate === 0) return Infinity;
  return (mrr * (grossMargin / 100)) / (churnRate / 100);
};

/**
 * Calculate LTV to CAC ratio
 */
export const calculateLTVCACRatio = (ltv: number, cac: number): number => {
  if (cac === 0) return Infinity;
  return ltv / cac;
};

/**
 * Calculate Payback Period in months
 * Formula: Payback Period = CAC / (MRR × Gross Margin)
 */
export const calculatePaybackPeriod = (cac: number, mrr: number, grossMargin: number): number => {
  const monthlyGrossProfit = mrr * (grossMargin / 100);
  if (monthlyGrossProfit === 0) return Infinity;
  return cac / monthlyGrossProfit;
};

/**
 * Calculate Unit Economics (profit per customer)
 * Formula: Unit Economics = LTV - CAC
 */
export const calculateUnitEconomics = (ltv: number, cac: number): number => {
  return ltv - cac;
};

/**
 * Determine health status based on LTV/CAC ratio
 */
export const getHealthStatus = (ltvCacRatio: number): HealthStatus => {
  if (ltvCacRatio >= 3) return 'excellent';
  if (ltvCacRatio >= 2) return 'good';
  if (ltvCacRatio >= 1) return 'warning';
  return 'critical';
};

/**
 * Calculate monthly profit data for 24 months
 */
export const calculateMonthlyData = (inputs: InputParams): MonthlyData[] => {
  const { cac, mrr, grossMargin, churnRate, opex } = inputs;
  const monthlyGrossProfit = mrr * (grossMargin / 100);

  const data: MonthlyData[] = [];
  let cumulativeProfit = -cac; // Start with negative CAC
  const initialCustomers = 100; // Начинаем со 100 клиентов для когортного анализа

  for (let month = 1; month <= 24; month++) {
    // Calculate retention rate (customers remaining)
    const retentionRate = Math.pow(1 - churnRate / 100, month);

    // Monthly revenue decreases due to churn
    const monthlyRevenue = monthlyGrossProfit * retentionRate;
    const monthlyCost = opex * retentionRate;
    const netMonthlyProfit = monthlyRevenue - monthlyCost;

    cumulativeProfit += netMonthlyProfit;

    // Рассчитываем количество активных клиентов
    const activeCustomers = initialCustomers * retentionRate;

    data.push({
      month,
      cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      monthlyCost: parseFloat(monthlyCost.toFixed(2)),
      retentionRate: parseFloat((retentionRate * 100).toFixed(2)),
      activeCustomers: parseFloat(activeCustomers.toFixed(1)),
    });
  }

  return data;
};

/**
 * Find break-even point (month when cumulative profit becomes positive)
 */
export const calculateBreakEvenPoint = (monthlyData: MonthlyData[]): number => {
  const breakEvenMonth = monthlyData.find(data => data.cumulativeProfit >= 0);
  return breakEvenMonth ? breakEvenMonth.month : -1; // -1 if never breaks even
};

/**
 * Main calculation function that computes all metrics
 */
export const calculateMetrics = (inputs: InputParams): CalculationResult => {
  const { cac, mrr, grossMargin, churnRate } = inputs;

  // Calculate core metrics
  const ltv = calculateLTV(mrr, grossMargin, churnRate);
  const ltvCacRatio = calculateLTVCACRatio(ltv, cac);
  const paybackPeriod = calculatePaybackPeriod(cac, mrr, grossMargin);
  const unitEconomics = calculateUnitEconomics(ltv, cac);

  // Generate monthly data
  const monthlyData = calculateMonthlyData(inputs);
  const breakEvenPoint = calculateBreakEvenPoint(monthlyData);

  // Determine health status
  const healthStatus = getHealthStatus(ltvCacRatio);

  const metrics: CalculatedMetrics = {
    ltv: parseFloat(ltv.toFixed(2)),
    ltvCacRatio: parseFloat(ltvCacRatio.toFixed(2)),
    paybackPeriod: parseFloat(paybackPeriod.toFixed(2)),
    unitEconomics: parseFloat(unitEconomics.toFixed(2)),
    breakEvenPoint,
  };

  return {
    inputs,
    metrics,
    healthStatus,
    monthlyData,
  };
};

/**
 * Validate input parameters
 */
export const validateInputs = (inputs: InputParams): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (inputs.cac <= 0) errors.push('CAC must be greater than 0');
  if (inputs.mrr <= 0) errors.push('MRR must be greater than 0');
  if (inputs.churnRate < 0 || inputs.churnRate > 100) errors.push('Churn rate must be between 0 and 100');
  if (inputs.grossMargin < 0 || inputs.grossMargin > 100) errors.push('Gross margin must be between 0 and 100');
  if (inputs.opex < 0) errors.push('OPEX must be greater than or equal to 0');

  return {
    isValid: errors.length === 0,
    errors,
  };
};
