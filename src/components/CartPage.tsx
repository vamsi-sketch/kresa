import React, { useState } from 'react';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    setCurrentView,
    openProduct,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ROYAL10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try ROYAL10');
    }
  };

  const discountAmount = promoApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="min-h-[65vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] flex items-center justify-center text-[#9E7B36] mb-4">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">Your Shopping Bag Is Empty</h2>
        <p className="text-sm text-stone-500 max-w-sm mt-2 font-light">
          Immerse yourself in our curated jewellery, festive attire, and artisanal homeware creations.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-8 px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm cursor-pointer"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] py-10 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EAE3D6] mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">Checkout Flow</span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mt-1">Shopping Bag</h1>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs text-stone-600 hover:text-stone-950 flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="divide-y divide-[#EAE3D6] border-y border-[#EAE3D6]">
              {cart.map((item, idx) => {
                const unitPrice = item.product.discountPrice || item.product.price;
                const itemTotal = unitPrice * item.quantity;
                const img = item.product.images?.[0] || '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg';

                return (
                  <div key={`${item.product.id}-${idx}`} className="py-6 flex gap-4 sm:gap-6 items-start">
                    
                    {/* Thumbnail */}
                    <div
                      onClick={() => openProduct(item.product.id)}
                      className="w-20 h-24 sm:w-24 sm:h-32 bg-[#F5EFE6] border border-[#EAE3D6] overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#9E7B36] font-medium">
                              {item.product.category}
                            </span>
                            <h3
                              onClick={() => openProduct(item.product.id)}
                              className="font-serif text-base sm:text-lg text-stone-900 font-medium hover:text-[#9E7B36] transition-colors cursor-pointer"
                            >
                              {item.product.name}
                            </h3>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-stone-400 hover:text-rose-700 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected Variants */}
                        <div className="mt-1 text-xs text-stone-500 font-light space-x-3">
                          {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                          {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                        </div>
                      </div>

                      {/* Stepper & Total */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-stone-300 bg-white">
                          <button
                            onClick={() => updateQuantity(idx, item.quantity - 1)}
                            className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-mono font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(idx, item.quantity + 1)}
                            className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-semibold text-stone-900 text-sm sm:text-base tabular-nums">
                            {formatPrice(itemTotal)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[11px] text-stone-400 font-mono">
                              ({formatPrice(unitPrice)} each)
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Delivery Assurance */}
            <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#9E7B36] shrink-0" />
              <p className="text-xs text-stone-700 font-light">
                Orders are secured in signature tamper-evident gold debossed gift boxes with certificates of authenticity.
              </p>
            </div>
          </div>

          {/* Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-[#F5EFE6] border border-[#EAE3D6] p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6]">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-mono text-stone-900 tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Charges</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-xs">Complimentary</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              {deliveryFee > 0 && (
                <p className="text-[11px] text-[#9E7B36]">
                  Add {formatPrice(1999 - cartSubtotal)} more for free delivery!
                </p>
              )}

              {promoApplied && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>ROYAL10 (10% Off)</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#EAE3D6] flex justify-between items-baseline text-base sm:text-lg font-serif font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-xl sm:text-2xl font-sans font-bold text-[#1C1917] tabular-nums">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium mb-1.5">
                Apply Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ROYAL10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 text-xs px-3 py-2 uppercase tracking-wider focus:outline-none focus:border-[#9E7B36]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1917] hover:bg-[#9E7B36] text-white text-xs uppercase tracking-wider font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-xs text-rose-700 mt-1">{promoError}</p>}
              {promoApplied && <p className="text-xs text-emerald-700 mt-1">ROYAL10 applied successfully!</p>}
            </form>

            {/* Checkout Action */}
            <div className="pt-4">
              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full py-4 bg-[#C9A86A] hover:bg-[#B39356] text-stone-950 font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-stone-500 font-light">
                Encrypted 256-Bit SSL Checkout · Cash on Delivery available
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
