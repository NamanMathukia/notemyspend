import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import useCurrency from "../hooks/useCurrency";

export default function Expenses({ user }) {
  const [expenses, setExpenses] = useState([]);

  // ✅ Hooks must be here
  const currency = useCurrency(user);

  useEffect(() => {
    if (user) loadExpenses();
  }, [user]);

  async function loadExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    setExpenses(data || []);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>All Expenses</SectionTitle>

      <FadeIn>
        <Card className="divide-y">
          {expenses.length === 0 && (
            <p className="py-4 text-slate-500 text-sm text-center">
              No expenses found.
            </p>
          )}

          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex justify-between py-3 text-sm"
            >
              <div>
                <p className="font-medium">{e.category}</p>
                <p className="text-slate-500">{e.date}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {currency} {e.amount}
                </p>
                <Link
                  to={`/edit/${e.id}`}
                  className="text-xs text-teal-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </Card>
      </FadeIn>
    </div>
  );
}
