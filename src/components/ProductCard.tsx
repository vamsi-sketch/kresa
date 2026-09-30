import React from 'react';
import { Heart, Star, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct, addToCart, isInWishlist, toggleWishlist, setCurrentView } = useShop();
  const wishlisted = isInWishlist(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes?.[0], product.colors?.[0]?.name, 1);
    setCurrentView('checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes?.[0], product.colors?.[0]?.name, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const mainImage = product.images?.[0] || '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg';

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      onClick={() => openProduct(product.id)}
      className="group bg-[#FAF8F5] border border-[#EAE3D6] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#C9A86A]/50 cursor-pointer"
    >
      {/* Product Image Section (65%-75% visual weight) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3ECE2]">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg';
          }}
        />

        {/* Wishlist Icon Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all backdrop-blur-xs ${
            wishlisted
              ? 'bg-[#1C1917] text-[#D4AF37] shadow-md'
              : 'bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#D4AF37]' : ''}`} />
        </button>

        {/* Subtle Discount / Status Tag */}
        {discountPercent > 0 ? (
          <div className="absolute top-3 left-3 bg-[#1C1917]/90 text-[#E5D7B7] text-[10px] tracking-wider uppercase font-medium px-2 py-0.5">
            {discountPercent}% Off
          </div>
        ) : product.isNewArrival ? (
          <div className="absolute top-3 left-3 bg-[#9E7B36] text-white text-[10px] tracking-wider uppercase font-medium px-2 py-0.5">
            New Arrival
          </div>
        ) : null}

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-950/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 bg-[#FAF8F5] hover:bg-white text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#9E7B36]" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2 bg-[#C9A86A] hover:bg-[#B39356] text-stone-950 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-light text-[11px] truncate max-w-[65%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3 h-3 fill-[#C9A86A] text-[#C9A86A]" />
              <span className="font-mono text-xs tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-stone-900 line-clamp-1 group-hover:text-[#9E7B36] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Mobile Quick Action */}
        <div className="mt-3 pt-3 border-t border-[#EAE3D6] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-stone-900 tabular-nums">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Visible action on mobile */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={handleAddToCart}
              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleBuyNow}
              className="px-2 py-1 bg-[#C9A86A] text-stone-950 text-[10px] font-semibold uppercase tracking-wider rounded"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
