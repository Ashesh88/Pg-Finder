import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, X, ArrowUpRight } from 'lucide-react';
import API from '../api';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ city: '', type: '', gender: '', furnishing: '', minRent: '', maxRent: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const city = searchParams.get('city') || '';
    setFilters({ city, type: '', gender: '', furnishing: '', minRent: '', maxRent: '' });
  }, [searchParams]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v)
        );
        const { data } = await API.get('/listings', { params });
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [filters]);

  const clearFilters = () => {
    setFilters({ city: '', type: '', gender: '', furnishing: '', minRent: '', maxRent: '' });
    navigate('/listings');
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-20">
      {/* Header & Filter Bar */}
      <div className="bg-white border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8 py-6 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">Explore Properties</h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Verified homes, PGs, and apartments with transparent rental terms</p>
            </div>
            
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 bg-zinc-50 text-zinc-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showFilters ? 'Hide Filters' : 'Filter Search'}</span>
            </button>
          </div>

          {/* Desktop Filter Row */}
          <div className="hidden md:flex items-center gap-3 flex-wrap pt-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by city..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full bg-zinc-50/70 border border-zinc-200/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-zinc-800 outline-none focus:bg-white focus:border-zinc-400 transition"
              />
            </div>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-700 outline-none focus:bg-white focus:border-zinc-400 transition"
            >
              <option value="">All Types</option>
              <option value="PG">PG</option>
              <option value="flat">Flat</option>
              <option value="room">Room</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-700 outline-none focus:bg-white focus:border-zinc-400 transition"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Unisex / Any</option>
            </select>

            <select
              value={filters.furnishing}
              onChange={(e) => setFilters({ ...filters, furnishing: e.target.value })}
              className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-700 outline-none focus:bg-white focus:border-zinc-400 transition"
            >
              <option value="">Furnishing</option>
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>

            <input
              type="number"
              placeholder="Min Rent"
              value={filters.minRent}
              onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
              className="w-28 bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-700 outline-none focus:bg-white focus:border-zinc-400 transition"
            />

            <input
              type="number"
              placeholder="Max Rent"
              value={filters.maxRent}
              onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
              className="w-28 bg-zinc-50/70 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-700 outline-none focus:bg-white focus:border-zinc-400 transition"
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-zinc-500 hover:text-red-600 transition flex items-center gap-1 px-2 py-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-zinc-100">
              <input
                type="text"
                placeholder="City..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="">All Types</option>
                  <option value="PG">PG</option>
                  <option value="flat">Flat</option>
                  <option value="room">Room</option>
                </select>

                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="any">Unisex</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Rent"
                  value={filters.minRent}
                  onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max Rent"
                  value={filters.maxRent}
                  onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs font-semibold text-red-600 text-left py-1">
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white border border-zinc-200 rounded-2xl h-80" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-1">No properties found</h3>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6">
              We couldn't find listings matching your filter criteria. Try adjusting the city or rent range.
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {listings.length} {listings.length === 1 ? 'property' : 'properties'} available
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate('/listings/' + item._id)}
                  className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-zinc-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {item.type}
                      </span>
                      <span className="bg-white/90 backdrop-blur-md text-zinc-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {item.gender === 'any' ? 'Unisex' : item.gender}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-8 h-8 rounded-full bg-white text-zinc-900 shadow-md flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-zinc-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-4">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                        <span className="truncate">{item.address?.city}, {item.address?.state}</span>
                      </div>

                      {item.amenities?.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-4">
                          {item.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="text-[11px] font-medium bg-zinc-50 text-zinc-600 border border-zinc-200/60 px-2.5 py-0.5 rounded-md">
                              {a}
                            </span>
                          ))}
                          {item.amenities.length > 3 && (
                            <span className="text-[11px] font-medium text-zinc-400 px-1 py-0.5">
                              +{item.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-zinc-900">
                          Rs {item.rent?.toLocaleString()}
                        </span>
                        <span className="text-zinc-400 text-xs ml-1 font-medium">/ month</span>
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {item.furnishing}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;
