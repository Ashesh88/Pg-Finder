import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  ArrowLeft,
  Star,
  CheckCircle2,
  XCircle,
  Send,
  ShieldCheck,
} from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Hi, I'm interested in this property. Is it available for immediate move-in?");
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    fetchListing();
    fetchReviews();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await API.get('/listings/' + id);
      setListing(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/reviews/listing/' + id);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquiry = async () => {
    if (!user) return navigate('/login');
    setInquiryLoading(true);
    try {
      await API.post('/inquiries', { listing: id, message });
      setInquirySent(true);
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmittingReview(true);
    setReviewMsg('');
    try {
      await API.post('/reviews', { listing: id, rating: Number(rating), comment });
      setReviewMsg('Your review has been verified and published.');
      setComment('');
      fetchReviews();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <p className="text-zinc-500 text-sm mb-4">Property listing not found</p>
        <button
          onClick={() => navigate('/listings')}
          className="text-xs font-semibold text-zinc-900 bg-white border border-zinc-200 px-4 py-2 rounded-xl"
        >
          Return to Listings
        </button>
      </div>
    );
  }

  const images = listing.images?.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop'];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/listings')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm">
              <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                <img
                  src={images[activeImg]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-zinc-100 bg-zinc-50/50">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                        activeImg === i ? 'border-zinc-900 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      {listing.type}
                    </span>
                    <span className="bg-zinc-100 text-zinc-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      {listing.gender === 'any' ? 'Unisex' : listing.gender}
                    </span>
                    <span className="bg-zinc-100 text-zinc-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      {listing.furnishing}
                    </span>
                    {avgRating && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{avgRating} ({reviews.length})</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">{listing.title}</h1>
                  <p className="flex items-center gap-1.5 text-zinc-500 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <span>
                      {listing.address?.street ? `${listing.address.street}, ` : ''}
                      {listing.address?.city}, {listing.address?.state} {listing.address?.pincode ? `— ${listing.address.pincode}` : ''}
                    </span>
                  </p>
                </div>

                <div className="sm:text-right bg-zinc-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                  <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                    Rs {listing.rent?.toLocaleString()}
                  </div>
                  <div className="text-zinc-400 text-xs font-medium">per month</div>
                  {listing.deposit > 0 && (
                    <div className="text-xs text-zinc-500 mt-1 font-medium">
                      Deposit: Rs {listing.deposit.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="py-6 border-b border-zinc-100">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-zinc-900 mb-2">About this Property</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>
              )}

              {/* Amenities */}
              {listing.amenities?.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-zinc-900 mb-4">Included Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs font-semibold text-zinc-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ratings & Reviews Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Tenant Reviews</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {reviews.length === 0 ? 'No reviews recorded yet' : `${reviews.length} authenticated reviews`}
                  </p>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1.5 text-base font-extrabold text-zinc-900">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{avgRating}</span>
                    <span className="text-zinc-400 text-xs font-normal">/ 5.0</span>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-2xl p-5 mb-8">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3">Write a Tenant Review</h4>
                {reviewMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium mb-3 ${reviewMsg.includes('verified') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {reviewMsg}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 font-medium block mb-1.5">Rating Score</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-zinc-700 ml-2">{rating}.0 / 5.0</span>
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your stay experience, food quality, locality safety, cleanliness..."
                      rows={3}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs sm:text-sm text-zinc-800 outline-none focus:border-zinc-400 transition resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : user ? 'Publish Review' : 'Sign In to Review'}
                  </button>
                </form>
              </div>

              {/* Reviews Feed */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-zinc-400 text-xs text-center py-6">Be the first verified tenant to post a review for this property.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700">
                            {r.tenant?.name?.[0] || 'T'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-zinc-800 block">{r.tenant?.name || 'Verified Tenant'}</span>
                            <span className="text-[10px] text-zinc-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}</span>
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i <= (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pl-9">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Status Pill */}
            <div className={`p-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider ${
              listing.isAvailable
                ? 'bg-emerald-50/80 border-emerald-200/80 text-emerald-800'
                : 'bg-red-50/80 border-red-200/80 text-red-800'
            }`}>
              {listing.isAvailable ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
              <span>{listing.isAvailable ? 'Available for Immediate Booking' : 'Currently Booked / Occupied'}</span>
            </div>

            {/* Host Card */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-4">Property Host</h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {listing.owner?.name?.[0] || 'O'}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">{listing.owner?.name || 'Verified Host'}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Owner</span>
                  </div>
                </div>
              </div>

              {listing.owner?.phone && (
                <a
                  href={`tel:${listing.owner.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-xl transition text-xs shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {listing.owner.phone}</span>
                </a>
              )}
            </div>

            {/* Inquiry Box */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-4">Direct Message Host</h3>

              {inquirySent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs leading-relaxed text-center font-medium">
                  Inquiry delivered successfully. The property owner will contact you shortly.
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 text-xs text-zinc-800 outline-none focus:bg-white focus:border-zinc-400 transition resize-none"
                    placeholder="Enter your message or inquiry..."
                  />
                  <button
                    onClick={handleInquiry}
                    disabled={inquiryLoading || !message.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition text-xs disabled:opacity-50 shadow-md shadow-blue-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{inquiryLoading ? 'Sending Inquiry...' : user ? 'Send Instant Inquiry' : 'Sign In to Inquire'}</span>
                  </button>
                  <p className="text-[11px] text-zinc-400 text-center">Zero broker mediation &bull; Direct host contact</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
