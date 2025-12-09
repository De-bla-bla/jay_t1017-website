// src/components/WhatsAppButton.jsx
import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "../utils/whatsapp";

export default function WhatsAppButton({ message = "Hi JayT1017! I want to reach out..." }) {
  return (
    <button
      onClick={() => openWhatsApp(message)}
      className="whatsapp-float"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
}
