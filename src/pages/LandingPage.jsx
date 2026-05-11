import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  Users,
  UserRoundPlus,
  LogIn,
  Zap,
  ShieldCheck,
  Home,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white selection:bg-brand-teal selection:text-white overflow-hidden">
      {/* Background Decorative Icons */}
      <div className="fixed top-[15%] left-[10%] text-brand-teal/5 rotate-12 animate-bounce transition-all duration-1000 -z-0">
        <Home size={120} />
      </div>
      <div
        className="fixed bottom-[20%] right-[10%] text-brand-green/5 -rotate-12 animate-bounce transition-all duration-1000 -z-0"
        style={{ animationDelay: "0.5s" }}
      >
        <CheckCircle size={100} />
      </div>

      {/* Navigation */}
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

     
        
      

      


      
    </div>
  );
};

export default LandingPage;
