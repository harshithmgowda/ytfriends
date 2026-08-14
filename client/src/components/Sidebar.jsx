import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const links = [
  { to: "/dashboard",    label: "Dashboard", icon: "⊞" },
  { to: "/feed",         label: "Feed",       icon: "✦" },
  { to: "/chat",         label: "Chat",       icon: "◎" },
  { to: "/room/demo-room", label: "Watch Room", icon: "▶" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "text-white"
      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
  }`;

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside
      className="ui-surface sticky top-24 p-4 h-fit"
      style={{ minHeight: "unset" }}
    >
      {/* Header card */}
      <div
        className="relative overflow-hidden rounded-2xl p-4 mb-4"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.10))",
          border: "1px solid rgba(168,85,247,0.20)"
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-black text-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              boxShadow: "0 4px 16px rgba(168,85,247,0.40)"
            }}
          >
            ▶
          </div>
          <div>
            <p className="ui-section-label">Quick access</p>
            <h3 className="mt-0.5 text-base font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Command center
            </h3>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "rgba(161,153,195,0.80)" }}>
          Move through the app without losing your flow.
        </p>
        {/* Decorative orb */}
        <div
          className="absolute -right-6 -top-6 h-20 w-20 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)", filter: "blur(12px)" }}
        />
      </div>

      {/* Nav links */}
      <nav className="space-y-1 mb-4">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {({ isActive }) => (
              <>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm shrink-0 transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                          boxShadow: "0 2px 12px rgba(168,85,247,0.40)",
                        }
                      : { background: "rgba(255,255,255,0.05)" }
                  }
                >
                  {icon}
                </span>
                <span>{label}</span>
                {isActive && (
                  <span
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{ background: "#a855f7", boxShadow: "0 0 8px rgba(168,85,247,0.8)" }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="glow-divider mb-4" />

      {/* Account card */}
      <div className="ui-panel p-4 mb-3">
        <p className="ui-section-label mb-2">Account</p>
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              boxShadow: "0 2px 10px rgba(168,85,247,0.30)"
            }}
          >
            {user?.name?.slice(0, 1)?.toUpperCase() || "G"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.name || "Guest"}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(161,153,195,0.65)" }}>
              {user?.bio || "Ready for the next session."}
            </p>
          </div>
        </div>
      </div>

      {/* Tip card */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.07), rgba(168,85,247,0.05))",
          border: "1px solid rgba(251,191,36,0.12)"
        }}
      >
        <p className="text-xs font-semibold" style={{ color: "#fbbf24" }}>💡 Tip</p>
        <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "rgba(161,153,195,0.75)" }}>
          Drop in a room key from your host to open the shared session instantly.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
