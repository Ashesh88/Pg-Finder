import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          PG<span className="text-gray-800">Finder</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/listings" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Listings
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Dashboard
              </Link>
              <span className="text-gray-500 text-sm">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;