import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import EditExpense from "./pages/EditExpense";

import TopNav from "./components/TopNav";
import usePreferences from "./hooks/usePreferences";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Auth Listener ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Load preferences ---
  const { darkMode, loading: prefLoading } = usePreferences(session?.user);

  // --- Apply dark mode to <html> ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (loading || prefLoading) return null;

  return (
    <BrowserRouter>
      {!session ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">

          <TopNav user={session.user} />

          <Routes>
            <Route path="/" element={<Dashboard user={session.user} />} />
            <Route path="/expenses" element={<Expenses user={session.user} />} />
            <Route path="/add" element={<AddExpense user={session.user} />} />
            <Route path="/budget" element={<Budget user={session.user} />} />
            <Route path="/reports" element={<Reports user={session.user} />} />
            <Route path="/settings" element={<Settings user={session.user} />} />
            <Route path="/categories" element={<Categories user={session.user} />} />
            <Route path="/edit/:id" element={<EditExpense user={session.user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </div>
      )}
    </BrowserRouter>
  );
}
