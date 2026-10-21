import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Hi, I'm interested in this property. Is it still available?");
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
      setReviewMsg('Thank you! Your review has been submitted.');
      setComment('');
      fetchReviews();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center text-gray-400">Listing not found.</div>;

  const images = listing.images?.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <button onClick={() => navigate('/listings')} className="text-sm text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1 transition">
          ← Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={images[activeImg]}
                alt={listing.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      onClick={() => setActiveImg(i)}
                      className={"w-16 h-16 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 transition " + (activeImg === i ? 'border-blue-500' : 'border-transparent')}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2 flex-wrap items-center">
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">{listing.type}</span>
                    <span className={"text-xs font-semibold px-3 py-1 rounded-full " + (
                      listing.gender === 'male' ? 'bg-blue-50 text-blue-600' :
                      listing.gender === 'female' ? 'bg-pink-50 text-pink-600' :
                      'bg-green-50 text-green-600'
                    )}>{listing.gender}</span>
                    <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{listing.furnishing}</span>
                    {avgRating && (
                      <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        ★ {avgRating} ({reviews.length})
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">{listing.title}</h1>
                  <p className="text-gray-500 mt-1 text-sm">{listing.address?.street}, {listing.address?.city}, {listing.address?.state} — {listing.address?.pincode}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">Rs {listing.rent?.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">/month</p>
                </div>
              </div>

              {listing.deposit && (
                <p className="text-sm text-gray-500 mb-4">Security Deposit: <span className="font-medium text-gray-700">Rs {listing.deposit?.toLocaleString()}</span></p>
              )}

              {listing.description && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">About this place</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{listing.description}</p>
                </div>
              )}

              {listing.amenities?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((a) => (
                      <span key={a} className="bg-gray-50 text-gray-600 text-sm px-4 py-2 rounded-xl border border-gray-100">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ratings & Reviews Section */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Ratings & Reviews</h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {reviews.length === 0 ? 'No reviews yet' : `Average rating: ★ ${avgRating} / 5 based on ${reviews.length} reviews`}
                  </p>
                </div>
              </div>

              {/* Add Review Form */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Leave a Review</h4>
                {reviewMsg && (
                  <p className={"text-xs mb-3 font-medium " + (reviewMsg.includes('Thank') ? 'text-green-600' : 'text-red-500')}>
                    {reviewMsg}
                  </p>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Your Rating</label>
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={"text-2xl transition " + (star <= rating ? 'text-amber-400' : 'text-gray-200')}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 font-medium">({rating} Stars)</span>
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience regarding food, cleanliness, wifi, locality..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition resize-none bg-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : user ? 'Post Review' : 'Login to Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Be the first tenant to leave a review for this property!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="border-b border-gray-50 pb-4 last:border-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-800">{r.tenant?.name || 'Verified Tenant'}</span>
                        <span className="text-amber-400 text-sm">{'★'.repeat(r.rating || 5)}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                      <span className="text-gray-300 text-xs mt-1 block">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Listed by</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                  {listing.owner?.name?.[0] || 'O'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{listing.owner?.name || 'Property Owner'}</p>
                  <p className="text-gray-400 text-sm">Verified Host</p>
                </div>
              </div>
              {listing.owner?.phone && (
                <a
                  href={`tel:${listing.owner.phone}`}
                  className="w-full block text-center bg-green-50 text-green-600 font-medium py-3 rounded-xl hover:bg-green-100 transition text-sm"
                >
                  📞 Call Owner ({listing.owner.phone})
                </a>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Send Inquiry</h3>
              {inquirySent ? (
                <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl text-center">
                  Inquiry sent! Owner will contact you soon.
                </div>
              ) : (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition resize-none mb-3"
                  />
                  <button
                    onClick={handleInquiry}
                    disabled={inquiryLoading || !message}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                  >
                    {inquiryLoading ? 'Sending...' : user ? 'Send Inquiry' : 'Login to Inquire'}
                  </button>
                </>
              )}
            </div>

            <div className={"rounded-2xl p-4 text-center text-sm font-medium " + (listing.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500')}>
              {listing.isAvailable ? '✓ Available Now' : '✗ Not Available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
