import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingBag, Zap, Shield, RotateCcw, Truck, Check, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import { ProductCard } from './ProductCard';
import { INITIAL_PRODUCTS } from '../data/initialData';

export const ProductPage: React.FC = () => {
  const {
    selectedProductId,
    openProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setCurrentView,
    openCategory,
  } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProductId) return;
    setLoading(true);

    api.getProductById(selectedProductId)
      .then((res) => {
        setProduct(res.product);
        setRelatedProducts(res.related || []);
        setActiveImageIndex(0);
        if (res.product.sizes?.length) {
          setSelectedSize(res.product.sizes[0]);
        }
        if (res.product.colors?.length) {
          setSelectedColor(res.product.colors[0].name);
        }
        setQuantity(1);
      })
      .catch(() => {
        // Local fallback
        const found = INITIAL_PRODUCTS.find((p) => p.id === selectedProductId || p.slug === selectedProductId);
        if (found) {
          setProduct(found);
          const rel = INITIAL_PRODUCTS.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4);
          setRelatedProducts(rel);
          if (found.sizes?.length) setSelectedSize(found.sizes[0]);
          if (found.colors?.length) setSelectedColor(found.colors[0].name);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedProductId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-stone-600 text-sm tracking-widest uppercase">
            Curating Piece...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F5]">
        <p className="text-lg font-serif text-stone-800">Product not found</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'];

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setCurrentView('checkout');
  };

  return (
    <div className="bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-stone-500 font-light">
          <button
            onClick={() => setCurrentView('shop')}
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Shop</span>
          </button>
          <span aria-hidden="true">/</span>
          <button
            onClick={() => openCategory(product.category)}
            className="hover:text-stone-900 transition-colors uppercase tracking-wider"
          >
            {product.category}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-stone-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Contiguous PDP Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Sticky Product Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Gallery Thumbnails List */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 transition-all cursor-pointer bg-stone-100 shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#9E7B36] shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image Display */}
            <div className="relative flex-1 aspect-[4/5] bg-[#F5EFE6] border border-[#EAE3D6] overflow-hidden">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#1C1917] text-[#E5D7B7] text-xs font-semibold px-2.5 py-1 tracking-wider uppercase">
                  {discountPercent}% OFF
                </span>
              )}

              {/* Floating Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  wishlisted
                    ? 'bg-[#1C1917] text-[#D4AF37]'
                    : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#D4AF37]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            {/* Category & Status */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
              <span className="uppercase tracking-[0.2em] text-[#9E7B36]">{product.category}</span>
              <span className={`tabular-nums ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {product.stock > 0 ? `${product.stock} pieces in atelier` : 'Out of stock'}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1C1917] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews Bar */}
            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-[#C9A86A]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#C9A86A] text-[#C9A86A]'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-stone-800 tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500 underline cursor-pointer">
                {product.reviewCount} Verified Reviews
              </span>
            </div>

            {/* Pricing Module */}
            <div className="mt-6 p-4 bg-[#F5EFE6] border border-[#EAE3D6] flex items-baseline gap-4">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tabular-nums">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-base text-stone-400 line-through tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 tracking-wider">
                    You Save {formatPrice(product.price - product.discountPrice)} ({discountPercent}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-light">
              Inclusive of all taxes. Complimentary boutique courier in India.
            </p>

            {/* Description */}
            <div className="mt-6 text-sm text-stone-600 font-light leading-relaxed border-t border-[#EAE3D6] pt-6">
              <p>{product.description}</p>
            </div>

            {/* Color Selection (if available) */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="uppercase tracking-wider font-medium text-stone-700">
                    Shade / Finish:
                  </span>
                  <span className="text-stone-500 font-light">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#9E7B36] scale-110'
                          : 'border-stone-300 hover:border-stone-500'
                      }`}
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Dimension Selection (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="uppercase tracking-wider font-medium text-stone-700">
                    Available Size / Fit:
                  </span>
                  <span className="text-[#9E7B36] text-[11px] cursor-pointer hover:underline">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer border ${
                        selectedSize === s
                          ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917]'
                          : 'bg-[#FAF8F5] text-stone-700 border-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Action Buttons */}
            <div className="mt-8 space-y-4 pt-6 border-t border-[#EAE3D6]">
              <div className="flex items-center gap-4">
                <div className="text-xs uppercase tracking-wider font-medium text-stone-700">
                  Quantity:
                </div>
                <div className="flex items-center border border-stone-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono tabular-nums text-stone-900 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    disabled={quantity >= (product.stock || 10)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart + Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 bg-[#1C1917] hover:bg-stone-800 text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 bg-[#C9A86A] hover:bg-[#B39356] text-[#1C1917] text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Product Specifications & Bullets */}
            {product.details && product.details.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#EAE3D6]">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3">
                  Atelier Craft Details
                </h4>
                <ul className="space-y-2 text-xs text-stone-600 font-light">
                  {product.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#9E7B36] font-bold mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Assurances */}
            <div className="mt-8 pt-6 border-t border-[#EAE3D6] grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#9E7B36] mb-1" />
                <span className="text-[11px] font-medium text-stone-800">Free Express</span>
                <span className="text-[10px] text-stone-400">Above ₹1,999</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-[#9E7B36] mb-1" />
                <span className="text-[11px] font-medium text-stone-800">7-Day Exchange</span>
                <span className="text-[10px] text-stone-400">Hassle Free</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-4 h-4 text-[#9E7B36] mb-1" />
                <span className="text-[11px] font-medium text-stone-800">Hallmarked</span>
                <span className="text-[10px] text-stone-400">100% Genuine</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#EAE3D6]">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
                Complete The Look
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-serif text-[#1C1917]">
                Related Creations
              </h3>
              <div className="w-10 h-[1px] bg-[#C9A86A] mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
