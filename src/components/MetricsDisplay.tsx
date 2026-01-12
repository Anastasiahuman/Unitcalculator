import React from 'react';
import type { CalculatedMetrics, HealthStatus } from '../utils/types';

interface MetricsDisplayProps {
  metrics: CalculatedMetrics;
  healthStatus: HealthStatus;
}

/**
 * MetricsDisplay component - Shows calculated SaaS metrics with health indicators
 */
const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics, healthStatus }) => {
  const getHealthColor = (status: HealthStatus): string => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'good':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
    }
  };

  const getHealthBadgeColor = (status: HealthStatus): string => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  const getLTVCACHealthText = (ratio: number): string => {
    if (ratio >= 3) return 'Excellent - Strong unit economics';
    if (ratio >= 2) return 'Good - Healthy business model';
    if (ratio >= 1) return 'Warning - Needs improvement';
    return 'Critical - Unsustainable';
  };

  const formatCurrency = (value: number): string => {
    if (!isFinite(value)) return '∞';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value: number, decimals: number = 2): string => {
    if (!isFinite(value)) return '∞';
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
  }: {
    title: string;
    value: string;
    subtitle?: string;
    icon?: string;
  }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Health Status Banner */}
      <div className={`rounded-xl p-6 border-l-8 ${getHealthColor(healthStatus)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-block w-3 h-3 rounded-full ${getHealthBadgeColor(healthStatus)} animate-pulse`}></span>
              <h2 className="text-xl font-bold">Business Health: {healthStatus.toUpperCase()}</h2>
            </div>
            <p className="text-sm font-medium">{getLTVCACHealthText(metrics.ltvCacRatio)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">LTV/CAC Ratio</p>
            <p className="text-4xl font-bold">{formatNumber(metrics.ltvCacRatio)}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          Calculated Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Lifetime Value (LTV)"
            value={formatCurrency(metrics.ltv)}
            subtitle="Expected revenue per customer"
            icon="💰"
          />

          <MetricCard
            title="Unit Economics"
            value={formatCurrency(metrics.unitEconomics)}
            subtitle={metrics.unitEconomics > 0 ? 'Profitable' : 'Unprofitable'}
            icon={metrics.unitEconomics > 0 ? '📈' : '📉'}
          />

          <MetricCard
            title="Payback Period"
            value={formatNumber(metrics.paybackPeriod, 1)}
            subtitle={`${formatNumber(metrics.paybackPeriod, 1)} months to recover CAC`}
            icon="⏱️"
          />

          <MetricCard
            title="Break-Even Point"
            value={metrics.breakEvenPoint > 0 ? `Month ${metrics.breakEvenPoint}` : 'Never'}
            subtitle={metrics.breakEvenPoint > 0 ? 'When profit turns positive' : 'Never reaches profitability'}
            icon={metrics.breakEvenPoint > 0 ? '🎯' : '⚠️'}
          />
        </div>

        {/* Insights */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Key Insights</span>
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>
                <strong>LTV/CAC Ratio of {formatNumber(metrics.ltvCacRatio)}:</strong>{' '}
                {metrics.ltvCacRatio >= 3
                  ? 'Your customer economics are strong. Industry benchmark is 3:1 or higher.'
                  : metrics.ltvCacRatio >= 1
                  ? 'Consider optimizing CAC or increasing customer lifetime value.'
                  : 'Critical: You are spending more to acquire customers than they generate in value.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>
                <strong>Payback Period:</strong>{' '}
                {metrics.paybackPeriod <= 12
                  ? 'Excellent! Recovering CAC in under a year is ideal for SaaS.'
                  : 'Consider reducing CAC or increasing MRR to improve cash flow.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>
                <strong>Unit Economics:</strong>{' '}
                {metrics.unitEconomics > 0
                  ? `You make ${formatCurrency(metrics.unitEconomics)} profit per customer over their lifetime.`
                  : 'Negative unit economics indicate an unsustainable business model.'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
