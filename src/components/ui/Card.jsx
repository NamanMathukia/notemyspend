export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-100
        rounded-xl shadow p-4
        border border-slate-100 dark:border-slate-700
        ${className}
      `}
    >
      {children}
    </div>
  );
}
