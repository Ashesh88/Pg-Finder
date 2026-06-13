import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tenant', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/register', form);
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
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop"
          alt="Beautiful apartment interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-blue-900/60 flex flex-col justify-between p-12 text-white">
          <div className="text-2xl font-bold">
            PG<span className="text-yellow-300">Finder</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Join 10,000+ tenants <br /> finding homes daily.
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              Create your free account and get instant access to the best PGs and flats near you.
            </p>
            <div className="space-y-3">
              {[
                'Browse unlimited verified listings',
                'Send direct inquiries to owners',
                'Read and write honest reviews',
                'Free forever for tenants',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-blue-300 text-sm">No credit card needed. Free forever for tenants.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
          <div className="lg:hidden text-xl font-bold text-blue-600 mb-6">
            PG<span className="text-gray-800">Finder</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-6">Start finding your perfect home today</p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                placeholder="Ashesh Singh"
                required
              />
            </div>
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
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                placeholder="9999999999"
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
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'tenant', label: 'Tenant' },
                  { value: 'owner', label: 'Owner' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`py-3 rounded-xl text-sm font-medium border transition ${
                      form.role === r.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;