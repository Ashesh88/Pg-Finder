import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  AlertCircle,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const initialForm = {
    title: '',
    description: '',
    type: 'PG',
    gender: 'any',
    rent: '',
    deposit: '',
    furnishing: 'unfurnished',
    city: '',
    state: '',
    street: '',
    pincode: '',
    amenities: '',
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (user?.role === 'owner') {
        const { data } = await API.get('/listings/my');
        setListings(data);
      } else {
        const { data } = await API.get('/inquiries/my');
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to synchronize dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async (listingId) => {
    try {
      const { data } = await API.get('/inquiries/listing/' + listingId);
      setInquiries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    setUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append('images', file));
      const { data } = await API.post('/listings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.urls;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.rent || !form.city) {
      alert('Please complete all required fields.');
      return;
    }
    try {
      const uploadedUrls = await uploadImages();
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        gender: form.gender,
        rent: Number(form.rent),
        deposit: Number(form.deposit || 0),
        furnishing: form.furnishing,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        amenities: form.amenities ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        if (uploadedUrls.length > 0) payload.images = uploadedUrls;
        await API.put('/listings/' + editingId, payload);
      } else {
        payload.images = uploadedUrls;
        await API.post('/listings', payload);
      }

      setShowForm(false);
      setEditingId(null);
      setImageFiles([]);
      setForm(initialForm);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error executing request.');
    }
  };

  const startEdit = (listing) => {
    setEditingId(listing._id);
    setForm({
      title: listing.title || '',
      description: listing.description || '',
      type: listing.type || 'PG',
      gender: listing.gender || 'any',
      rent: listing.rent || '',
      deposit: listing.deposit || '',
      furnishing: listing.furnishing || 'unfurnished',
      city: listing.address?.city || '',
      state: listing.address?.state || '',
      street: listing.address?.street || '',
      pincode: listing.address?.pincode || '',
      amenities: listing.amenities?.join(', ') || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAvailability = async (listing) => {
    try {
      await API.put('/listings/' + listing._id, { isAvailable: !listing.isAvailable });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm deletion of this listing?')) return;
    try {
      await API.delete('/listings/' + id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Console Dashboard</h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              Active Session: <span className="font-semibold text-zinc-800">{user?.name}</span> ({user?.role?.toUpperCase()})
            </p>
          </div>

          {user?.role === 'owner' && (
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(initialForm);
                } else {
                  setShowForm(true);
                }
              }}
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-sm w-full sm:w-auto"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showForm ? 'Cancel Editor' : 'Create Listing'}</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs mb-6 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Modal / Card */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-md p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100">
              <h2 className="font-bold text-base text-zinc-900">
                {editingId ? 'Edit Property Specification' : 'Add Property Listing'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm); }}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition"
                    placeholder="e.g., Executive 2BHK PG near Cyber City"
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400 transition resize-none"
                    rows={3}
                    placeholder="Detail building security, meals, power backup, distance to metro..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Property Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white"
                  >
                    <option value="PG">PG</option>
                    <option value="flat">Flat</option>
                    <option value="room">Private Room</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Gender Restriction *</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white"
                  >
                    <option value="any">Unisex / Any</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Monthly Rent (Rs) *</label>
                  <input
                    type="number"
                    value={form.rent}
                    onChange={(e) => setForm({ ...form, rent: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                    placeholder="8000"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Security Deposit (Rs)</label>
                  <input
                    type="number"
                    value={form.deposit}
                    onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                    placeholder="16000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Furnishing Status</label>
                  <select
                    value={form.furnishing}
                    onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white"
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">City *</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-400"
                    placeholder="Noida"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">State</label>
                  <input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900"
                    placeholder="Uttar Pradesh"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Street Address</label>
                  <input
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900"
                    placeholder="Sector 62, Block A"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Amenities (Comma-separated)</label>
                  <input
                    value={form.amenities}
                    onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900"
                    placeholder="High-Speed WiFi, AC, Three Meals, Laundry, Power Backup"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-600 block mb-1">Upload Photographs (Max 5)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-4 py-2 text-xs text-zinc-700"
                  />
                  {imageFiles.length > 0 && (
                    <span className="text-[11px] text-zinc-500 mt-1 block font-medium">
                      {imageFiles.length} file(s) queued for upload
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-6 py-3 rounded-xl transition disabled:opacity-50"
                >
                  {uploading ? 'Processing Image Pipeline...' : editingId ? 'Update Listing' : 'Publish Property'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm); }}
                  className="text-zinc-600 hover:bg-zinc-100 font-semibold text-xs px-4 py-3 rounded-xl transition border border-zinc-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Metrics Row */}
        {user?.role === 'owner' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-zinc-900">{listings.length}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Properties</p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {listings.filter((l) => l.isAvailable).length}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Available For Rent</p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-blue-600">{inquiries.length}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Inquiries Received</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-base font-bold text-zinc-900">Tenant Inquiries Log ({inquiries.length})</h2>
          </div>
        )}

        {/* Owner Properties Table */}
        {user?.role === 'owner' && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-zinc-900">Managed Inventory</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Live status and performance of your property listings</p>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 text-xs">
                No active properties registered. Click "+ Create Listing" to begin.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                    <tr>
                      <th className="px-6 py-3.5 font-bold">Property Title</th>
                      <th className="px-6 py-3.5 font-bold">City</th>
                      <th className="px-6 py-3.5 font-bold">Monthly Rent</th>
                      <th className="px-6 py-3.5 font-bold">Category</th>
                      <th className="px-6 py-3.5 font-bold">Availability Status</th>
                      <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {listings.map((l) => (
                      <tr key={l._id} className="hover:bg-zinc-50/50 transition">
                        <td className="px-6 py-4 font-bold text-zinc-900">
                          <span
                            onClick={() => navigate('/listings/' + l._id)}
                            className="cursor-pointer hover:text-blue-600 transition inline-flex items-center gap-1.5"
                          >
                            <span>{l.title}</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500">{l.address?.city}</td>
                        <td className="px-6 py-4 font-bold text-zinc-900">Rs {l.rent?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="bg-zinc-100 text-zinc-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                            {l.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleAvailability(l)}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${
                              l.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                                : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${l.isAvailable ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                            <span>{l.isAvailable ? 'Available' : 'Occupied'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { fetchInquiries(l._id); }}
                              className="p-1.5 text-zinc-400 hover:text-blue-600 transition"
                              title="Inspect Inquiries"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEdit(l)}
                              className="p-1.5 text-zinc-400 hover:text-zinc-900 transition"
                              title="Edit Listing"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(l._id)}
                              className="p-1.5 text-zinc-400 hover:text-red-600 transition"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Stream */}
        {inquiries.length > 0 && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="font-bold text-base text-zinc-900">
                {user?.role === 'owner' ? 'Prospective Tenant Messages' : 'Your Inquiries'}
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {inquiries.map((inq) => (
                <div key={inq._id} className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-zinc-400" />
                      <span className="font-bold text-sm text-zinc-900">
                        {inq.tenant?.name || inq.listing?.title}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl p-3 my-2 leading-relaxed">
                      "{inq.message}"
                    </p>

                    {inq.tenant && (
                      <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{inq.tenant.email}</span>
                        </span>
                        {inq.tenant.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{inq.tenant.phone}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <span className={`self-start text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    inq.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}>
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
