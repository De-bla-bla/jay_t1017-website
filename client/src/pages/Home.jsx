import { useState, useEffect } from "react";
import { Mail, Music, ShoppingBag, Instagram, TrendingUp, Music2, Facebook, Camera } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import MerchCard from "../components/MerchCard";
import { SOCIAL_LINKS, WHATSAPP_NUMBER } from "../utils/constants";
import { openWhatsApp } from "../utils/whatsapp";

const runtime = (typeof window !== 'undefined' && window.__RUNTIME__) || {};
const API_URL = runtime.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const [heroImage, setHeroImage] = useState(() => localStorage.getItem("heroImage"));
  const [profile, setProfile] = useState({
    artistName: "JayT1017",
    bio: "Emo Rap Artist from Ghana",
    profileImage: null,
  });
  
  // Fetch live profile from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/profile`);
        setProfile({
          artistName: response.data.artistName || "JayT1017",
          bio: response.data.bio || "Emo Rap Artist from Ghana",
          profileImage: response.data.profileImage || null,
        });
        // Set hero image from API if available, otherwise keep localStorage fallback
        if (response.data.heroImage) {
          setHeroImage(response.data.heroImage);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Keep defaults if fetch fails
      }
    };
    
    fetchProfile();
  }, []);
  
  const [merch, setMerch] = useState([]);

  // Fetch merch items from API
  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/merch`);
        // Normalize the data from snake_case to camelCase
        const normalizedMerch = response.data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : item.price,
          category: item.category,
          image: item.image,
        }));
        setMerch(normalizedMerch);
      } catch (err) {
        console.error("Error fetching merch:", err);
        // Keep empty array if fetch fails
      }
    };
    
    fetchMerch();
  }, []);

  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setSubscriptionLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/newsletter/subscribe`, { email });
      setEmail("");
      alert("✅ Subscription successful! Check your email for confirmation.");
    } catch (err) {
      console.error("Subscription error:", err);
      alert("❌ Subscription failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSubscriptionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-dark-900 via-dark-950 to-dark-950 flex items-center justify-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text animate-fade-in">
              {profile.artistName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2">
              Emo Rap • Songwriter • Artist
            </p>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              {profile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => openWhatsApp("Hi JayT1017! I'm interested in your music...")}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Get in Touch
              </button>
              <a href="#merch" className="btn-secondary flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Shop Now
              </a>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-pink hover:scale-125 transition transform"
                title="Instagram"
              >
                <Instagram size={28} />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-pink transition transform hover:scale-125"
                title="TikTok"
              >
                <Music2 size={28} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-blue transition transform hover:scale-125"
                title="Twitter"
              >
                <TrendingUp size={28} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:scale-125 transition transform"
                title="Facebook"
              >
                <Facebook size={28} />
              </a>
              <a
                href={SOCIAL_LINKS.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-300 transition transform hover:scale-125"
                title="Snapchat"
              >
                <Camera size={28} />
              </a>
              <a
                href={SOCIAL_LINKS.apple_music}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-pink transition transform hover:scale-125"
                title="Apple Music"
              >
                <Music size={28} />
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden md:block">
            <div className="w-full aspect-square bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 rounded-2xl overflow-hidden border-2 border-accent-purple/50">
              <img
                src={heroImage || "https://via.placeholder.com/600x600?text=JayT1017+Profile"}
                alt="JayT1017"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent-purple to-accent-pink rounded-2xl -z-10 opacity-30 blur-xl"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-accent-purple"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            My Music
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Stream my latest tracks across all platforms. Listen to my emo rap releases and get inspired.
          </p>

          {/* Placeholder for music content - admin will manage this */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 flex items-center justify-center h-64">
              <div className="text-center">
                <Music size={48} className="mx-auto mb-4 text-accent-purple" />
                <p className="text-gray-400">Music content coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">Admin can manage music section</p>
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 flex items-center justify-center h-64">
              <div className="text-center">
                <Music size={48} className="mx-auto mb-4 text-accent-pink" />
                <p className="text-gray-400">Featured Playlist</p>
                <p className="text-sm text-gray-500 mt-2">Check my social media for latest releases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merch Section */}
      <section id="merch" className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            JayT1017 Merch
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Exclusive branded clothing. Show your support and rock the JayT1017 style.
          </p>

          {/* Merch Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merch.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Stay Updated</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get the latest news about my music, merch drops, and exclusive content.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-purple transition"
              disabled={subscriptionLoading}
            />
            <button 
              type="submit"
              disabled={subscriptionLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscriptionLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
