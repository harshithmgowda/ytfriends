import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `block rounded-2xl px-4 py-3 text-sm transition ${
    isActive ? "bg-brand-500 text-white shadow-glow" : "bg-white/5 text-zinc-300 hover:bg-white/10"
  }`;

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="ui-surface sticky top-24 p-4">
      <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-brand-500/20 via-brand-500/10 to-transparent p-4">
       <div className="flex items-center gap-3">
         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-lg font-black text-white shadow-glow">
           ▶
         </div>
         <div>
           <p className="ui-section-label">Quick access</p>
           <h3 className="mt-1 text-lg font-semibold text-white">Command center</h3>
         </div>
       </div>
       <p className="mt-3 text-sm text-zinc-300">Move through the app without losing the room, the chat, or the vibe.</p>
      </div>

      <div className="mt-4 space-y-3">
       <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
       <NavLink to="/feed" className={linkClass}>Feed</NavLink>
       <NavLink to="/chat" className={linkClass}>Chat</NavLink>
       <NavLink to="/room/demo-room" className={linkClass}>Watch Room</NavLink>
      </div>

      <div className="mt-4 space-y-3">
       <div className="ui-panel p-4">
         <p className="ui-section-label">Account</p>
         <p className="mt-2 text-sm font-medium text-white">{user?.name || "Guest"}</p>
         <p className="mt-1 text-sm text-zinc-400">{user?.bio || "Ready for the next session."}</p>
       </div>

       <div className="ui-panel p-4">
         <p className="text-sm font-semibold text-white">Tip</p>
         <p className="mt-1 text-sm text-zinc-400">Drop in a room key from your host to open the shared session instantly.</p>
       </div>
      </div>
    </aside>
  );
};

export default Sidebar;
