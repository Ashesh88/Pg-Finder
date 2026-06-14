import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Active Listings', value: '2,400+' },
  { label: 'Cities Covered', value: '8' },
  { label: 'Happy Tenants', value: '10,000+' },
];

const features = [
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
    title: 'Verified Listings',
    desc: 'Every listing goes through a manual verification process before going live.',
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
    title: 'Zero Brokerage',
    desc: 'Connect directly with property owners. No middlemen, no hidden charges.',
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/1380/1380338.png',
    title: 'Instant Inquiry',
    desc: 'Send inquiries to owners and get responses within hours, not days.',
  },
];

const cities = ['Noida', 'Gurgaon', 'Bangalore', 'Pune', 'Hyderabad', 'Mumbai'];

const Home = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative text-white">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&auto=format&fit=crop"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 to-indigo-900/75" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-4">
            India's Fastest Growing Rental Platform
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5">
            Find Verified PGs & Flats <br />
            <span className="text-yellow-300">Near You. Instantly.</span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-10 max-w-xl">
            No brokerage. No fake listings. Just real homes, real owners, and a seamless renting experience.
          </p>

          {/* Search */}
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl shadow-2xl">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by city — Noida, Gurgaon..."
              className="flex-1 px-4 py-3 text-gray-700 outline-none rounded-xl text-sm"
            />
            <button
              onClick={() => navigate('/listings?city=' + searchCity)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
            >
              Search
            </button>
          </div>

          {/* Popular Cities */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-blue-300 text-sm">Popular:</span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => navigate('/listings?city=' + city)}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest text-center mb-3">
          Why PGFinder
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center">
          Renting made simple, transparent & fast
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition"
            >
              <img src={f.icon} alt={f.title} className="w-10 h-10 mb-5" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest text-center mb-3">
            How It Works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center">
            Get into your new home in 3 steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search', desc: 'Browse thousands of verified listings filtered by city, budget, and preferences.' },
              { step: '02', title: 'Inquire', desc: 'Send a direct inquiry to the owner. No broker involved, no commission.' },
              { step: '03', title: 'Move In', desc: 'Visit the property, finalize the deal, and move in on your schedule.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative text-white text-center py-24">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&auto=format&fit=crop"
          alt="cta"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/80" />
        <div className="relative px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to find your perfect home?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm md:text-base">
            Join thousands of tenants who found their ideal PG or flat through PGFinder.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/listings')}
              className="w-full md:w-auto bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Browse Listings
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full md:w-auto border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        2026 PGFinder. Built by <span className="text-blue-500 font-medium">Ashesh Singh</span>. All rights reserved.
      </div>
    </div>
  );
};

export default Home;