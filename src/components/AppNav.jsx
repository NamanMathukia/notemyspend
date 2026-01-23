import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function AppNav({ user }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";

  const avatar =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${displayName}`;

  const navLinkClass = (path) =>
    location.pathname === path
      ? "text-teal-600 font-semibold bg-teal-50 dark:bg-teal-900/40"
      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800";

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;
    await supabase.auth.signOut();
    navigate("/login");
  }

  // ===============================
  // ✅ NEW: Close on ESC key
  // ===============================
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // ===============================
  // ✅ NEW: Swipe left to close (mobile)
  // ===============================
  useEffect(() => {
    let startX = 0;

    function handleTouchStart(e) {
      startX = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
      if (!open) return;
      const currentX = e.touches[0].clientX;
      if (startX - currentX > 60) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [open]);

  // ===============================
  // ✅ NEW: Phone back button closes menu first
  // ===============================
  useEffect(() => {
    if (!open) return;

    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      setOpen(false);
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [open]);

  return (
    <>
      {/* === Hamburger Button === */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Open Menu"
      >
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-slate-800 dark:bg-slate-200"></span>
          <span className="block w-6 h-0.5 bg-slate-800 dark:bg-slate-200"></span>
          <span className="block w-6 h-0.5 bg-slate-800 dark:bg-slate-200"></span>
        </div>
      </button>

      {/* === Overlay + Sidebar === */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="
                fixed top-0 left-0 h-full w-72 z-50
                bg-white dark:bg-slate-900
                text-slate-900 dark:text-slate-100
                shadow-xl border-r border-slate-200 dark:border-slate-800
              "
            >
              {/* === User Header === */}
              {/* === Header with Close Button === */}
<div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
  
  {/* User Info */}
  <div className="flex items-center gap-3">
    <img
      src={avatar}
      alt="avatar"
      className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700"
    />
    <div>
      <p className="text-xs text-slate-500">Signed in as</p>
      <p className="font-semibold">{displayName}</p>
    </div>
  </div>

</div>


              {/* === Links === */}
              <nav className="p-3 space-y-1 text-sm">
                <NavItem to="/" label="Dashboard" navLinkClass={navLinkClass} close={() => setOpen(false)} />
                <NavItem to="/expenses" label="Expenses" navLinkClass={navLinkClass} close={() => setOpen(false)} />
                <NavItem to="/add" label="Add Expense" navLinkClass={navLinkClass} close={() => setOpen(false)} />
                <NavItem to="/budget" label="Budget" navLinkClass={navLinkClass} close={() => setOpen(false)} />
                <NavItem to="/reports" label="Reports" navLinkClass={navLinkClass} close={() => setOpen(false)} />
                <NavItem to="/categories" label="Categories" navLinkClass={navLinkClass} close={() => setOpen(false)} />
                <NavItem to="/settings" label="Settings" navLinkClass={navLinkClass} close={() => setOpen(false)} />
              </nav>

              {/* === Logout === */}
              <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 dark:border-slate-800 p-4">
                <button
                  onClick={handleLogout}
                  className="
                    w-full text-left text-red-600 dark:text-red-400
                    font-semibold text-sm
                    hover:bg-red-50 dark:hover:bg-red-900/30
                    px-3 py-2 rounded
                  "
                >
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* === Nav Item Component === */
function NavItem({ to, label, navLinkClass, close }) {
  return (
    <Link
      to={to}
      onClick={close}
      className={`block px-3 py-2 rounded transition ${navLinkClass(to)}`}
    >
      {label}
    </Link>
  );
}
