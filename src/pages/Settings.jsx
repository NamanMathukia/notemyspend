import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function Settings({ user }) {
  const [currency, setCurrency] = useState("₹");
  const [darkMode, setDarkMode] = useState(false);
  const [prefId, setPrefId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load preferences
  useEffect(() => {
    if (user) loadPreferences();
  }, [user]);

  async function loadPreferences() {
    const { data } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setCurrency(data.currency);
      setDarkMode(data.dark_mode);
      setPrefId(data.id);
    }
  }

  async function savePreferences(updated) {
    if (!user) return;
    setLoading(true);

    // Update existing row
    if (prefId) {
      await supabase
        .from("user_preferences")
        .update(updated)
        .eq("id", prefId);
    }
    // Insert new row
    else {
      const { data } = await supabase
        .from("user_preferences")
        .insert({
          user_id: user.id,
          ...updated,
        })
        .select()
        .single();

      if (data) setPrefId(data.id);
    }

    // Update local UI state
    setCurrency(updated.currency);
    setDarkMode(updated.dark_mode);

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Settings</SectionTitle>

      {/* === Profile === */}
      <FadeIn>
        <Card>
          <h2 className="font-semibold mb-2">Profile</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Name: {user?.user_metadata?.full_name || "User"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Email: {user?.email}
          </p>
        </Card>
      </FadeIn>

      {/* === Preferences === */}
      <FadeIn delay={0.1}>
        <Card>
          <h2 className="font-semibold mb-4">Preferences</h2>

          {/* Currency */}
          <div className="flex justify-between items-center text-sm mb-4">
            <label className="text-slate-600 dark:text-slate-300">
              Default Currency
            </label>

            <select
              value={currency}
              onChange={(e) =>
                savePreferences({
                  currency: e.target.value,
                  dark_mode: darkMode,
                })
              }
              className="border rounded px-2 py-1 bg-white dark:bg-slate-800"
            >
              <option value="₹">₹ Rupee</option>
              <option value="$">$ Dollar</option>
              <option value="€">€ Euro</option>
            </select>
          </div>

          {/* Dark Mode */}
          <div className="flex justify-between items-center text-sm">
            <label className="text-slate-600 dark:text-slate-300">
              Dark Mode
            </label>

            <button
              onClick={() =>
                savePreferences({
                  currency,
                  dark_mode: !darkMode,
                })
              }
              className={`w-12 h-6 rounded-full transition ${
                darkMode ? "bg-teal-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {loading && (
            <p className="text-xs text-slate-400 mt-3">Saving...</p>
          )}
        </Card>
      </FadeIn>

      {/* === About === */}
      <FadeIn delay={0.2}>
        <Card className="text-sm text-slate-600 dark:text-slate-300">
          NotemySpend v1.0 <br />
          Personal expense tracker built with React + Supabase.
        </Card>
      </FadeIn>
    </div>
  );
}
