import { useNavigate } from "react-router-dom";

export default function FloatingAddButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/add")}
      aria-label="Add Expense"
      className="
        fixed bottom-6 right-6
        md:bottom-8 md:right-8
        z-50
        w-14 h-14 rounded-full
        bg-teal-500 hover:bg-teal-600
        shadow-lg
        flex items-center justify-center
        active:scale-95 transition
      "
    >
      {/* Horizontal line */}
      <span className="absolute w-6 h-[3px] bg-white rounded-full" />

      {/* Vertical line */}
      <span className="absolute w-[3px] h-6 bg-white rounded-full" />
    </button>
  );
}
