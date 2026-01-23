import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function AddExpense({ user }) {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      setCatLoading(true);

      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setCategories(data || []);
      setCatLoading(false);
    }
    loadCategories();
  }, [user.id]);

  // Submit expense
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("expenses").insert([
      {
        user_id: user.id,
        amount: Number(amount),
        category,
        date,
      },
    ]);

    if (error) setError(error.message);
    else navigate("/");

    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      <SectionTitle>Add Expense</SectionTitle>

      <FadeIn>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Amount */}
            <input
              type="number"
              placeholder="Amount"
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              <option value="">
                {catLoading ? "Loading categories..." : "Select Category"}
              </option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Manage Categories */}
            <p className="text-sm text-slate-500">
              Want to add or edit categories?{" "}
              <span
                onClick={() => navigate("/categories")}
                className="text-teal-600 cursor-pointer hover:underline"
              >
                Manage Categories
              </span>
            </p>

            {/* Date */}
            <input
              type="date"
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full bg-teal-500 text-white py-2 rounded-lg
                         font-semibold hover:bg-teal-600 transition
                         disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Expense"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
