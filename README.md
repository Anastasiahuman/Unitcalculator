# SaaS Unit Economics Calculator

A professional web calculator for analyzing B2B SaaS business unit economics, built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Calculations**: Instant metric updates as you change input parameters
- **Comprehensive Metrics**: LTV, CAC Ratio, Payback Period, Unit Economics, and Break-even Point
- **Interactive Visualizations**:
  - Cumulative profit over 24 months
  - LTV vs CAC comparison chart
  - Monthly revenue vs cost analysis with churn impact
- **Health Indicators**: Color-coded business health status based on industry benchmarks
- **Data Export**: Download your analysis results as JSON
- **Mobile-First Design**: Fully responsive layout for all devices
- **Input Validation**: Real-time form validation with helpful error messages

## Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for blazing fast development
- **Tailwind CSS** for modern, utility-first styling
- **Recharts** for beautiful, responsive data visualizations

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Enter your SaaS business parameters:
   - CAC (Customer Acquisition Cost)
   - MRR (Monthly Recurring Revenue per customer)
   - Churn Rate (%)
   - Gross Margin (%)
   - Operational Expenses per customer/month

2. View automatically calculated metrics:
   - Lifetime Value (LTV)
   - LTV/CAC Ratio
   - Payback Period
   - Unit Economics (Profit per customer)
   - Break-even Point

3. Analyze visualizations to understand your business trajectory

4. Export results as JSON for further analysis or record-keeping

## Project Structure

```
src/
├── components/
│   ├── Calculator.tsx      # Input form component
│   ├── MetricsDisplay.tsx  # Calculated metrics display
│   └── Charts.tsx          # Data visualizations
├── utils/
│   ├── types.ts           # TypeScript type definitions
│   └── calculations.ts    # Business logic and formulas
└── App.tsx                # Main application component
```

## Key Metrics Explained

- **LTV (Lifetime Value)**: Expected revenue from a customer over their lifetime
  - Formula: `MRR × Gross Margin / Churn Rate`

- **LTV/CAC Ratio**: Efficiency of customer acquisition
  - Benchmark: 3:1 or higher for healthy SaaS businesses

- **Payback Period**: Months to recover customer acquisition cost
  - Benchmark: < 12 months for optimal cash flow

- **Unit Economics**: Profit per customer after all costs
  - Formula: `LTV - CAC`

## Development

Built with modern best practices:
- TypeScript for type safety
- Component-based architecture
- Real-time validation
- Responsive design with Tailwind CSS
- Clean, commented code following industry standards

## License

MIT
