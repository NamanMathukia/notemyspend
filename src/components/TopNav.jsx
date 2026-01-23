import { Link } from "react-router-dom";
import AppNav from "./AppNav";

export default function TopNav({ user }) {
  return (
<header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center px-4 py-3">

        {/* Mobile Hamburger */}
        <AppNav user={user} />

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-teal-600">

          NotemySpend
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex ml-8 items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-teal-600">Dashboard</Link>
          <Link to="/add" className="hover:text-teal-600">Add</Link>
          <Link to="/expenses" className="hover:text-teal-600">Expenses</Link>
          <Link to="/budget" className="hover:text-teal-600">Budget</Link>   {/* ← added */}
          <Link to="/reports" className="hover:text-teal-600">Reports</Link>
          <Link to="/categories" className="hover:text-teal-600">Categories</Link>
          <Link to="/settings" className="hover:text-teal-600">Settings</Link>
        </nav>


        {/* User Avatar */}
        <div className="ml-auto flex items-center gap-3">
          {user && (
            <img
              src={
                user.user_metadata?.avatar_url ||
                "https://ui-avatars.com/api/?name=User"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
        </div>
      </div>
    </header>
  );
}
