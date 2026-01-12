import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { MonthlyData, InputParams } from '../utils/types';

interface ChartsProps {
  monthlyData: MonthlyData[];
  inputs: InputParams;
}

/**
 * Charts component - Visualizations for SaaS metrics
 */
const Charts: React.FC<ChartsProps> = ({ monthlyData, inputs }) => {
  // Prepare data for LTV vs CAC comparison
  const ltvVsCacData = [
    { name: 'CAC', value: inputs.cac, fill: '#ef4444' },
    {
      name: 'LTV',
      value: inputs.mrr * (inputs.grossMargin / 100) / (inputs.churnRate / 100),
      fill: '#22c55e'
    },
  ];

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">Month {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Cumulative Profit Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cumulative Profit Over 24 Months
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Track how profit accumulates over time, accounting for CAC, churn, and recurring revenue
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
            />
            <YAxis
              label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#374151" strokeWidth={2} strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="cumulativeProfit"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Cumulative Profit"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-semibold mb-1">INITIAL INVESTMENT</p>
            <p className="text-lg font-bold text-blue-900">{formatCurrency(-inputs.cac)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-semibold mb-1">MONTH 12 PROFIT</p>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(monthlyData[11]?.cumulativeProfit || 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-semibold mb-1">MONTH 24 PROFIT</p>
            <p className="text-lg font-bold text-purple-900">
              {formatCurrency(monthlyData[23]?.cumulativeProfit || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* LTV vs CAC Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          LTV vs CAC Comparison
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Customer Lifetime Value should be significantly higher than Customer Acquisition Cost
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ltvVsCacData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
              contentStyle={{ backgroundColor: 'white', border: '2px solid #d1d5db', borderRadius: '8px' }}
            />
            <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
              {ltvVsCacData.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
            <p className="text-sm font-semibold text-gray-700">CAC</p>
            <p className="text-xs text-gray-500">Cost to Acquire</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
            <p className="text-sm font-semibold text-gray-700">LTV</p>
            <p className="text-xs text-gray-500">Lifetime Value</p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue vs Cost */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Monthly Revenue vs Cost (with Churn)
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Shows how revenue and costs decrease over time due to customer churn
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
            />
            <YAxis
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="monthlyRevenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Monthly Revenue"
            />
            <Line
              type="monotone"
              dataKey="monthlyCost"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 3 }}
              name="Monthly Cost"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Both revenue and costs decline over time due to the {inputs.churnRate}% monthly churn rate.
            This visualization helps identify when customer retention becomes critical.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Charts;
