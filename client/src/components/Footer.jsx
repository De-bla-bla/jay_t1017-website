// src/components/Footer.jsx
import { MessageCircle, Instagram, TrendingUp, Music2, Facebook } from "lucide-react";
import { SOCIAL_LINKS, WHATSAPP_NUMBER } from "../utils/constants";
import { openWhatsApp } from "../utils/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">JayT1017</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Emo rap artist from Ghana. Creating meaningful music and authentic merch for my fans worldwide.
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow</h3>
            <div className="space-y-3 text-sm">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-accent-pink transition">
                <Instagram size={18} /> Instagram
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-accent-pink transition">
                <Music2 size={18} /> TikTok
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-accent-pink transition">
                <TrendingUp size={18} /> Twitter
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-accent-pink transition">
                <Facebook size={18} /> Facebook
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <button
              onClick={() => openWhatsApp("Hi JayT1017! I have a question...")}
              className="flex items-center gap-2 text-accent-green hover:text-white transition mb-2"
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>
            <p className="text-gray-400 text-sm">{WHATSAPP_NUMBER}</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-dark-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            © 2025 JayT1017. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with ❤️ by MP_LORD
          </p>
        </div>
      </div>
    </footer>
  );
}
