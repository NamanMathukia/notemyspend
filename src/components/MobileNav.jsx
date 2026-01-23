import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, List, BarChart2 } from "lucide-react";

export default function MobileNav() {
  // Safety check: if Router not ready, don't render nav
  let location;
  try {
    location = useLocation();
  } catch {
    return null;
  }

  const pathname = location.pathname;

  const linkClass = (path) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? "text-teal-600" : "text-slate-500"
    }`;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t">
      <div className="flex justify-around py-2">

        <Link to="/" className={linkClass("/")}>
          <Home size={20} />
          Dashboard
        </Link>

        <Link to="/expenses" className={linkClass("/expenses")}>
          <List size={20} />
          Expenses
        </Link>

        <Link to="/add" className={linkClass("/add")}>
          <PlusCircle size={20} />
          Add
        </Link>

        <Link to="/reports" className={linkClass("/reports")}>
          <BarChart2 size={20} />
          Reports
        </Link>

      </div>
    </div>
  );
}
