import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import useCurrency from "../hooks/useCurrency";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#14b8a6",
  "#0ea5e9",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
];

export default function Reports({ user }) {
  const [categoryData, setCategoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const currency = useCurrency(user);

  useEffect(() => {
    if (user) loadExpenses();
  }, [user]);

  async function loadExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    const expenses = data || [];

    // ---- Category Totals ----
    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    setCategoryData(
      Object.keys(categoryMap).map((key) => ({
        name: key,
        value: categoryMap[key],
      }))
    );

    // ---- Timeline Totals ----
    const timelineMap = {};
    expenses.forEach((e) => {
      timelineMap[e.date] = (timelineMap[e.date] || 0) + e.amount;
    });

    setTimelineData(
      Object.keys(timelineMap).map((date) => ({
        date,
        amount: timelineMap[date],
      }))
    );
  }

  // ---- Insights ----
  const totalSpent = categoryData.reduce((sum, c) => sum + c.value, 0);

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((a, b) => (a.value > b.value ? a : b))
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      <SectionTitle>Reports</SectionTitle>

      {/* === Quick Insights === */}
      <FadeIn>
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p className="text-xs text-slate-500">Total Spent</p>
            <p className="text-lg font-bold">
              {currency} {totalSpent}
            </p>
          </Card>

          <Card className="text-center">
            <p className="text-xs text-slate-500">Top Category</p>
            <p className="text-lg font-bold">
              {topCategory ? topCategory.name : "-"}
            </p>
          </Card>
        </div>
      </FadeIn>

      {/* === Category Pie Chart === */}
      <FadeIn delay={0.1}>
        <Card>
          <p className="text-sm font-semibold mb-2">
            Spending by Category
          </p>

          {categoryData.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <>
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {categoryData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${currency} ${v}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
                {categoryData.map((c, i) => (
                  <span key={c.name} className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {c.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>
      </FadeIn>

      {/* === Timeline Line Chart === */}
      <FadeIn delay={0.2}>
        <Card>
          <p className="text-sm font-semibold mb-2">
            Daily Spending
          </p>

          {timelineData.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${currency} ${v}`} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
