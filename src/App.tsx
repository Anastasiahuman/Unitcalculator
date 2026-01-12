import { useState, useCallback, useRef } from 'react';
import Calculator from './components/Calculator';
import MetricsDisplay from './components/MetricsDisplay';
import Charts from './components/Charts';
import type { InputParams, CalculationResult } from './utils/types';
import { calculateMetrics } from './utils/calculations';

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  // Export results to PDF file
  const handleExportPDF = async () => {
    if (!result || !resultsRef.current) return;

    try {
      // Динамический импорт библиотек
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Скрываем кнопки экспорта перед захватом
      const buttons = document.querySelectorAll('.export-buttons');
      buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');

      // Захватываем содержимое
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb'
      });

      // Показываем кнопки обратно
      buttons.forEach(btn => (btn as HTMLElement).style.display = '');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`saas-unit-economics-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Ошибка экспорта в PDF:', error);
      alert('Не удалось экспортировать в PDF. Попробуйте снова.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Калькулятор юнит-экономики SaaS
              </h1>
              <p className="text-gray-600">
                Анализируйте метрики вашего B2B SaaS бизнеса и ценность клиента
              </p>
            </div>
            {result && (
              <div className="export-buttons flex gap-3">
                <button
                  onClick={handleExportPDF}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg flex items-center gap-2 justify-center"
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
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Экспорт PDF
                </button>
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
                  Экспорт JSON
                </button>
              </div>
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
          <div className="lg:col-span-2 space-y-8" ref={resultsRef}>
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
                    Готово к расчету
                  </h2>
                  <p className="text-gray-600">
                    Введите параметры вашего SaaS бизнеса слева, чтобы увидеть детальный
                    анализ юнит-экономики, визуализации и выводы.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center text-gray-600 text-sm">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="font-bold text-gray-800 mb-3">О юнит-экономике</h3>
            <p className="mb-4">
              Юнит-экономика измеряет прямые доходы и расходы, связанные с
              одной единицей (клиентом) в вашей бизнес-модели. Для SaaS бизнеса ключевые
              метрики включают:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <strong className="text-blue-600">LTV (Lifetime Value):</strong> Общий
                ожидаемый доход от клиента за всё время
              </div>
              <div>
                <strong className="text-blue-600">CAC (Customer Acquisition Cost):</strong> Общая
                стоимость привлечения одного клиента
              </div>
              <div>
                <strong className="text-blue-600">Соотношение LTV/CAC:</strong> Должно быть 3:1
                или выше для здорового SaaS бизнеса
              </div>
              <div>
                <strong className="text-blue-600">Период окупаемости:</strong> Время для
                возврата CAC (идеально &lt; 12 месяцев)
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
