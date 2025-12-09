// src/components/MerchCard.jsx
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useState } from "react";
import { SIZES } from "../utils/constants";

export default function MerchCard({ item }) {
  const [selectedSize, setSelectedSize] = useState(SIZES[2]); // Default M
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: selectedSize,
      quantity,
    });
    // Reset form
    setQuantity(1);
    alert("Added to cart! 🛒");
  };

  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-accent-purple/20 transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-80 bg-dark-700 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-accent-pink text-white px-3 py-1 rounded-full text-xs font-bold">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 truncate">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

        {/* Price */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-accent-purple">
            GHS {item.price.toFixed(2)}
          </span>
          {item.originalPrice > item.price && (
            <span className="text-sm text-gray-500 line-through">
              GHS {item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Size</label>
          <div className="flex gap-2 flex-wrap">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                  selectedSize === size
                    ? "bg-accent-purple text-white"
                    : "bg-dark-700 text-gray-300 hover:bg-dark-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-dark-700 px-3 py-1 rounded hover:bg-dark-600 transition"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-dark-700 w-12 text-center rounded py-1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-dark-700 px-3 py-1 rounded hover:bg-dark-600 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary flex items-center justify-center gap-2 mb-2"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        {/* Buy Now Button */}
        <button className="w-full btn-secondary flex items-center justify-center gap-2">
          <Zap size={18} />
          Quick Buy
        </button>
      </div>
    </div>
  );
}
