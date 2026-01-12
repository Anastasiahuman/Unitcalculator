# Краткий обзор файлов проекта

## 📊 Статистика кода

```bash
# Подсчет строк в основных файлах
wc -l src/**/*.{ts,tsx,css}
```

| Файл | Строки | Назначение |
|------|--------|-----------|
| `src/App.tsx` | 142 | Главный компонент |
| `src/components/Calculator.tsx` | 105 | Форма ввода |
| `src/components/MetricsDisplay.tsx` | 172 | Отображение метрик |
| `src/components/Charts.tsx` | 180 | Графики |
| `src/utils/types.ts` | 44 | TypeScript типы |
| `src/utils/calculations.ts` | 137 | Бизнес-логика |
| `src/index.css` | 10 | Глобальные стили |

**Всего:** ~790 строк основного кода

---

## 🗂 Ключевые файлы для разработчика

### 1. Бизнес-логика
📄 **src/utils/calculations.ts**
- Все формулы расчета метрик
- 9 экспортируемых функций
- Формулы: LTV, LTV/CAC, Payback Period, Break-even

### 2. Типы данных
📄 **src/utils/types.ts**
- 5 интерфейсов
- 1 type alias (HealthStatus)
- Вся структура данных приложения

### 3. Компоненты UI
📄 **src/components/Calculator.tsx**
- Форма с 5 полями
- Real-time валидация
- useEffect для автоматического пересчета

📄 **src/components/MetricsDisplay.tsx**
- 4 metric карточки
- Health status баннер
- Key insights блок

📄 **src/components/Charts.tsx**
- 3 Recharts графика
- ResponsiveContainer для адаптивности
- Custom Tooltip

### 4. Главный файл
📄 **src/App.tsx**
- State management
- JSON export
- Layout структура

---

## 🔧 Конфигурационные файлы

| Файл | Назначение |
|------|-----------|
| `package.json` | Зависимости и скрипты |
| `tsconfig.json` | TypeScript конфигурация |
| `vite.config.ts` | Vite настройки |
| `tailwind.config.js` | Tailwind CSS |
| `postcss.config.js` | PostCSS + Tailwind |
| `eslint.config.js` | ESLint правила |

---

## 📦 Зависимости (package.json)

### Production
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "recharts": "^2.15.1"
}
```

### Development
```json
{
  "@tailwindcss/postcss": "^4.0.0-beta.5",
  "@vitejs/plugin-react": "^4.3.4",
  "autoprefixer": "^10.4.20",
  "tailwindcss": "^4.0.0",
  "typescript": "~5.7.3",
  "vite": "^7.3.1"
}
```

**Размер node_modules:** ~221 пакетов

---

## 🎯 Основные точки входа

1. **Запуск приложения:** `src/main.tsx`
   ```typescript
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import App from './App.tsx'
   import './index.css'
   
   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <App />
     </StrictMode>,
   )
   ```

2. **HTML template:** `index.html`
   ```html
   <div id="root"></div>
   <script type="module" src="/src/main.tsx"></script>
   ```

3. **Стили:** `src/index.css`
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

## 🔍 Где искать что?

### Хочу изменить формулы расчета
➡️ `src/utils/calculations.ts`

### Хочу изменить поля ввода
➡️ `src/components/Calculator.tsx`

### Хочу изменить отображение метрик
➡️ `src/components/MetricsDisplay.tsx`

### Хочу добавить/изменить график
➡️ `src/components/Charts.tsx`

### Хочу изменить типы данных
➡️ `src/utils/types.ts`

### Хочу изменить цвета/стили
➡️ Tailwind классы в компонентах или `tailwind.config.js`

### Хочу изменить layout
➡️ `src/App.tsx` (grid structure)

### Хочу добавить зависимость
➡️ `package.json` → `npm install <package>`

---

## 📂 Структура dist/ (после build)

```
dist/
├── assets/
│   ├── index-DcYyuBsD.js     (578KB) - весь JS код
│   └── index-J5KW8kF-.css    (3.8KB) - все стили
├── index.html                 (461B)  - entry point
├── standalone.html            (9.5KB) - автономная версия
└── vite.svg                   (1.5KB) - иконка
```

**Общий размер:** ~592KB (176KB после gzip)

---

## 🚀 Quick Start для разработчика

```bash
# 1. Клонировать и перейти в ветку
git clone <repo-url>
git checkout claude/saas-economics-calculator-OUeob

# 2. Установить зависимости
npm install

# 3. Запустить dev сервер
npm run dev
# Открыть http://localhost:5173

# 4. Внести изменения
# Отредактировать файлы в src/

# 5. Собрать production
npm run build

# 6. Проверить production build
npm run preview
# Открыть http://localhost:4173

# 7. Закоммитить
git add .
git commit -m "Your changes"
git push origin claude/saas-economics-calculator-OUeob
```

---

## 🔄 Типичные задачи

### Добавить новое поле в Calculator

1. Обновить `InputParams` в `src/utils/types.ts`
2. Добавить поле в state в `src/components/Calculator.tsx`
3. Добавить `<InputField>` в JSX
4. Обновить валидацию в `useEffect`

### Добавить новую метрику

1. Обновить `CalculatedMetrics` в `src/utils/types.ts`
2. Добавить функцию расчета в `src/utils/calculations.ts`
3. Вызвать функцию в `calculateMetrics()`
4. Добавить отображение в `src/components/MetricsDisplay.tsx`

### Добавить новый график

1. Импортировать компоненты Recharts в `src/components/Charts.tsx`
2. Создать новый `<ResponsiveContainer>` с графиком
3. Подготовить данные в нужном формате
4. Добавить в JSX с соответствующими props

---

## 📝 Комментарии в коде

Все компоненты и функции имеют JSDoc комментарии:

```typescript
/**
 * Calculate Lifetime Value (LTV)
 * Formula: LTV = MRR × Gross Margin / Churn Rate
 */
export const calculateLTV = (mrr: number, grossMargin: number, churnRate: number): number => {
  if (churnRate === 0) return Infinity;
  return (mrr * (grossMargin / 100)) / (churnRate / 100);
};
```

---

## 🐛 Known Issues

1. **Dev server требует перезапуска** при изменении конфигов
2. **Recharts bundle большой** (578KB) - можно оптимизировать через code splitting
3. **No SSR** - чисто client-side приложение

---

## 📚 Полезные ссылки

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [Vite Guide](https://vite.dev/guide/)

---

**Создано:** 2026-01-12
**Для:** Anastasiahuman/Unitcalculator
