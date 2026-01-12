import { useState, useCallback } from 'react';
import Calculator from './components/Calculator';
import MetricsDisplay from './components/MetricsDisplay';
import Charts from './components/Charts';
import type { InputParams, CalculationResult } from './utils/types';
import { calculateMetrics } from './utils/calculations';

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Handle input changes with real-time calculation
  const handleInputChange = useCallback((inputs: InputParams) => {
    const calculationResult = calculateMetrics(inputs);
    setResult(calculationResult);
  }, []);

  // Export results to JSON file
  const handleExportJSON = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saas-unit-economics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                SaaS Unit Economics Calculator
              </h1>
              <p className="text-gray-600">
                Analyze your B2B SaaS business metrics and customer lifetime value
              </p>
            </div>
            {result && (
              <button
                onClick={handleExportJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg flex items-center gap-2 justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export JSON
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calculator */}
          <div className="lg:col-span-1">
            <Calculator onInputChange={handleInputChange} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-8">
            {result ? (
              <>
                <MetricsDisplay
                  metrics={result.metrics}
                  healthStatus={result.healthStatus}
                />
                <Charts monthlyData={result.monthlyData} inputs={result.inputs} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Ready to Calculate
                  </h2>
                  <p className="text-gray-600">
                    Enter your SaaS business parameters on the left to see detailed
                    unit economics analysis, visualizations, and insights.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center text-gray-600 text-sm">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="font-bold text-gray-800 mb-3">About Unit Economics</h3>
            <p className="mb-4">
              Unit economics measure the direct revenues and costs associated with a
              single unit (customer) in your business model. For SaaS businesses, key
              metrics include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <strong className="text-blue-600">LTV (Lifetime Value):</strong> Total
                revenue expected from a customer over their lifetime
              </div>
              <div>
                <strong className="text-blue-600">CAC (Customer Acquisition Cost):</strong> Total
                cost to acquire one customer
              </div>
              <div>
                <strong className="text-blue-600">LTV/CAC Ratio:</strong> Should be 3:1
                or higher for healthy SaaS businesses
              </div>
              <div>
                <strong className="text-blue-600">Payback Period:</strong> Time to
                recover CAC (ideally &lt; 12 months)
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
