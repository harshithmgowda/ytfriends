import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-2xl px-4 py-3 text-sm transition ${
    isActive ? "bg-brand-500 text-white shadow-glow" : "bg-white/5 text-zinc-300 hover:bg-white/10"
  }`;

const Sidebar = () => {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-500/5 p-4">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Quick Access</p>
        <h3 className="mt-2 text-lg font-semibold text-white">Your command center</h3>
        <p className="mt-1 text-sm text-zinc-400">Manage rooms, chat, and your social feed from one place.</p>
      </div>

      <div className="space-y-3">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/feed" className={linkClass}>Feed</NavLink>
        <NavLink to="/chat" className={linkClass}>Chat</NavLink>
        <NavLink to="/room/demo-room" className={linkClass}>Watch Room</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

