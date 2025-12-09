// src/utils/whatsapp.js
import { WHATSAPP_NUMBER } from "./constants";

export const openWhatsApp = (message = "") => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;
  window.open(url, "_blank");
};

export const generateOrderMessage = (cart) => {
  if (cart.length === 0) return "";
  
  let message = "Hi JayT1017! 🎵\n\nI want to order:\n\n";
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n   Size: ${item.size}\n   Quantity: ${item.quantity}\n   Price: GHS ${(item.price * item.quantity).toFixed(2)}\n\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `Total: GHS ${total.toFixed(2)}\n\nPlease confirm availability and delivery details.`;
  
  return message;
};
