import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

/**
 * Corrected NavLink styling for Dark Mode.
 * Switched from light slate to high-contrast white and indigo.
 */
function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300",
    isActive 
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" 
      : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
  ].join(" ");
}

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* 
        Sticky Header with Obsidian Glassmorphism:
        Uses slate-950/40 to let the App.tsx dark gradient peek through.
      */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          
          {/* Logo Section - Professional White/Indigo Contrast */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Team<span className="text-indigo-500">Task</span>
            </span>
          </Link>

          {/* Navigation Items - Dark Mode Filter Bar aesthetic */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1 rounded-2xl border border-slate-800/50">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>
          </nav>

          {/* Profile & Logout Section */}
          <div className="flex items-center gap-5">
            <div className="hidden text-right lg:block">
              <div className="text-sm font-bold text-slate-100">{user?.email?.split('@')[0]}</div>
              <div className="flex justify-end pt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-500/20">
                  {user?.role}
                </span>
              </div>
            </div>
            
            <button
              className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all active:scale-95"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <span>Logout</span>
              <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}