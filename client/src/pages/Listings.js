import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Browse Listings</h1>
            {/* Mobile filter toggle */}
            <button
              className="md:hidden text-sm text-blue-600 font-medium border border-blue-200 px-3 py-1.5 rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>

          {/* Desktop filters — always visible */}
          <div className="hidden md:flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition"
            />
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition bg-white">
              <option value="">All Types</option>
              <option value="PG">PG</option>
              <option value="flat">Flat</option>
              <option value="room">Room</option>
            </select>
            <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition bg-white">
              <option value="">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
            <select value={filters.furnishing} onChange={(e) => setFilters({ ...filters, furnishing: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition bg-white">
              <option value="">Furnishing</option>
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
            <input type="number" placeholder="Min Rent" value={filters.minRent}
              onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition w-28" />
            <input type="number" placeholder="Max Rent" value={filters.maxRent}
              onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition w-28" />
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-red-500 transition px-2">Clear</button>
          </div>

          {/* Mobile filters — collapsible */}
          {showFilters && (
            <div className="md:hidden flex flex-col gap-3 mt-3">
              <input
                type="text"
                placeholder="City"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition w-full"
              />
              <div className="grid grid-cols-2 gap-3">
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition bg-white">
                  <option value="">All Types</option>
                  <option value="PG">PG</option>
                  <option value="flat">Flat</option>
                  <option value="room">Room</option>
                </select>
                <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition bg-white">
                  <option value="">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="any">Any</option>
                </select>
                <select value={filters.furnishing} onChange={(e) => setFilters({ ...filters, furnishing: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition bg-white">
                  <option value="">Furnishing</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
                <input type="number" placeholder="Min Rent" value={filters.minRent}
                  onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition" />
                <input type="number" placeholder="Max Rent" value={filters.maxRent}
                  onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <button onClick={clearFilters} className="text-sm text-red-500 font-medium text-left px-1">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No listings found. Try different filters.</div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{listings.length} listings found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  onClick={() => navigate('/listings/' + listing._id)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={listing.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop'}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        {listing.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={"text-xs font-semibold px-3 py-1 rounded-full shadow-sm " + (
                        listing.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                        listing.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                        'bg-green-100 text-green-700'
                      )}>
                        {listing.gender}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">{listing.title}</h3>
                    <p className="text-gray-500 text-sm mb-3">{listing.address?.city}, {listing.address?.state}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-blue-600 font-bold text-lg">Rs {listing.rent?.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs">/month</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{listing.furnishing}</span>
                    </div>
                    {listing.amenities?.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {listing.amenities.slice(0, 3).map((a) => (
                          <span key={a} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{a}</span>
                        ))}
                      </div>
                    )}
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