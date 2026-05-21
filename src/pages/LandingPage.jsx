import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  PiggyBank,
  UserRoundPlus,
  LogIn,
  ClipboardList,
  TreePalm,
  Home,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white selection:bg-brand-teal selection:text-white overflow-hidden">
      {/* Iconos de fondo */}
      <div className="fixed top-[15%] left-[10%] text-brand-teal/5 rotate-12 animate-bounce transition-all duration-1000 z-0">
        <Home size={120} />
      </div>
      <div
        className="fixed bottom-[20%] right-[10%] text-brand-green/5 -rotate-12 animate-bounce transition-all duration-1000 z-0"
        style={{ animationDelay: "0.5s" }}
      >
        <CheckCircle size={100} />
      </div>

      {/* Navegación */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 relative drop-shadow-sm">
            <img
              src="/Vives.png"
              alt="Vives Logo"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform rounded-2xl"
            />
          </div>
          <span className="text-2xl font-bold font-outfit text-slate-900">
            Vives House
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2.5 text-slate-600 font-semibold hover:text-brand-teal transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </nav>
      {/* principal */}
      <header className="relative z-10 pt-16 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/5 border border-brand-teal/10 rounded-full text-brand-teal font-bold text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
            </span>
            The Definitive Solution for Shared Living
          </div>

          <h1 className="text-5xl md:text-8xl font-black font-outfit text-slate-900 leading-tight tracking-tight">
            Living together,
            <br />
            <span className="bg-linear-to-r from-brand-teal to-brand-green text-transparent bg-clip-text">
              no chaos, Vives House.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Organize expenses, divide chores and keep the peace at home. All in
            one transparent and easy to use application.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-linear-to-r from-brand-teal to-brand-green text-white rounded-2xl font-bold text-xl shadow-2xl shadow-brand-teal/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Create an Account
              <UserRoundPlus />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-300 shadow-sm rounded-2xl font-bold text-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Log in
              <LogIn />
            </Link>
          </div>
        </div>
      </header>
      {/* características */}
      <section className="relative z-10 py-32 bg-slate-100 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal">
                <PiggyBank size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Track Expenses
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Add bills, split costs proportionally, and keep a transparent history of who owes what. Zero debt, zero stress.
              </p>
            </div>

            <div className="space-y-6 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                <ClipboardList size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Manages Chores
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Assign tasks, set reminders, and maintain a clean home effortlessly. No more guessing whose turn it is to clean.
              </p>
            </div>

            <div className="space-y-6 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal">
                <TreePalm  size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Peace of Mind
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Total transparency for all house members. Because living together should be about fun, not arguments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 text-center text-slate-400 text-sm">
        <p>© 2026 Vives House. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
