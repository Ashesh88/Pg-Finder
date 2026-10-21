import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Users,
  Utensils,
  Wifi,
  Sparkles,
  ShieldCheck,
  Zap,
  BedDouble,
  Star,
  CheckCircle2,
  ArrowRight,
  Coffee,
  ChevronRight,
} from 'lucide-react';

const popularLocalities = [
  { city: 'Noida', area: 'Sector 62 (Tech Park)', count: '140+ Stays' },
  { city: 'Noida', area: 'Knowledge Park (Colleges)', count: '210+ Stays' },
  { city: 'Gurgaon', area: 'Cyber City & Phase 3', count: '180+ Stays' },
  { city: 'Gurgaon', area: 'Golf Course Road', count: '95+ Stays' },
  { city: 'Bangalore', area: 'Koramangala 5th Block', count: '320+ Stays' },
  { city: 'Bangalore', area: 'HSR Layout & Electronic City', count: '410+ Stays' },
];

const hotelStaysSample = [
  {
    id: 'sample-1',
    title: 'The Grand Ivory Co-Living & Luxury PG',
    location: 'Sector 62, Noida, Uttar Pradesh',
    type: 'Luxury PG',
    gender: 'Unisex',
    rating: '4.9',
    reviewCount: '142',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop',
    price: '8,500',
    originalPrice: '10,000',
    features: ['3 Home Cooked Meals', '200 Mbps Fiber WiFi', 'Daily Housekeeping', 'AC & Attached Bath'],
    tag: 'Trending Stay',
  },
  {
    id: 'sample-2',
    title: 'UrbanNest Executive Stay & Suites',
    location: 'DLF Phase 3, Cyber City, Gurgaon',
    type: 'Executive PG',
    gender: 'Male',
    rating: '4.8',
    reviewCount: '98',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop',
    price: '9,999',
    originalPrice: '12,500',
    features: ['Chef Prepared Meals', 'Gym & Lounge', 'Biometric Access', 'Power Backup 24/7'],
    tag: 'Near Metro',
  },
  {
    id: 'sample-3',
    title: 'Casa Bella Women Private Coliving',
    location: 'Koramangala, Bangalore, Karnataka',
    type: 'Premium PG',
    gender: 'Female',
    rating: '4.9',
    reviewCount: '215',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
    price: '11,200',
    originalPrice: '13,500',
    features: ['All Meals Included', '3-Tier Security', 'Washing Machines', 'Coworking Space'],
    tag: 'Top Rated for Women',
  },
];

const hotelAmenities = [
  {
    icon: Utensils,
    title: 'Fresh Hygienic Meals',
    desc: 'Nutritious homestyle breakfast, lunch, and dinner cooked fresh daily in sanitized kitchens.',
  },
  {
    icon: Wifi,
    title: 'High-Speed Fiber WiFi',
    desc: 'Dual-band unlimited internet connectivity dedicated for seamless remote work and gaming.',
  },
  {
    icon: Sparkles,
    title: 'Daily Housekeeping',
    desc: 'Regular room cleaning, sanitized washrooms, and automated linen changing service.',
  },
  {
    icon: ShieldCheck,
    title: '24/7 Biometric Security',
    desc: 'Digital smart lock entry, round-the-clock CCTV surveillance, and verified resident access.',
  },
  {
    icon: Zap,
    title: '100% Power Backup',
    desc: 'Uninterrupted power support for ACs, elevators, and charging stations without brownouts.',
  },
  {
    icon: Coffee,
    title: 'Cafes & Social Lounges',
    desc: 'Chic community lounges, terrace gardens, and gaming zones for relaxed evening downtime.',
  },
];

const occupancyTypes = [
  {
    title: 'Single Occupancy Room',
    desc: 'Your private peaceful sanctuary with dedicated work-desk and attached private bathroom.',
    price: 'Starts at Rs 12,000 / mo',
    badge: '100% Private',
    img: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=600&auto=format&fit=crop',
    type: 'room',
  },
  {
    title: 'Double Sharing Suite',
    desc: 'Spacious shared living with individual wardrobes, study stations, and split twin beds.',
    price: 'Starts at Rs 7,500 / mo',
    badge: 'Best Value',
    img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop',
    type: 'PG',
  },
  {
    title: 'Independent 1BHK / Flat',
    desc: 'Entire furnished apartment with modular kitchen, living hall, and zero owner interference.',
    price: 'Starts at Rs 18,000 / mo',
    badge: 'Full Freedom',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop',
    type: 'flat',
  },
];

const guestReviews = [
  {
    name: 'Rohan Sharma',
    role: 'Software Engineer @ Microsoft',
    city: 'Noida (Sector 62)',
    stay: 'Ivory Executive PG',
    rating: 5,
    comment: 'The stay feels like a boutique hotel rather than a typical PG. Fast WiFi, hot meals on time, and completely hassle-free move-in with zero brokerage.',
  },
  {
    name: 'Ananya Verma',
    role: 'Product Designer',
    city: 'Bangalore (Koramangala)',
    stay: 'Casa Bella Coliving',
    rating: 5,
    comment: 'Security is top tier. The rooms look exactly like the photos, the washrooms are spotless, and the host is genuinely helpful. Highly recommended!',
  },
  {
    name: 'Kartik Iyer',
    role: 'Analyst @ Deloitte',
    city: 'Gurgaon (Cyber Hub)',
    stay: 'UrbanNest Suites',
    rating: 5,
    comment: 'Zero broker nonsense. I booked directly after inspecting the photos and verified amenities. The food and laundry service made life super easy.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [stayType, setStayType] = useState('');
  const [gender, setGender] = useState('');

  const executeSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (stayType) params.append('type', stayType);
    if (gender) params.append('gender', gender);
    const qs = params.toString();
    navigate(qs ? `/listings?${qs}` : '/listings');
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 font-sans text-zinc-900">

      {/* Hero Hotel Booking Header */}
      <div className="relative bg-zinc-950 text-white overflow-hidden pb-32 pt-16 md:pt-24">
        {/* Ambient Backdrops */}
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&auto=format&fit=crop"
            alt="Hotel Luxury Ambience"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-zinc-200 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Over 2,400+ Verified Managed Stays Available</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-5">
            Book Premium PGs, Co-Living Stays <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              With Hotel-Grade Hospitality.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-12">
            Fully furnished air-conditioned rooms, hygienic daily meals, high-speed fiber internet, and professional housekeeping. Zero brokerage.
          </p>

          {/* Hotel-Style Booking Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-zinc-200/80 text-left">
            <form onSubmit={executeSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              {/* City / Locality */}
              <div className="bg-zinc-50 hover:bg-zinc-100/80 transition rounded-2xl p-3 border border-zinc-200/60">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1">
                  Destination City
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Noida, Gurgaon, Bangalore..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-zinc-800 outline-none placeholder-zinc-400"
                  />
                </div>
              </div>

              {/* Stay Type */}
              <div className="bg-zinc-50 hover:bg-zinc-100/80 transition rounded-2xl p-3 border border-zinc-200/60">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1">
                  Living Format
                </label>
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <select
                    value={stayType}
                    onChange={(e) => setStayType(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-zinc-800 outline-none cursor-pointer"
                  >
                    <option value="">All Formats</option>
                    <option value="PG">Co-Living / PG</option>
                    <option value="flat">Private Flat</option>
                    <option value="room">Private Room</option>
                  </select>
                </div>
              </div>

              {/* Gender Preference */}
              <div className="bg-zinc-50 hover:bg-zinc-100/80 transition rounded-2xl p-3 border border-zinc-200/60">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block mb-1">
                  Occupancy Group
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-zinc-800 outline-none cursor-pointer"
                  >
                    <option value="">Any (Male / Female)</option>
                    <option value="male">Boys / Male Only</option>
                    <option value="female">Girls / Female Only</option>
                    <option value="any">Unisex / Coliving</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Check Stays</span>
                </button>
              </div>
            </form>

            {/* Quick Micro Localities */}
            <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center gap-2 flex-wrap px-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Popular Hubs:</span>
              {popularLocalities.slice(0, 4).map((loc) => (
                <button
                  key={loc.area}
                  type="button"
                  onClick={() => navigate('/listings?city=' + loc.city)}
                  className="text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1 rounded-lg transition"
                >
                  {loc.area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-md p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="border-r border-zinc-100 last:border-none">
            <div className="text-xl sm:text-2xl font-extrabold text-zinc-900">0%</div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Brokerage Always</div>
          </div>
          <div className="border-r border-zinc-100 last:border-none">
            <div className="text-xl sm:text-2xl font-extrabold text-zinc-900">100%</div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Verified Properties</div>
          </div>
          <div className="border-r border-zinc-100 last:border-none">
            <div className="text-xl sm:text-2xl font-extrabold text-zinc-900">3 Meals</div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fresh Daily Food</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-zinc-900">24/7</div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Support & Security</div>
          </div>
        </div>
      </div>

      {/* Featured / Trending Hotel PG Stays */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-extrabold text-blue-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Hospitality</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Featured Premium Stays</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">High-demand properties with verified amenities, chef kitchens, and high ratings</p>
          </div>

          <button
            onClick={() => navigate('/listings')}
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 hover:text-blue-600 transition"
          >
            <span>See All 2,400+ Stays</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotelStaysSample.map((stay) => (
            <div
              key={stay.id}
              onClick={() => navigate('/listings')}
              className="bg-white rounded-3xl border border-zinc-200/80 hover:border-zinc-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/11] bg-zinc-100 overflow-hidden">
                <img
                  src={stay.image}
                  alt={stay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {stay.tag}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {stay.gender}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 text-xs font-bold text-zinc-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{stay.rating}</span>
                  <span className="text-zinc-400 text-[10px]">({stay.reviewCount})</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {stay.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-zinc-500 mb-4 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                    <span>{stay.location}</span>
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {stay.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-zinc-900">Rs {stay.price}</span>
                      <span className="text-xs text-zinc-400 font-medium">/ month</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 line-through">Rs {stay.originalPrice}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-zinc-900 group-hover:bg-blue-600 px-3.5 py-2 rounded-xl transition-colors shadow-sm">
                    <span>Reserve</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Grade Inclusions Grid */}
      <div className="bg-white border-y border-zinc-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-blue-600 mb-2">Hospitality Standards</h2>
            <p className="text-3xl font-extrabold tracking-tight text-zinc-900">Included in Every Booking</p>
            <p className="text-zinc-500 text-xs sm:text-sm mt-2">Zero hidden charges. Everything you need for a comfortable stay is baked into the rent.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotelAmenities.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={amenity.title}
                  className="bg-zinc-50/70 border border-zinc-200/80 rounded-3xl p-6 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 mb-2">{amenity.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{amenity.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Occupancy Formats (Single, Twin, Studio) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-blue-600 mb-2">Living Formats</h2>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900">Choose Your Room Category</p>
          <p className="text-zinc-500 text-xs sm:text-sm mt-2">Tailored options whether you prioritize complete privacy or budget-friendly co-living.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {occupancyTypes.map((occ) => (
            <div
              key={occ.title}
              onClick={() => navigate('/listings?type=' + occ.type)}
              className="group bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                <img
                  src={occ.img}
                  alt={occ.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {occ.badge}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-4">{occ.desc}</p>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-600">{occ.price}</span>
                  <span className="text-xs font-bold text-zinc-900 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>View Stays</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Reviews & Social Proof */}
      <div className="bg-zinc-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-blue-400 mb-2">Verified Resident Voices</h2>
            <p className="text-3xl font-extrabold tracking-tight text-white">Loved by 10,000+ Tenants</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guestReviews.map((rev) => (
              <div key={rev.name} className="bg-zinc-800/80 border border-zinc-700/80 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-700/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-white">{rev.name}</p>
                    <p className="text-[11px] text-zinc-400">{rev.role}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800/60">
                    {rev.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Host / Owner CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 text-white p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white mb-4 inline-block">
              Host Onboarding
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Own a building or PG property?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              List your property on PGFinder Stays to reach 10,000+ verified corporate professionals and students monthly. Manage bookings with zero listing fee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-zinc-900 hover:bg-zinc-100 font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl transition shadow-md"
            >
              List Your Property Free
            </button>
            <button
              onClick={() => navigate('/listings')}
              className="border border-white/30 text-white hover:bg-white/10 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition text-center"
            >
              Explore Stays
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-extrabold text-zinc-900">PGFinder Stays</span>
            <span>&bull; Hospitality & Co-Living Platform</span>
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
