import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Failed to complete registration');
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
            <span>Direct Marketplace</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Join the verified rental network.
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Whether you are looking for a room near your university/office or managing property listings, PGFinder provides direct connectivity.
          </p>

          <div className="space-y-3">
            {[
              'Direct messaging and phone contact with hosts',
              'Zero broker mediation or hidden commission',
              'Transparent community reviews and ratings',
            ].map((text) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-medium">
          Zero-brokerage rental infrastructure across India
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 mb-1">Create Account</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mb-6">Register as a tenant or listing owner</p>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition"
                placeholder="Ashesh Singh"
                required
              />
            </div>

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
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition"
                placeholder="9876543210"
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

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'tenant', label: 'Tenant' },
                  { value: 'owner', label: 'Property Owner' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: item.value })}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                      form.role === item.value
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-xl transition text-xs sm:text-sm disabled:opacity-50 shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-zinc-900 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
