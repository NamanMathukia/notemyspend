import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function usePreferences(user) {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("₹");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function load() {
      const { data } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setDarkMode(data.dark_mode);
        setCurrency(data.currency);
      }
      setLoading(false);
    }

    load();
  }, [user]);

  return { darkMode, currency, loading };
}
