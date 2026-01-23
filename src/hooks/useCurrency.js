import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function useCurrency(user) {
  const [currency, setCurrency] = useState("₹");

  useEffect(() => {
    if (user) loadCurrency();
  }, [user]);

  async function loadCurrency() {
    const { data } = await supabase
      .from("user_preferences")
      .select("currency")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data?.currency) setCurrency(data.currency);
  }

  return currency;
}
