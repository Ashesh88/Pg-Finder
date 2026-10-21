import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-zinc-50/50">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white">PGFinder</span>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero Brokerage Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Rent without the friction.
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Access thousands of verified hostels, rooms, and apartments directly managed by verified property hosts across India.
          </p>

          <div className="space-y-3">
            {[
              'Direct communication with verified hosts',
              'Transparent lease terms and zero brokerage fee',
              'Real-time availability and inquiries telemetry',
            ].map((text) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-medium">
          Trusted by over 10,000 tenants nationwide
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 mb-1">Sign In</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mb-6">Access your tenant inquiries or manage host listings</p>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition"
                placeholder="name@domain.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-xl transition text-xs sm:text-sm disabled:opacity-50 shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            New to PGFinder?{' '}
            <Link to="/register" className="font-semibold text-zinc-900 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
