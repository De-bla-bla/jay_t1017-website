import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ShoppingBag, Music, Edit2, Trash2, Plus, Upload } from "lucide-react";
import axios from "axios";
import * as filestack from "filestack-js";

const runtime = (typeof window !== 'undefined' && window.__RUNTIME__) || {};
const API_URL = runtime.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";
const FILESTACK_API_KEY = runtime.VITE_FILESTACK_API_KEY || import.meta.env.VITE_FILESTACK_API_KEY || "";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [filestackClient, setFilestackClient] = useState(null);
  const [_loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    merchItems: 0,
    visitors: 0,
  });
  const [merchItems, setMerchItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    image: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [profileData, setProfileData] = useState({
    artistName: "JayT1017",
    bio: "Emo Rap Artist from Ghana",
    profileImage: "",
    socialLinks: {
      instagram: "https://instagram.com/jay_t1017",
      tiktok: "https://tiktok.com/@jay_t1017",
      twitter: "https://twitter.com/jayt1017x",
      facebook: "https://facebook.com/JayT1017",
      snapchat: "https://snapchat.com/add/jay_t2021395",
      appleMusic: "https://music.apple.com",
    },
  });
  const [musicItems, setMusicItems] = useState([]);
  const [editingMusic, setEditingMusic] = useState(null);
  const [musicFormData, setMusicFormData] = useState({
    title: "",
    artist: "",
    url: "",
    platform: "spotify",
    description: "",
  });

  // Get JWT token from sessionStorage
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/stats`, { headers: getAuthHeaders() });
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch merch items
  const fetchMerch = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/merch`);
      console.log("✓ Merch fetched:", response.data);
      setMerchItems(response.data);
    } catch (err) {
      console.error("Error fetching merch:", err);
    }
  };

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/profile`, { headers: getAuthHeaders() });
      setProfileData(response.data);
      if (response.data.profileImage) {
        setProfileImage(response.data.profileImage);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Initialize Filestack and fetch data on mount
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    
    // Initialize Filestack client. We support runtime-injected config via window.__RUNTIME__
    const key = (typeof window !== 'undefined' && window.__RUNTIME__ && window.__RUNTIME__.VITE_FILESTACK_API_KEY) || FILESTACK_API_KEY;
    if (key) {
      try {
        const client = filestack.init(key);
        console.log("✓ Filestack client initialized");
        setFilestackClient(client);
      } catch (err) {
        console.error("Failed to initialize Filestack:", err);
      }
    } else {
      console.warn("Filestack API key is not set. To configure, add VITE_FILESTACK_API_KEY as a Railway variable or set it in your local .env.");
    }

    fetchStats();
    fetchMerch();
    fetchProfile();
  }, [navigate]);

  // Save admin profile
  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        ...profileData,
        profileImage: profileImage || profileData.profileImage || "",
      };
      await axios.put(`${API_URL}/api/admin/profile`, updatedProfile, { headers: getAuthHeaders() });
      alert("Profile saved successfully!");
      // Refresh to confirm save
      const response = await axios.get(`${API_URL}/api/admin/profile`, { headers: getAuthHeaders() });
      setProfileData(response.data);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  // Add new merch item
  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in required fields");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/merch`, formData, { headers: getAuthHeaders() });
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        image: "",
      });
      fetchMerch();
      alert("Item added successfully!");
    } catch (err) {
      alert("Error adding item: " + err.message);
    }
  };

  // Update merch item
  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      await axios.put(`${API_URL}/api/merch/${editingItem.id}`, formData, { headers: getAuthHeaders() });
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        image: "",
      });
      fetchMerch();
      alert("Item updated successfully!");
    } catch (err) {
      alert("Error updating item: " + err.message);
    }
  };

  // Delete merch item
  const handleDeleteItem = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/api/merch/${id}`, { headers: getAuthHeaders() });
        fetchMerch();
        alert("Item deleted successfully!");
      } catch (err) {
        alert("Error deleting item: " + err.message);
      }
    }
  };

  // Edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      originalPrice: item.original_price || "",
      category: item.category || "",
      image: item.image || "",
    });
  };

  // Add new music track
  const handleAddMusic = () => {
    if (!musicFormData.title || !musicFormData.url) {
      alert("Please fill in title and URL");
      return;
    }
    const newMusic = {
      id: Date.now(),
      ...musicFormData,
    };
    setMusicItems([...musicItems, newMusic]);
    setMusicFormData({
      title: "",
      artist: "",
      url: "",
      platform: "spotify",
      description: "",
    });
    alert("Music added successfully!");
  };

  // Update music track
  const handleUpdateMusic = () => {
    if (!editingMusic) return;
    setMusicItems(
      musicItems.map((item) =>
        item.id === editingMusic.id ? { ...editingMusic, ...musicFormData } : item
      )
    );
    setEditingMusic(null);
    setMusicFormData({
      title: "",
      artist: "",
      url: "",
      platform: "spotify",
      description: "",
    });
    alert("Music updated successfully!");
  };

  // Delete music track
  const handleDeleteMusic = (id) => {
    if (confirm("Delete this track?")) {
      setMusicItems(musicItems.filter((item) => item.id !== id));
      alert("Track deleted!");
    }
  };

  // Edit music track
  const handleEditMusic = (item) => {
    setEditingMusic(item);
    setMusicFormData({
      title: item.title,
      artist: item.artist || "",
      url: item.url,
      platform: item.platform,
      description: item.description || "",
    });
  };

  // Filestack upload for profile photo
  const handleFilestackProfileUpload = async () => {
    if (!FILESTACK_API_KEY) {
      alert("Filestack API key not configured. Please add VITE_FILESTACK_API_KEY to .env.local");
      return;
    }
    
    if (!filestackClient) {
      alert("Filestack is initializing. Please wait a moment and try again.");
      return;
    }
    
    try {
      const picker = filestackClient.picker({
        onUploadDone: (result) => {
          console.log("Upload complete:", result);
          if (result.filesUploaded && result.filesUploaded.length > 0) {
            const fileUrl = result.filesUploaded[0].url;
            setProfileImage(fileUrl);
            alert("Profile photo uploaded successfully!");
          }
        }
      });
      picker.open();
    } catch (err) {
      console.error("Filestack error:", err);
      alert(`Upload failed: ${err.message || "Please try again"}`);
    }
  };

  // Filestack upload for merchandise image
  const handleFilestackMerchUpload = async () => {
    if (!FILESTACK_API_KEY) {
      alert("Filestack API key not configured. Please add VITE_FILESTACK_API_KEY to .env.local");
      return;
    }
    
    if (!filestackClient) {
      alert("Filestack is initializing. Please wait a moment and try again.");
      return;
    }
    
    try {
      const picker = filestackClient.picker({
        onUploadDone: (result) => {
          console.log("Upload complete:", result);
          if (result.filesUploaded && result.filesUploaded.length > 0) {
            const fileUrl = result.filesUploaded[0].url;
            setFormData({ ...formData, image: fileUrl });
            alert("Image uploaded successfully!");
          }
        }
      });
      picker.open();
    } catch (err) {
      console.error("Filestack error:", err);
      alert(`Upload failed: ${err.message || "Please try again"}`);
    }
  };

  // Filestack upload for hero image
  const handleFilestackHeroUpload = async () => {
    if (!FILESTACK_API_KEY) {
      alert("Filestack API key not configured. Please add VITE_FILESTACK_API_KEY to .env.local");
      return;
    }
    
    if (!filestackClient) {
      alert("Filestack is initializing. Please wait a moment and try again.");
      return;
    }
    
    try {
      const picker = filestackClient.picker({
        onUploadDone: (result) => {
          console.log("Upload complete:", result);
          if (result.filesUploaded && result.filesUploaded.length > 0) {
            const fileUrl = result.filesUploaded[0].url;
            setHeroImage(fileUrl);
            // Save to localStorage so it persists
            localStorage.setItem("heroImage", fileUrl);
            alert("Hero image uploaded successfully!");
          }
        }
      });
      picker.open();
    } catch (err) {
      console.error("Filestack error:", err);
      alert(`Upload failed: ${err.message || "Please try again"}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-dark-900 border-r border-dark-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg flex items-center justify-center font-bold">
                JT
              </div>
            )}
            <div>
              <h1 className="font-bold gradient-text">JayT1017</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "merch", label: "Merchandise", icon: "🛍️" },
            { id: "music", label: "Music", icon: "🎵" },
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "media", label: "Media", icon: "🖼️" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-accent-purple text-white"
                  : "text-gray-400 hover:bg-dark-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-dark-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Orders", value: stats.totalOrders, color: "purple" },
                { label: "Revenue (GHS)", value: `₵${stats.totalRevenue.toFixed(2)}`, color: "pink" },
                { label: "Merch Items", value: stats.merchItems, color: "blue" },
                { label: "Visitors", value: stats.visitors, color: "green" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-accent-${stat.color} transition`}
                >
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merchandise Tab */}
        {activeTab === "merch" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text">Manage Merchandise</h2>

            {/* Form */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 mb-8">
              <h3 className="text-xl font-bold mb-4">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Price (GHS)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Original Price"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-2 bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                  rows="3"
                />
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={handleFilestackMerchUpload}
                    className="flex-1 bg-accent-blue hover:bg-accent-purple px-3 py-2 rounded text-sm transition flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    Upload Image (Filestack)
                  </button>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded border border-dark-700"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
                {editingItem && (
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({
                        name: "",
                        description: "",
                        price: "",
                        originalPrice: "",
                        category: "",
                        image: "",
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Merch List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {merchItems && merchItems.length > 0 ? (
                merchItems.map((item) => (
                  <div key={item.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h4 className="font-bold mb-2">{item.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                    <p className="text-sm mb-4">
                      <span className="text-accent-purple font-bold">₵{item.price}</span>
                      {item.original_price && (
                        <span className="text-gray-500 line-through ml-2">₵{item.original_price}</span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="flex-1 bg-accent-purple hover:bg-accent-pink px-3 py-2 rounded text-sm transition"
                      >
                        <Edit2 size={16} className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition"
                      >
                        <Trash2 size={16} className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-dark-800 rounded-lg p-8 border border-dark-700 text-center text-gray-400">
                  <ShoppingBag size={32} className="mx-auto mb-4 opacity-50" />
                  <p>No merchandise items yet. Add one to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Music Tab */}
        {activeTab === "music" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text">Music Management</h2>

            {/* Music Form */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 mb-8">
              <h3 className="text-xl font-bold mb-4">
                {editingMusic ? "Edit Track" : "Add New Track"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Track Title *"
                  value={musicFormData.title}
                  onChange={(e) => setMusicFormData({ ...musicFormData, title: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Artist Name"
                  value={musicFormData.artist}
                  onChange={(e) => setMusicFormData({ ...musicFormData, artist: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <select
                  value={musicFormData.platform}
                  onChange={(e) => setMusicFormData({ ...musicFormData, platform: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                >
                  <option value="spotify">Spotify</option>
                  <option value="apple">Apple Music</option>
                  <option value="youtube">YouTube</option>
                  <option value="soundcloud">SoundCloud</option>
                </select>
                <input
                  type="text"
                  placeholder="URL/Link *"
                  value={musicFormData.url}
                  onChange={(e) => setMusicFormData({ ...musicFormData, url: e.target.value })}
                  className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={musicFormData.description}
                  onChange={(e) => setMusicFormData({ ...musicFormData, description: e.target.value })}
                  className="col-span-2 bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white"
                  rows="2"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={editingMusic ? handleUpdateMusic : handleAddMusic}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  {editingMusic ? "Update Track" : "Add Track"}
                </button>
                {editingMusic && (
                  <button
                    onClick={() => {
                      setEditingMusic(null);
                      setMusicFormData({
                        title: "",
                        artist: "",
                        url: "",
                        platform: "spotify",
                        description: "",
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Music List */}
            {musicItems.length === 0 ? (
              <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 text-center">
                <Music size={48} className="mx-auto mb-4 text-accent-purple opacity-50" />
                <p className="text-gray-400">No tracks added yet. Add your first track above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {musicItems.map((item) => (
                  <div key={item.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.artist || "Unknown Artist"}</p>
                      </div>
                      <span className="bg-accent-purple px-3 py-1 rounded text-xs font-bold">
                        {item.platform.toUpperCase()}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                    )}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-purple hover:text-accent-pink text-sm mb-3 block underline"
                    >
                      🔗 Open Link
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMusic(item)}
                        className="flex-1 bg-accent-purple hover:bg-accent-pink px-3 py-2 rounded text-sm transition"
                      >
                        <Edit2 size={16} className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMusic(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition"
                      >
                        <Trash2 size={16} className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text">Profile Settings</h2>
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="space-y-6">
                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-dark-700 flex items-center justify-center bg-dark-900">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-accent-purple to-accent-pink flex items-center justify-center text-2xl font-bold">
                        JT
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFilestackProfileUpload}
                      className="btn-primary flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={18} />
                      Upload Photo (Filestack)
                    </button>
                    {profileImage && (
                      <button
                        onClick={() => setProfileImage(null)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    📸 Using Filestack - Photos saved permanently
                  </p>
                </div>

                {/* Other Profile Fields */}
                <input
                  type="text"
                  placeholder="Artist Name"
                  value={profileData.artistName || ""}
                  onChange={(e) => setProfileData({ ...profileData, artistName: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded px-4 py-2 text-white"
                />
                <textarea
                  placeholder="Bio"
                  value={profileData.bio || ""}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded px-4 py-2 text-white"
                  rows="4"
                />
                <button onClick={handleSaveProfile} className="btn-primary">Save Profile</button>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text">Media Management</h2>
            
            {/* Hero Image Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <h3 className="text-xl font-bold mb-4">Hero Banner Image</h3>
                <p className="text-sm text-gray-400 mb-4">Upload the main hero image displayed on the home page (recommended: 600x600px or larger)</p>
                
                {heroImage && (
                  <div className="mb-4">
                    <img 
                      src={heroImage} 
                      alt="Hero Preview" 
                      className="w-full h-64 object-cover rounded-lg border border-dark-700"
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={handleFilestackHeroUpload}
                    className="flex-1 bg-accent-blue hover:bg-accent-purple px-4 py-2 rounded text-sm transition flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    Upload Hero Image
                  </button>
                  {heroImage && (
                    <button
                      onClick={() => {
                        setHeroImage(null);
                        localStorage.removeItem("heroImage");
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {heroImage && (
                  <div className="mt-4 p-3 bg-dark-900 rounded text-xs text-gray-400 break-all">
                    <strong>URL:</strong> {heroImage}
                  </div>
                )}
              </div>

              {/* Hero Preview */}
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <h3 className="text-xl font-bold mb-4">Preview</h3>
                <div className="w-full aspect-square bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 rounded-lg overflow-hidden border-2 border-accent-purple/50">
                  <img
                    src={heroImage || "https://via.placeholder.com/600x600?text=Hero+Banner"}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">This is how your hero image will appear on the home page</p>
              </div>
            </div>

            {/* Information */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-bold mb-3">📋 Media Upload Guide</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ <strong>Hero Banner:</strong> Displays as the main profile image on home page (desktop only)</li>
                <li>✓ <strong>Recommended size:</strong> 600x600px or larger (square format works best)</li>
                <li>✓ <strong>File formats:</strong> JPG, PNG, WebP</li>
                <li>✓ <strong>Max file size:</strong> 10MB</li>
                <li>✓ <strong>Storage:</strong> All images stored on Filestack CDN (permanent URLs)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text">Settings</h2>
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 space-y-4">
              <div className="flex justify-between items-center">
                <span>Dark Mode</span>
                <input type="checkbox" defaultChecked className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-center">
                <span>Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-6 h-6" />
              </div>
              <button className="btn-primary mt-6">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
