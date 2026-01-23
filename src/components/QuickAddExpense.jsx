import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickAddExpense({ user, open, onClose, onSaved }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("name")
      .eq("user_id", user.id);

    setCategories(data || []);
  }

  async function handleSave() {
    if (!amount || !category) return;
    setLoading(true);

    // --- Auto-create category if not exists ---
    const exists = categories.find((c) => c.name === category);

    if (!exists) {
      await supabase.from("categories").insert({
        user_id: user.id,
        name: category,
      });
    }

    // --- Insert Expense ---
    await supabase.from("expenses").insert({
      user_id: user.id,
      amount: Number(amount),
      category,
      date: new Date().toISOString().slice(0, 10),
    });

    setAmount("");
    setCategory("");
    setLoading(false);
    onSaved?.();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl shadow-lg p-5 w-80 space-y-4">
              <h2 className="font-semibold text-lg">Add Expense</h2>

              <input
                type="number"
                placeholder="Amount ₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              {/* Category quick select */}
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCategory(c.name)}
                    className={`px-3 py-1 rounded text-sm border ${
                      category === c.name
                        ? "bg-teal-500 text-white border-teal-500"
                        : "bg-slate-50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Custom category input */}
              <input
                placeholder="Or type category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-teal-500 text-white py-2 rounded font-semibold"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
