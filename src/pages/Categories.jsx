import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (user) loadCategories();
  }, [user]);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setCategories(data || []);
  }

  async function addCategory() {
    if (!newCat.trim()) return;

    await supabase.from("categories").insert({
      user_id: user.id,
      name: newCat.trim(),
    });

    setNewCat("");
    loadCategories();
  }

  async function deleteCategory(id) {
    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
  }

  async function saveEdit(id) {
    await supabase
      .from("categories")
      .update({ name: editingValue })
      .eq("id", id);

    setEditingId(null);
    setEditingValue("");
    loadCategories();
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Manage Categories</SectionTitle>

      {/* Add Category */}
      <FadeIn>
        <Card className="flex gap-3">
          <input
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="New category name"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button
            onClick={addCategory}
            className="bg-teal-500 text-white px-4 rounded-lg font-semibold
                       hover:bg-teal-600 transition"
          >
            Add
          </button>
        </Card>
      </FadeIn>

      {/* Category List */}
      <FadeIn delay={0.1}>
        <Card className="divide-y">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between py-3 text-sm"
            >
              {editingId === cat.id ? (
                <input
                  className="border border-slate-300 rounded px-2 py-1"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                />
              ) : (
                <span className="font-medium">{cat.name}</span>
              )}

              <div className="flex gap-3">
                {editingId === cat.id ? (
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="text-green-600 text-xs font-semibold hover:underline"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditingValue(cat.name);
                    }}
                    className="text-blue-600 text-xs font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-600 text-xs font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="py-4 text-slate-500 text-sm text-center">
              No categories yet. Add one above.
            </p>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
