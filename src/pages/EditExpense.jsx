import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function EditExpense({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user) {
      loadExpense();
      loadCategories();
    }
  }, [user]);

  async function loadExpense() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .eq("id", id)
      .single();

    if (data) {
      setAmount(data.amount);
      setCategory(data.category);
      setDate(data.date);
    }
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("name")
      .eq("user_id", user.id);

    setCategories(data || []);
  }

  async function updateExpense(e) {
    e.preventDefault();

    await supabase
      .from("expenses")
      .update({
        amount: Number(amount),
        category,
        date,
      })
      .eq("id", id);

    navigate("/expenses");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Edit Expense</SectionTitle>

      <FadeIn>
        <Card className="space-y-4">
          <form onSubmit={updateExpense} className="space-y-4">

            {/* Amount */}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount ₹"
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              required
            />

            {/* Category */}
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              required
            />

            {/* Submit */}
            <button
              className="w-full bg-teal-500 text-white py-2 rounded-lg
                         font-semibold hover:bg-teal-600 transition"
            >
              Update Expense
            </button>

          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
