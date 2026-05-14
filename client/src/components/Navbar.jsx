import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive ? "bg-brand-500 text-white shadow-glow" : "text-zinc-300 hover:bg-white/10"
  }`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-lg font-black text-white shadow-glow">
            ▶
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-300">WatchParty</p>
            <p className="text-xs text-zinc-400">Sync, chat, and vibe together</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          <NavLink to="/feed" className={navClass}>Feed</NavLink>
          <NavLink to="/chat" className={navClass}>Chat</NavLink>
          <NavLink to="/room/demo-room" className={navClass}>Room</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-bold">
                {user.name?.slice(0, 1).toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-200 transition hover:bg-brand-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

