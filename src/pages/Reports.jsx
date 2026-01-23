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
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  // ✅ Hook correctly placed
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

    const expensesData = data || [];
    setExpenses(expensesData);

    processCategoryData(expensesData);
    processTimelineData(expensesData);
  }

  function processCategoryData(expenses) {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const chartData = Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));

    setCategoryData(chartData);
  }

  function processTimelineData(expenses) {
    const map = {};
    expenses.forEach((e) => {
      map[e.date] = (map[e.date] || 0) + e.amount;
    });

    const chartData = Object.keys(map).map((date) => ({
      date,
      amount: map[date],
    }));

    setTimelineData(chartData);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Reports</SectionTitle>

      {/* Category Pie Chart */}
      <FadeIn>
        <Card>
          <h2 className="font-semibold mb-3">Category Breakdown</h2>

          {categoryData.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${currency} ${value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </FadeIn>

      {/* Timeline Line Chart */}
      <FadeIn delay={0.1}>
        <Card>
          <h2 className="font-semibold mb-3">Daily Spending</h2>

          {timelineData.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${currency} ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#14b8a6"
                    strokeWidth={3}
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
