import { supabase } from "../supabase";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

export default function Login() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-xl text-center space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-teal-600">
            NotemySpend
          </h1>
          <p className="text-slate-500 text-sm">
            Track expenses effortlessly
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
        >
          <Chrome size={20} />
          Sign in with Google
        </button>

        <p className="text-xs text-slate-400">
          Secure login powered by Supabase
        </p>
      </motion.div>
    </div>
  );
}
