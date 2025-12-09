// src/components/Navbar.jsx
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg flex items-center justify-center font-bold">
              JT
            </div>
            <span className="text-xl font-bold gradient-text">JayT1017</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-accent-purple transition">Home</Link>
            <Link to="/#music" className="hover:text-accent-purple transition">Music</Link>
            <Link to="/#merch" className="hover:text-accent-purple transition">Merch</Link>
            <Link to="/cart" className="relative hover:text-accent-purple transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-accent-purple transition">Home</Link>
            <Link to="/#music" className="block py-2 hover:text-accent-purple transition">Music</Link>
            <Link to="/#merch" className="block py-2 hover:text-accent-purple transition">Merch</Link>
            <Link to="/cart" className="block py-2 hover:text-accent-purple transition">Cart ({cartCount})</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
