import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-2xl px-4 py-3 text-sm transition ${
    isActive ? "bg-brand-500 text-white shadow-glow" : "bg-white/5 text-zinc-300 hover:bg-white/10"
  }`;

const Sidebar = () => {
  return (
    <aside className="ui-surface sticky top-24 p-4">
      <div className="rounded-2xl bg-gradient-to-br from-brand-500/20 via-brand-500/10 to-transparent p-4">
        <p className="ui-kicker">Quick access</p>
        <h3 className="mt-2 text-lg font-semibold text-white">Your command center</h3>
        <p className="mt-1 text-sm text-zinc-400">Jump between rooms, chat, and the feed without losing context.</p>
      </div>

      <div className="mt-4 space-y-3">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/feed" className={linkClass}>Feed</NavLink>
        <NavLink to="/chat" className={linkClass}>Chat</NavLink>
        <NavLink to="/room/demo-room" className={linkClass}>Watch Room</NavLink>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
        <p className="text-sm font-semibold text-white">Tip</p>
        <p className="mt-1 text-sm text-zinc-400">Use the room key from your host to open the shared session instantly.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
