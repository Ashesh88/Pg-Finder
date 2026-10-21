import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  Building2,
  CheckCircle2,
  XCircle,
  Home as HomeIcon,
  BedDouble,
  KeyRound,
} from 'lucide-react';

const stats = [
  { label: 'Active Verified Listings', value: '2,400+' },
  { label: 'Metros Covered', value: '8 Cities' },
  { label: 'Verified Tenants Placed', value: '10,000+' },
  { label: 'Brokerage Commission', value: 'Rs 0' },
];

const categories = [
  {
    icon: BedDouble,
    type: 'PG',
    title: 'Co-Living & PGs',
    desc: 'Fully serviced accommodations with food, daily housekeeping, high-speed WiFi, and power backup.',
    badge: 'Popular for Students & Pros',
    query: 'type=PG',
  },
  {
    icon: Building2,
    type: 'flat',
    title: 'Private Flats & 1BHK',
    desc: 'Independent apartments without landlord restrictions. Ideal for couples, working pros, and friends.',
    badge: 'Full Privacy',
    query: 'type=flat',
  },
  {
    icon: HomeIcon,
    type: 'room',
    title: 'Shared & Private Rooms',
    desc: 'Budget-conscious shared living spaces in prime localities near corporate parks and universities.',
    badge: 'Budget Friendly',
    query: 'type=room',
  },
];

const featuredCities = [
  {
    name: 'Noida',
    listings: '840+ properties',
    hubs: 'Sector 62, 18, Expressway',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop',
  },
  {
    name: 'Gurgaon',
    listings: '620+ properties',
    hubs: 'Cyber City, Golf Course Rd, Sec 48',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop',
  },
  {
    name: 'Bangalore',
    listings: '1,150+ properties',
    hubs: 'Koramangala, HSR, Whitefield',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop',
  },
  {
    name: 'Pune',
    listings: '490+ properties',
    hubs: 'Hinjewadi, Viman Nagar, Kharadi',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop',
  },
];

const comparison = [
  {
    feature: 'Brokerage Fee',
    pgfinder: 'Rs 0 (Always Free)',
    traditional: '1 to 2 Months Rent',
  },
  {
    feature: 'Listing Authenticity',
    pgfinder: '100% Verified on-site with real photos',
    traditional: 'Stock photos & bait-and-switch listings',
  },
  {
    feature: 'Owner Contact',
    pgfinder: 'Direct phone & instant messaging',
    traditional: 'Hidden behind middlemen and agents',
  },
  {
    feature: 'Deposit Transparency',
    pgfinder: 'Explicit deposit terms stated upfront',
    traditional: 'Hidden deductions and arbitrary demands',
  },
];

const steps = [
  {
    step: '01',
    title: 'Search & Refine',
    desc: 'Filter properties by city, gender, furnishing, and exact budget without spammy duplicates.',
  },
  {
    step: '02',
    title: 'Inspect & Verify',
    desc: 'Review high-resolution photographs, verified amenities checklists, and community tenant ratings.',
  },
  {
    step: '03',
    title: 'Connect & Move In',
    desc: 'Call the verified property owner directly, schedule an on-site visit, and move in with zero broker fee.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchCity.trim()) params.append('city', searchCity.trim());
    if (selectedType) params.append('type', selectedType);
    const queryString = params.toString();
    navigate(queryString ? `/listings?${queryString}` : '/listings');
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-950 text-white">
        {/* Glow Gradients */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-32 md:pb-40">
          <div className="max-w-3xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-300 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Rental Marketplace across India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Find verified PGs & flats,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                without the broker.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-10 max-w-2xl font-normal">
              Transparent rental housing built for modern professionals and university students. Connect directly with authentic property owners with zero commission.
            </p>

            {/* Floating Glass Search Hub */}
            <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/15 p-2 rounded-2xl max-w-2xl shadow-2xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Enter city or locality (e.g. Noida, Gurgaon)..."
                  className="w-full bg-transparent text-white placeholder-zinc-400 text-sm outline-none font-medium"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-white/20" />

              <div className="px-3 py-2 sm:py-0">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="" className="text-zinc-900">All Types</option>
                  <option value="PG" className="text-zinc-900">PG</option>
                  <option value="flat" className="text-zinc-900">Flat</option>
                  <option value="room" className="text-zinc-900">Room</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-7 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Quick Cities Chips */}
            <div className="mt-8 flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mr-1">Popular:</span>
              {['Noida', 'Gurgaon', 'Bangalore', 'Pune', 'Hyderabad', 'Mumbai'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => navigate('/listings?city=' + city)}
                  className="text-xs font-medium text-zinc-300 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:text-white px-3 py-1.5 rounded-lg transition"
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
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">Housing Solutions</h2>
            <p className="text-3xl font-extrabold tracking-tight text-zinc-900">Browse by Living Style</p>
          </div>
          <button
            onClick={() => navigate('/listings')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-blue-600 transition"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.type}
                onClick={() => navigate('/listings?' + c.query)}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl p-8 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{c.title}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-6">{c.desc}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  <span>Explore {c.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Cities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">Prime Localities</h2>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900">Explore Top Metro Hubs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCities.map((city) => (
            <div
              key={city.name}
              onClick={() => navigate('/listings?city=' + city.name)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={city.img}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">{city.listings}</span>
                <h3 className="text-2xl font-extrabold tracking-tight mb-1">{city.name}</h3>
                <p className="text-zinc-300 text-xs line-clamp-1">{city.hubs}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Step Process */}
      <div className="bg-white border-y border-zinc-200/80 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-3">How PGFinder Works</h2>
            <p className="text-3xl font-extrabold tracking-tight text-zinc-900">Move in 3 seamless steps</p>
            <p className="text-zinc-500 text-sm mt-3">From searching to signing your lease, we removed all unwanted intermediate friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => (
              <div key={st.step} className="p-8 rounded-3xl bg-zinc-50/70 border border-zinc-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-4xl font-extrabold tracking-tight text-blue-600/30 mb-6 font-mono">{st.step}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{st.title}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Grid (PGFinder vs Traditional Brokers) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-3">The Modern Advantage</h2>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900">Why Renters Choose PGFinder</p>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-50/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Feature</th>
                  <th className="px-6 py-4 font-bold text-blue-600 bg-blue-50/50">PGFinder</th>
                  <th className="px-6 py-4 font-bold">Traditional Real Estate Brokers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {comparison.map((row) => (
                  <tr key={row.feature} className="hover:bg-zinc-50/30 transition">
                    <td className="px-6 py-4 font-bold text-zinc-900">{row.feature}</td>
                    <td className="px-6 py-4 text-emerald-700 bg-blue-50/20 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{row.pgfinder}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <XCircle className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Host CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-14 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-semibold mb-4">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>For Property Owners & Landlords</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">List your property with zero overhead</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Showcase your PG or flat to over 10,000 monthly active tenants. Manage inquiries, filter prospective tenants, and track availability from your personal host dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-7 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/listings')}
              className="border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-bold px-5 py-3.5 rounded-xl transition text-xs sm:text-sm text-center"
            >
              <span>Explore Marketplace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-bold text-zinc-900">PGFinder</span>
            <span>&bull; Direct Rental Housing Platform</span>
          </div>
          <div>
            Built with modern MERN architecture &bull; Zero Brokerage Guarantee
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
