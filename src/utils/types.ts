/**
 * Input parameters for SaaS unit economics calculation
 */
export interface InputParams {
  cac: number; // Customer Acquisition Cost
  mrr: number; // Monthly Recurring Revenue per customer
  churnRate: number; // Monthly churn rate (percentage)
  grossMargin: number; // Gross margin (percentage)
  opex: number; // Monthly operational expenses per customer
}

/**
 * Calculated metrics for SaaS business
 */
export interface CalculatedMetrics {
  ltv: number; // Lifetime Value
  ltvCacRatio: number; // LTV to CAC ratio
  paybackPeriod: number; // Months to recover CAC
  unitEconomics: number; // Profit per customer (LTV - CAC)
  breakEvenPoint: number; // Month when cumulative profit becomes positive
}

/**
 * Health status indicators
 */
export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

/**
 * Monthly profit data for visualization
 */
export interface MonthlyData {
  month: number;
  cumulativeProfit: number;
  monthlyRevenue: number;
  monthlyCost: number;
  retentionRate?: number; // Процент удержания клиентов
  activeCustomers?: number; // Количество активных клиентов
}

/**
 * Complete calculation result including all metrics and chart data
 */
export interface CalculationResult {
  inputs: InputParams;
  metrics: CalculatedMetrics;
  healthStatus: HealthStatus;
  monthlyData: MonthlyData[];
}
