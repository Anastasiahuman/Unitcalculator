# SaaS Unit Economics Calculator - Technical Documentation

## 📋 Обзор проекта

Полнофункциональный веб-калькулятор для расчета юнит-экономики B2B SaaS бизнеса, построенный на React 18, TypeScript, Tailwind CSS и Recharts.

**Репозиторий:** Anastasiahuman/Unitcalculator
**Ветка разработки:** `claude/saas-economics-calculator-OUeob`
**Последний коммит:** `5245aed` - "Implement SaaS Unit Economics Calculator"

---

## 🗂 Структура проекта

```
/home/user/Unitcalculator/
├── dist/                          # Production build (создается при npm run build)
│   ├── assets/                    # Скомпилированные JS и CSS
│   ├── index.html                 # HTML с React приложением
│   └── standalone.html            # Standalone версия без зависимостей
│
├── src/                           # Исходный код приложения
│   ├── components/                # React компоненты
│   │   ├── Calculator.tsx         # Форма ввода параметров
│   │   ├── MetricsDisplay.tsx     # Отображение рассчитанных метрик
│   │   └── Charts.tsx             # Визуализации и графики
│   │
│   ├── utils/                     # Утилиты и бизнес-логика
│   │   ├── types.ts              # TypeScript типы и интерфейсы
│   │   └── calculations.ts       # Функции расчета метрик
│   │
│   ├── App.tsx                    # Главный компонент приложения
│   ├── App.css                    # Стили приложения (базовые)
│   ├── index.css                  # Глобальные стили + Tailwind
│   └── main.tsx                   # Точка входа приложения
│
├── public/                        # Статические файлы
│   └── vite.svg                   # Иконка Vite
│
├── package.json                   # Зависимости и скрипты
├── package-lock.json              # Lockfile для npm
├── tsconfig.json                  # Основная конфигурация TypeScript
├── tsconfig.app.json              # TS конфигурация для приложения
├── tsconfig.node.json             # TS конфигурация для Node.js
├── vite.config.ts                 # Конфигурация Vite
├── tailwind.config.js             # Конфигурация Tailwind CSS
├── postcss.config.js              # Конфигурация PostCSS
├── eslint.config.js               # Конфигурация ESLint
├── index.html                     # HTML template
├── README.md                      # Пользовательская документация
└── DOCUMENTATION.md               # Техническая документация (этот файл)
```

---

## 🔧 Технический стек

### Основные технологии
- **React 18.3.1** - UI библиотека
- **TypeScript 5.7.3** - Типизация
- **Vite 7.3.1** - Сборщик и dev-сервер
- **Tailwind CSS 4.0.0** - CSS фреймворк
- **Recharts 2.15.1** - Библиотека для графиков

### Dev-зависимости
- **@tailwindcss/postcss** - PostCSS плагин для Tailwind
- **@vitejs/plugin-react** - Vite плагин для React
- **autoprefixer** - PostCSS плагин для автопрефиксов
- **ESLint** - Линтер кода
- **TypeScript** - Компилятор

---

## 📦 Описание компонентов

### 1. **Calculator.tsx** (`src/components/Calculator.tsx`)

**Назначение:** Форма ввода параметров SaaS бизнеса

**Входные данные:**
- `onInputChange: (inputs: InputParams) => void` - Callback для передачи данных родителю

**Состояние:**
- `inputs: InputParams` - Текущие значения полей
- `errors: Record<string, string>` - Ошибки валидации

**Поля ввода:**
1. CAC (Customer Acquisition Cost) - стоимость привлечения клиента ($)
2. MRR (Monthly Recurring Revenue) - месячный доход с клиента ($/month)
3. Churn Rate - месячный отток клиентов (%)
4. Gross Margin - валовая маржа (%)
5. OPEX - операционные расходы на клиента ($/month)

**Валидация:**
- CAC > 0
- MRR > 0
- Churn Rate: 0-100%
- Gross Margin: 0-100%
- OPEX >= 0

**Особенности:**
- Real-time валидация с `useEffect`
- Автоматический пересчет при изменении полей
- Цветовая индикация ошибок
- Подсказки под каждым полем

**Строки кода:** 11-105

---

### 2. **MetricsDisplay.tsx** (`src/components/MetricsDisplay.tsx`)

**Назначение:** Отображение рассчитанных метрик с индикаторами здоровья бизнеса

**Входные данные:**
```typescript
interface MetricsDisplayProps {
  metrics: CalculatedMetrics;
  healthStatus: HealthStatus;
}
```

**Отображаемые метрики:**
1. **LTV (Lifetime Value)** - ожидаемый доход с клиента
2. **Unit Economics** - прибыль с клиента (LTV - CAC)
3. **Payback Period** - период окупаемости CAC (месяцы)
4. **Break-even Point** - месяц достижения безубыточности

**Health Status индикаторы:**
- 🟢 **Excellent** (LTV/CAC >= 3) - зеленый баннер
- 🔵 **Good** (LTV/CAC >= 2) - синий баннер
- 🟡 **Warning** (LTV/CAC >= 1) - желтый баннер
- 🔴 **Critical** (LTV/CAC < 1) - красный баннер

**Компоненты:**
- Health Status Banner - большой баннер с общей оценкой
- Metrics Grid - 4 карточки с метриками (2x2 на desktop)
- Key Insights - информационный блок с рекомендациями

**Строки кода:** 1-172

---

### 3. **Charts.tsx** (`src/components/Charts.tsx`)

**Назначение:** Визуализация данных с помощью интерактивных графиков

**Входные данные:**
```typescript
interface ChartsProps {
  monthlyData: MonthlyData[];
  inputs: InputParams;
}
```

**Графики:**

#### 1. Cumulative Profit Over 24 Months (LineChart)
- **Тип:** Линейный график
- **Данные:** Накопительная прибыль по месяцам
- **Особенности:**
  - Референсная линия на Y=0
  - Отображение Month 12 и Month 24 profit
  - Учитывает CAC как начальную инвестицию

#### 2. LTV vs CAC Comparison (BarChart)
- **Тип:** Столбчатая диаграмма
- **Данные:** Сравнение LTV и CAC
- **Цвета:**
  - CAC: красный (#ef4444)
  - LTV: зеленый (#22c55e)

#### 3. Monthly Revenue vs Cost (LineChart)
- **Тип:** Линейный график с 2 линиями
- **Данные:**
  - Месячная выручка (зеленая линия)
  - Месячные затраты (оранжевая линия)
- **Особенности:** Показывает влияние churn на доходы

**Recharts компоненты:**
- `ResponsiveContainer` - адаптивность
- `LineChart`, `BarChart` - типы графиков
- `XAxis`, `YAxis` - оси координат
- `Tooltip` - всплывающие подсказки
- `Legend` - легенда
- `CartesianGrid` - сетка
- `ReferenceLine` - референсная линия

**Строки кода:** 1-180

---

### 4. **App.tsx** (`src/App.tsx`)

**Назначение:** Главный компонент приложения, управляет состоянием

**Состояние:**
- `result: CalculationResult | null` - результаты расчетов

**Функции:**
1. `handleInputChange` - Получает данные из Calculator, вызывает `calculateMetrics`
2. `handleExportJSON` - Экспорт результатов в JSON файл

**Структура:**
- **Header** - Заголовок с кнопкой Export JSON
- **Grid Layout** - 2 колонки (1/3 для Calculator, 2/3 для результатов)
  - Левая колонка: Calculator
  - Правая колонка: MetricsDisplay + Charts или placeholder
- **Footer** - Информация о метриках

**JSON Export:**
- Формат файла: `saas-unit-economics-YYYY-MM-DD.json`
- Содержимое: полный объект `CalculationResult`
- Метод: Blob + createObjectURL

**Строки кода:** 1-142

---

## 🧮 Бизнес-логика и расчеты

### Файл: `src/utils/calculations.ts`

#### 1. **calculateLTV** - Расчет Lifetime Value
```typescript
LTV = (MRR × Gross Margin) / Churn Rate
```
- Учитывает только gross profit (после вычета прямых затрат)
- Churn rate в процентах преобразуется в десятичную дробь

#### 2. **calculateLTVCACRatio** - Расчет соотношения LTV/CAC
```typescript
LTV/CAC Ratio = LTV / CAC
```
- Benchmark: 3:1 или выше для здорового SaaS

#### 3. **calculatePaybackPeriod** - Период окупаемости
```typescript
Payback Period = CAC / (MRR × Gross Margin)
```
- Результат в месяцах
- Benchmark: < 12 месяцев

#### 4. **calculateUnitEconomics** - Юнит-экономика
```typescript
Unit Economics = LTV - CAC
```
- Показывает прибыль с одного клиента
- Должно быть > 0 для sustainable бизнеса

#### 5. **calculateMonthlyData** - Данные по месяцам (24 месяца)

**Логика:**
```typescript
for (month = 1 to 24) {
  retention_rate = (1 - churn_rate)^month
  monthly_revenue = monthly_gross_profit × retention_rate
  monthly_cost = opex × retention_rate
  cumulative_profit += (monthly_revenue - monthly_cost)
}
```

**Возвращает:** Массив объектов:
```typescript
{
  month: number,
  cumulativeProfit: number,
  monthlyRevenue: number,
  monthlyCost: number
}
```

#### 6. **calculateBreakEvenPoint** - Точка безубыточности
- Находит первый месяц, когда `cumulativeProfit >= 0`
- Возвращает -1, если не достигается за 24 месяца

#### 7. **getHealthStatus** - Определение здоровья бизнеса
```typescript
LTV/CAC >= 3  → 'excellent'
LTV/CAC >= 2  → 'good'
LTV/CAC >= 1  → 'warning'
LTV/CAC < 1   → 'critical'
```

#### 8. **calculateMetrics** - Главная функция расчета
Объединяет все расчеты и возвращает `CalculationResult`

#### 9. **validateInputs** - Валидация входных данных
- Проверяет все поля на корректность
- Возвращает массив ошибок

**Строки кода:** 1-137

---

## 📊 TypeScript типы

### Файл: `src/utils/types.ts`

```typescript
// Входные параметры
export interface InputParams {
  cac: number;           // Customer Acquisition Cost
  mrr: number;           // Monthly Recurring Revenue
  churnRate: number;     // Monthly churn rate (%)
  grossMargin: number;   // Gross margin (%)
  opex: number;          // Monthly operational expenses
}

// Рассчитанные метрики
export interface CalculatedMetrics {
  ltv: number;              // Lifetime Value
  ltvCacRatio: number;      // LTV/CAC ratio
  paybackPeriod: number;    // Months to recover CAC
  unitEconomics: number;    // LTV - CAC
  breakEvenPoint: number;   // Month when profit > 0
}

// Статус здоровья бизнеса
export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

// Данные по месяцам для графиков
export interface MonthlyData {
  month: number;
  cumulativeProfit: number;
  monthlyRevenue: number;
  monthlyCost: number;
}

// Полный результат расчета
export interface CalculationResult {
  inputs: InputParams;
  metrics: CalculatedMetrics;
  healthStatus: HealthStatus;
  monthlyData: MonthlyData[];
}
```

**Строки кода:** 1-44

---

## 🎨 Стилизация

### Tailwind CSS конфигурация

**Файл:** `tailwind.config.js`
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Файл:** `postcss.config.js`
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // Новая версия Tailwind 4.0
    autoprefixer: {},
  },
}
```

**Файл:** `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Используемые Tailwind классы

**Цвета:**
- Primary: `bg-blue-600`, `text-blue-600`
- Success: `bg-green-500`, `text-green-800`
- Warning: `bg-yellow-500`, `text-yellow-800`
- Error: `bg-red-500`, `text-red-800`
- Gray scale: `bg-gray-50` до `bg-gray-900`

**Layout:**
- Grid: `grid`, `grid-cols-1`, `lg:grid-cols-3`, `gap-8`
- Flexbox: `flex`, `items-center`, `justify-between`
- Spacing: `p-4`, `p-6`, `p-8`, `m-4`, `mb-6`

**Responsive:**
- Mobile-first подход
- Breakpoints: `md:`, `lg:` (768px, 1024px)

---

## 🚀 Скрипты и команды

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",                    // Запуск dev сервера (port 5173)
    "build": "tsc -b && vite build",  // Production build → dist/
    "preview": "vite preview",        // Preview production build (port 4173)
    "lint": "eslint ."                // Запуск ESLint
  }
}
```

### Команды для работы

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev              # http://localhost:5173

# Production build
npm run build            # Output: dist/

# Preview production
npm run preview          # http://localhost:4173

# Линтинг
npm run lint
```

---

## 📁 Специальные файлы

### 1. **standalone.html** (`dist/standalone.html`)

**Назначение:** Полностью автономная версия калькулятора без зависимостей

**Особенности:**
- Не требует npm, Node.js, сервера
- Все стили inline в `<style>`
- JavaScript встроен в `<script>`
- Работает в любом браузере
- Открывается через `file://` протокол

**Функционал:**
- ✅ Все 5 полей ввода
- ✅ Real-time расчеты
- ✅ 4 метрики (LTV, Unit Economics, Payback, LTV/CAC)
- ✅ Health status баннер
- ✅ Key insights с рекомендациями
- ❌ НЕТ графиков (Recharts требует React)
- ❌ НЕТ JSON export

**Размер:** ~9.5KB

---

## 🔄 Поток данных

```
User Input (Calculator)
    ↓
handleInputChange (App)
    ↓
calculateMetrics (calculations.ts)
    ↓
setResult (App state)
    ↓
render: MetricsDisplay + Charts
```

### Детальный поток:

1. **Пользователь вводит данные** в Calculator.tsx
2. **useEffect** в Calculator детектит изменения
3. **Валидация** проверяет корректность
4. **onInputChange** отправляет данные в App.tsx
5. **calculateMetrics** рассчитывает все метрики
6. **setResult** обновляет state в App
7. **React re-render** обновляет MetricsDisplay и Charts
8. **Recharts** рендерит графики с новыми данными

---

## 🐛 Важные технические детали

### TypeScript Import Types

**Проблема:** `verbatimModuleSyntax` требует `type` импорты

**Решение:**
```typescript
// ❌ Неправильно
import { InputParams } from './types';

// ✅ Правильно
import type { InputParams } from './types';
```

**Где применено:**
- `src/App.tsx` (line 5)
- `src/components/Calculator.tsx` (line 2)
- `src/components/MetricsDisplay.tsx` (line 2)
- `src/components/Charts.tsx` (line 15)
- `src/utils/calculations.ts` (line 1)

### Tailwind CSS v4.0 PostCSS

**Проблема:** Tailwind 4.0 изменил PostCSS плагин

**Решение:**
```javascript
// postcss.config.js
plugins: {
  '@tailwindcss/postcss': {},  // Новый пакет
  autoprefixer: {},
}
```

### Recharts Tooltip TypeScript

**Проблема:** `value` может быть `undefined`

**Решение:**
```typescript
formatter={(value: number | undefined) =>
  value !== undefined ? formatCurrency(value) : ''
}
```

---

## 📝 Git информация

### Ветка разработки
```
Branch: claude/saas-economics-calculator-OUeob
Remote: origin
```

### Последний коммит
```
Commit: 5245aed
Message: "Implement SaaS Unit Economics Calculator"
Date: 2026-01-12
```

### Коммит включает:
- 23 файла изменено
- 5531 строк добавлено
- Все компоненты, утилиты, конфигурации

### Файлы в коммите:
```
.gitignore
README.md
eslint.config.js
index.html
package-lock.json
package.json
postcss.config.js
public/vite.svg
src/App.css
src/App.tsx
src/assets/react.svg
src/components/Calculator.tsx
src/components/Charts.tsx
src/components/MetricsDisplay.tsx
src/index.css
src/main.tsx
src/utils/calculations.ts
src/utils/types.ts
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

---

## 🧪 Тестовые данные

### Пример 1: Здоровый SaaS бизнес
```javascript
{
  cac: 1000,
  mrr: 200,
  churnRate: 3,
  grossMargin: 80,
  opex: 20
}
// Результат: LTV = 5333, LTV/CAC = 5.33 (excellent)
```

### Пример 2: Проблемный бизнес
```javascript
{
  cac: 2000,
  mrr: 50,
  churnRate: 10,
  grossMargin: 60,
  opex: 15
}
// Результат: LTV = 300, LTV/CAC = 0.15 (critical)
```

### Пример 3: Средний бизнес
```javascript
{
  cac: 1000,
  mrr: 100,
  churnRate: 5,
  grossMargin: 80,
  opex: 20
}
// Результат: LTV = 1600, LTV/CAC = 1.6 (warning)
```

---

## 🔐 Безопасность

### Валидация на клиенте
- Все числа проверяются на > 0
- Проценты ограничены 0-100
- Нет прямой работы с backend (статичное приложение)

### Нет внешних API
- Все расчеты локальные
- Данные не отправляются на сервер
- Export только локальный (client-side)

---

## 📱 Адаптивность

### Breakpoints
- **Mobile:** < 768px - одна колонка
- **Tablet:** 768px - 1024px - адаптивная сетка
- **Desktop:** > 1024px - две колонки (1:2)

### Responsive компоненты
- Grid меняется с 3 колонок на 1
- Metrics grid: 2x2 → 1x4
- Charts: ResponsiveContainer адаптируется

---

## 🚀 Deployment

### Опции деплоя:

1. **Static hosting** (Vercel, Netlify, GitHub Pages)
   - `npm run build`
   - Залить `dist/` на хостинг

2. **Docker**
   - Использовать nginx для раздачи `dist/`

3. **CDN**
   - Залить `dist/` на S3 + CloudFront

4. **Standalone HTML**
   - Просто открыть `dist/standalone.html`

---

## 📞 Контакты и поддержка

**Репозиторий:** Anastasiahuman/Unitcalculator
**Ветка:** claude/saas-economics-calculator-OUeob

---

## ✅ Чеклист готовности

- [x] Все компоненты реализованы
- [x] TypeScript типизация полная
- [x] Все формулы реализованы корректно
- [x] Графики работают и адаптивны
- [x] Валидация работает
- [x] JSON export работает
- [x] Production build успешен
- [x] Standalone версия создана
- [x] Документация написана
- [x] Код закоммичен и запушен

---

**Дата создания документации:** 2026-01-12
**Версия:** 1.0.0
