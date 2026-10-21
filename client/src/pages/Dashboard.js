import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const initialForm = {
    title: '', description: '', type: 'PG', gender: 'any',
    rent: '', deposit: '', furnishing: 'unfurnished',
    city: '', state: '', street: '', pincode: '',
    amenities: '',
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (user?.role === 'owner') {
        // Optimized: Fetch owner's listings directly from server
        const { data } = await API.get('/listings/my');
        setListings(data);
      } else {
        // Tenant dashboard: Fetch tenant's inquiries
        const { data } = await API.get('/inquiries/my');
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load dashboard data. Please try again.');
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

  const handleSubmit = async () => {
    if (!form.title || !form.rent || !form.city) {
      alert('Please fill in Title, Rent, and City');
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
        // Edit Mode
        if (uploadedUrls.length > 0) {
          payload.images = uploadedUrls;
        }
        await API.put('/listings/' + editingId, payload);
      } else {
        // Create Mode
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
      alert(err.response?.data?.message || 'Error saving listing');
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
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete('/listings/' + id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{user?.name || 'User'}</span> ({user?.role})
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
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition text-sm w-full sm:w-auto"
            >
              {showForm ? 'Cancel' : '+ Add Listing'}
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        {/* Add / Edit Listing Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-5">
              {editingId ? 'Edit Property Listing' : 'Create New Listing'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="e.g. Spacious Luxury PG in Sector 62" required />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition resize-none"
                  rows={3} placeholder="Describe amenities, location highlights..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition bg-white">
                  <option value="PG">PG</option>
                  <option value="flat">Flat</option>
                  <option value="room">Room</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Gender *</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition bg-white">
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Rent (Rs/month) *</label>
                <input type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="8000" min="0" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Security Deposit (Rs)</label>
                <input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="16000" min="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Furnishing</label>
                <select value={form.furnishing} onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition bg-white">
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">City *</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="Noida" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="Uttar Pradesh" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Street / Area</label>
                <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="Block A, Sector 62" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Pincode</label>
                <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="201301" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Amenities (comma separated)</label>
                <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                  placeholder="WiFi, AC, Meals, Laundry, Power Backup" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Upload New Images (Max 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                />
                {imageFiles.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{imageFiles.length} image(s) selected</p>
                )}
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-50"
              >
                {uploading ? 'Uploading images...' : editingId ? 'Update Listing' : 'Publish Listing'}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm); }}
                className="border border-gray-200 text-gray-600 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {user?.role === 'owner' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{listings.length}</p>
              <p className="text-gray-500 text-sm mt-1">Total Properties</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{listings.filter((l) => l.isAvailable).length}</p>
              <p className="text-gray-500 text-sm mt-1">Available Now</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-indigo-600">{inquiries.length}</p>
              <p className="text-gray-500 text-sm mt-1">Active Inquiries</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
            <h2 className="font-semibold text-gray-800">My Sent Inquiries ({inquiries.length})</h2>
          </div>
        )}

        {/* Owner Listings View */}
        {user?.role === 'owner' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">My Listings</h2>
            </div>
            {listings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No listings yet. Click "+ Add Listing" to create your first listing.</div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="text-left px-5 py-3">Title</th>
                        <th className="text-left px-5 py-3">City</th>
                        <th className="text-left px-5 py-3">Rent</th>
                        <th className="text-left px-5 py-3">Type</th>
                        <th className="text-left px-5 py-3">Status</th>
                        <th className="text-left px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {listings.map((listing) => (
                        <tr key={listing._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4 text-sm font-medium text-gray-800">
                            <span onClick={() => navigate('/listings/' + listing._id)} className="cursor-pointer hover:text-blue-600">
                              {listing.title}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">{listing.address?.city}</td>
                          <td className="px-5 py-4 text-sm text-blue-600 font-medium">Rs {listing.rent?.toLocaleString()}</td>
                          <td className="px-5 py-4 text-sm text-gray-500">{listing.type}</td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => handleToggleAvailability(listing)}
                              title="Click to toggle availability"
                              className={"text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition " + (listing.isAvailable ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100')}
                            >
                              {listing.isAvailable ? '✓ Available' : '✗ Unavailable'}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <button onClick={() => { fetchInquiries(listing._id); setActiveTab('inquiries'); }} className="text-xs text-blue-600 hover:underline">Inquiries</button>
                              <button onClick={() => startEdit(listing)} className="text-xs text-gray-600 hover:text-blue-600">Edit</button>
                              <button onClick={() => handleDelete(listing._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {listings.map((listing) => (
                    <div key={listing._id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p onClick={() => navigate('/listings/' + listing._id)} className="text-sm font-semibold text-gray-800 flex-1 pr-2 cursor-pointer">
                          {listing.title}
                        </p>
                        <button
                          onClick={() => handleToggleAvailability(listing)}
                          className={"text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap " + (listing.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500')}
                        >
                          {listing.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{listing.address?.city} · {listing.type}</p>
                      <p className="text-sm text-blue-600 font-medium mb-3">Rs {listing.rent?.toLocaleString()}/mo</p>
                      <div className="flex gap-3">
                        <button onClick={() => { fetchInquiries(listing._id); setActiveTab('inquiries'); }} className="text-xs text-blue-600 font-medium hover:underline">View Inquiries</button>
                        <button onClick={() => startEdit(listing)} className="text-xs text-gray-600 font-medium">Edit</button>
                        <button onClick={() => handleDelete(listing._id)} className="text-xs text-red-500 font-medium hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Inquiries Section */}
        {inquiries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">
                {user?.role === 'owner' ? 'Listing Inquiries' : 'Inquiries You Sent'}
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {inquiries.map((inq) => (
                <div key={inq._id} className="px-4 md:px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {inq.tenant?.name || inq.listing?.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 break-words">{inq.message}</p>
                      {inq.tenant && (
                        <p className="text-xs text-gray-400 mt-1">{inq.tenant.email} · {inq.tenant.phone}</p>
                      )}
                    </div>
                    <span className={"text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap " + (
                      inq.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      inq.status === 'responded' ? 'bg-green-50 text-green-600' :
                      'bg-gray-50 text-gray-500'
                    )}>
                      {inq.status}
                    </span>
                  </div>
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
