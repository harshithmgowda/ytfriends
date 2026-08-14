import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "text-white"
      : "text-zinc-400 hover:text-white hover:bg-white/5"
  }`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(7, 5, 17, 0.80)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 1px 0 rgba(168,85,247,0.08)"
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-black text-white transition-all duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              boxShadow: "0 4px 20px rgba(168,85,247,0.40)"
            }}
          >
            ▶
          </div>
          <div className="hidden sm:block">
            <p
              className="text-sm font-bold uppercase tracking-[0.2em]"
              style={{
                background: "linear-gradient(90deg, #c084fc, #93c5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              WatchParty
            </p>
            <p className="text-[11px] text-zinc-500 leading-tight">Sync · Chat · Vibe</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/feed",      label: "Feed"      },
              { to: "/chat",      label: "Chat"      },
              { to: "/room/demo-room", label: "Room" },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} className={navClass}>
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
                        style={{ background: "linear-gradient(90deg, #a855f7, #3b82f6)" }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <div
                className="hidden sm:flex items-center gap-3 rounded-xl px-3 py-2 border transition-all duration-200 hover:border-white/15"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.07)"
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    boxShadow: "0 2px 12px rgba(168,85,247,0.35)"
                  }}
                >
                  {user.name?.slice(0, 1).toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-[11px] text-zinc-500">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:text-white hover:scale-105"
                style={{
                  borderColor: "rgba(168,85,247,0.30)",
                  background: "rgba(168,85,247,0.08)",
                  color: "#d8b4fe"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="ui-button-primary text-sm"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
