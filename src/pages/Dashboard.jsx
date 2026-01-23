import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import useCurrency from "../hooks/useCurrency";

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(null);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchBudget();
    }
  }, [user]);

  // Fetch expenses
  async function fetchExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    setExpenses(data || []);
  }

  // Fetch budget
  async function fetchBudget() {
    const { data } = await supabase
      .from("budgets")
      .select("monthly_budget")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) setMonthlyBudget(data.monthly_budget);
  }

  // Date helpers
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);
const currency = useCurrency(user);

  // Totals
  const todayTotal = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthTotal = expenses
    .filter((e) => e.date.startsWith(month))
    .reduce((sum, e) => sum + e.amount, 0);

  const budgetLeft =
    monthlyBudget !== null ? monthlyBudget - monthTotal : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Dashboard</SectionTitle>

      {/* === Top Stats === */}
      <div className="grid grid-cols-2 gap-4">
        <FadeIn>
          <Card>
            <p className="text-slate-500 text-sm">Today</p>
            <p className="text-xl font-bold">{currency} {todayTotal}</p>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <p className="text-slate-500 text-sm">This Month</p>
            <p className="text-xl font-bold">{currency} {monthTotal}</p>
          </Card>
        </FadeIn>
      </div>

      {/* === Budget Status (only if budget exists) === */}
      {monthlyBudget !== null && (
        <FadeIn delay={0.15}>
          <Card>
            <p className="text-slate-500 text-sm">Monthly Budget</p>
            <p className="text-lg font-semibold">
              {currency} {monthlyBudget}
            </p>

            <p className="text-sm mt-2">
              Remaining:{" "}
              <span
                className={
                  budgetLeft < 0
                    ? "text-red-600 font-semibold"
                    : "text-teal-600 font-semibold"
                }
              >
                {currency} {budgetLeft}
              </span>
            </p>
          </Card>
        </FadeIn>
      )}

      {/* === Recent Expenses === */}
      <FadeIn delay={0.2}>
        <Card>
          <h2 className="font-semibold mb-3">Recent Expenses</h2>

          {expenses.slice(0, 5).map((e) => (
            <div
              key={e.id}
              className="flex justify-between border-b last:border-none py-2 text-sm"
            >
              <div>
                <p className="font-medium">{e.category}</p>
                <p className="text-slate-500">{e.date}</p>
              </div>
              <p className="font-semibold">{currency} {e.amount}</p>
            </div>
          ))}

          {expenses.length === 0 && (
            <p className="text-slate-400 text-sm">No expenses yet</p>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
