import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Menu, X, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'User';
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-baseline font-bold tracking-tight text-xl text-zinc-900">
              <span>PG</span>
              <span className="text-blue-600 font-extrabold">Finder</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/listings"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive('/listings') ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Listings</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-zinc-200">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200/80 rounded-full py-1 px-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    {displayName[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">{displayName}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-200/80 text-zinc-600">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-zinc-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-zinc-200">
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/listings"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Explore Listings</span>
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Dashboard ({user.role})</span>
              </Link>
              <div className="pt-2 border-t border-zinc-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-medium text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
