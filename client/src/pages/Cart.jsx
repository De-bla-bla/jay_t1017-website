// src/pages/Cart.jsx
import { useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { useCart } from "../hooks/useCart";
import { generateOrderMessage, openWhatsApp } from "../utils/whatsapp";
import { SIZES } from "../utils/constants";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [notes, setNotes] = useState("");

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let message = generateOrderMessage(cart);
    if (notes) {
      message += `\n\nSpecial Notes: ${notes}`;
    }
    openWhatsApp(message);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      <WhatsAppButton />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-accent-purple hover:text-accent-pink transition mb-8">
            <ArrowLeft size={20} />
            Back to Shopping
          </Link>

          <h1 className="text-4xl font-bold mb-8 gradient-text">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="bg-dark-800 rounded-lg p-12 text-center">
              <p className="text-xl text-gray-400 mb-4">Your cart is empty 🛒</p>
              <Link to="/#merch" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${index}`}
                    className="bg-dark-800 rounded-lg p-6 flex gap-4 border border-dark-700"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Size: <span className="font-semibold">{item.size}</span>
                      </p>
                      <p className="text-accent-purple font-bold mb-3">
                        GHS {item.price.toFixed(2)} each
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="bg-dark-700 px-2 py-1 rounded hover:bg-dark-600 transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, item.size, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="bg-dark-700 w-12 text-center rounded py-1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="bg-dark-700 px-2 py-1 rounded hover:bg-dark-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="text-right flex flex-col justify-between">
                      <p className="text-lg font-bold">
                        GHS {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 h-fit sticky top-24">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Order Summary</h2>

                {/* Items */}
                <div className="space-y-2 mb-4 pb-4 border-b border-dark-700">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${index}`} className="flex justify-between text-sm text-gray-400">
                      <span>{item.name} ({item.size}) x{item.quantity}</span>
                      <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between mb-4 pb-4 border-b border-dark-700">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-bold">GHS {getTotalPrice().toFixed(2)}</span>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-300 mb-2">Order Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or preferences?"
                    className="w-full bg-dark-700 border border-dark-600 rounded p-3 text-sm text-white focus:outline-none focus:border-accent-purple transition resize-none"
                    rows="3"
                  />
                </div>

                {/* Total */}
                <div className="mb-6 pb-6 border-b border-dark-700">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="gradient-text">GHS {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary mb-3 flex items-center justify-center gap-2"
                >
                  Proceed to WhatsApp Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/#merch"
                  className="w-full btn-secondary text-center block"
                >
                  Continue Shopping
                </Link>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-6 text-center">
                  📲 You'll be redirected to WhatsApp to complete your order
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
