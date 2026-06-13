import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop"
          alt="Modern apartment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/60 flex flex-col justify-between p-12 text-white">
          <div className="text-2xl font-bold">
            PG<span className="text-yellow-300">Finder</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Your next home is <br /> one click away.
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              Discover verified PGs, flats and rooms near your workplace or college. Zero brokerage, zero hassle.
            </p>
            <div className="space-y-3">
              {[
                '2,400+ verified listings across India',
                'Noida, Gurgaon, Bangalore and more',
                'Direct owner connect, no middlemen',
                'Zero brokerage, always',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-blue-300 text-sm">Trusted by 10,000+ tenants across India</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
          <div className="lg:hidden text-xl font-bold text-blue-600 mb-6">
            PG<span className="text-gray-800">Finder</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Login to continue to PGFinder</p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;