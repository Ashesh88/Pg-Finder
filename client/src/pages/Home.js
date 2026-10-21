import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Zap, HandCoins, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Active Verified Listings', value: '2,400+' },
  { label: 'Metro Hubs Covered', value: '8 Cities' },
  { label: 'Verified Tenants Placed', value: '10,000+' },
  { label: 'Brokerage Fee', value: '0%' },
];

const features = [
  {
    icon: ShieldCheck,
    title: '100% Verified Properties',
    desc: 'Every PG, flat, and co-living room is audited on-site for security, hygiene, and amenities.',
  },
  {
    icon: HandCoins,
    title: 'Zero Brokerage Policy',
    desc: 'Connect directly with verified property owners. Eliminate intermediate agent commissions permanently.',
  },
  {
    icon: Zap,
    title: 'Direct Instant Inquiries',
    desc: 'Send inquiries directly to owners with live tracking and expedited response SLAs.',
  },
];

const popularCities = ['Noida', 'Gurgaon', 'Bangalore', 'Pune', 'Hyderabad', 'Mumbai'];

const Home = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchCity.trim()) {
      navigate('/listings?city=' + encodeURIComponent(searchCity.trim()));
    } else {
      navigate('/listings');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-950 text-white">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-32 md:pb-40">
          <div className="max-w-3xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-300 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Rental Marketplace across India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Find verified PGs & flats,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                without the broker.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-10 max-w-2xl">
              Transparent rental housing built for modern professionals and students. Connect directly with authentic property owners across India.
            </p>

            {/* Floating Search Bar */}
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/15 p-2 rounded-2xl max-w-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Enter city or locality (e.g., Noida, Sector 62)..."
                  className="w-full bg-transparent text-white placeholder-zinc-400 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-7 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Quick Cities Chips */}
            <div className="mt-8 flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mr-1">Popular:</span>
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => navigate('/listings?city=' + city)}
                  className="text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white px-3 py-1.5 rounded-lg transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">{s.value}</div>
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-3">Enterprise Standard Living</h2>
          <p className="text-3xl font-bold tracking-tight text-zinc-900">Engineered for seamless tenant discovery</p>
          <p className="text-zinc-500 text-sm mt-3">We eliminate traditional brokerage friction with end-to-end transparency and verified listings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white border border-zinc-200/80 rounded-3xl p-8 hover:border-zinc-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{feat.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 sm:p-14 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Are you a property owner?</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              List your PG, flat, or room to reach thousands of verified tenants daily with real-time inquiry management and zero listing fee.
            </p>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="flex-shrink-0 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2 text-sm shadow-md"
          >
            <span>List Your Property</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
