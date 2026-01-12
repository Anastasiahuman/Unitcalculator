import React, { useState, useEffect } from 'react';
import type { InputParams } from '../utils/types';

interface CalculatorProps {
  onInputChange: (inputs: InputParams) => void;
}

/**
 * Calculator component - Input form for SaaS unit economics parameters
 */
const Calculator: React.FC<CalculatorProps> = ({ onInputChange }) => {
  const [inputs, setInputs] = useState<InputParams>({
    cac: 1000,
    mrr: 100,
    churnRate: 5,
    grossMargin: 80,
    opex: 20,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time validation and propagation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (inputs.cac <= 0) newErrors.cac = 'Must be greater than 0';
    if (inputs.mrr <= 0) newErrors.mrr = 'Must be greater than 0';
    if (inputs.churnRate < 0 || inputs.churnRate > 100) newErrors.churnRate = 'Must be between 0 and 100';
    if (inputs.grossMargin < 0 || inputs.grossMargin > 100) newErrors.grossMargin = 'Must be between 0 and 100';
    if (inputs.opex < 0) newErrors.opex = 'Must be greater than or equal to 0';

    setErrors(newErrors);

    // Only propagate valid inputs
    if (Object.keys(newErrors).length === 0) {
      onInputChange(inputs);
    }
  }, [inputs, onInputChange]);

  const handleInputChange = (field: keyof InputParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const InputField = ({
    label,
    field,
    unit,
    description
  }: {
    label: string;
    field: keyof InputParams;
    unit: string;
    description: string;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        <span className="text-gray-500 font-normal ml-2">({unit})</span>
      </label>
      <input
        type="number"
        value={inputs[field]}
        onChange={handleInputChange(field)}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          errors[field]
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
        step={field === 'churnRate' || field === 'grossMargin' ? '0.1' : '1'}
        min="0"
      />
      <p className="mt-1 text-xs text-gray-500">{description}</p>
      {errors[field] && (
        <p className="mt-1 text-xs text-red-600 font-medium">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Input Parameters
      </h2>

      <div className="space-y-2">
        <InputField
          label="CAC (Customer Acquisition Cost)"
          field="cac"
          unit="$"
          description="Total cost to acquire one customer"
        />

        <InputField
          label="MRR (Monthly Recurring Revenue)"
          field="mrr"
          unit="$/month"
          description="Average monthly revenue per customer"
        />

        <InputField
          label="Churn Rate"
          field="churnRate"
          unit="%"
          description="Monthly customer attrition rate"
        />

        <InputField
          label="Gross Margin"
          field="grossMargin"
          unit="%"
          description="Revenue minus direct costs"
        />

        <InputField
          label="Operational Expenses"
          field="opex"
          unit="$/month"
          description="Monthly operational costs per customer"
        />
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700 font-medium">
            Please correct the errors above to see calculations
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
