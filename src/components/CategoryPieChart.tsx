import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '@/hooks/useExpenses';

interface CategoryPieChartProps {
  expenses: Expense[];
  currency?: string;
}

const COLORS = [
  'hsl(173, 58%, 39%)',   // Teal
  'hsl(12, 76%, 61%)',    // Coral
  'hsl(43, 74%, 66%)',    // Gold
  'hsl(197, 37%, 24%)',   // Dark blue
  'hsl(27, 87%, 67%)',    // Orange
  'hsl(215, 25%, 27%)',   // Slate
];

export function CategoryPieChart({ expenses, currency = '₹' }: CategoryPieChartProps) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="glass-card flex h-[280px] items-center justify-center rounded-2xl">
        <div className="text-center">
          <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-secondary">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-muted-foreground">No expenses to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6">
      <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
        Spending by Category
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={4}
            dataKey="value"
            animationDuration={600}
            animationBegin={100}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`${currency}${value.toFixed(2)}`, '']}
          />
          <Legend
            verticalAlign="bottom"
            height={32}
            formatter={(value) => (
              <span className="text-xs text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
