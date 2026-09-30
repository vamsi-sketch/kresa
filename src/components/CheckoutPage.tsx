import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Shield, Lock, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    clearCart,
    setCurrentView,
    setLastCompletedOrder,
    customer,
    showToast,
  } = useShop();

  const defaultAddr = customer?.savedAddresses?.[0];

  const [formData, setFormData] = useState({
    customerName: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    pincode: defaultAddr?.pincode || '',
    paymentMethod: 'COD' as 'COD' | 'ONLINE_UPI' | 'CARD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F5]">
        <h2 className="text-xl font-serif text-stone-900">Your bag is empty</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validations
    if (!formData.customerName.trim()) return setErrorMsg('Please enter customer full name');
    if (!formData.email.trim() || !formData.email.includes('@')) return setErrorMsg('Please enter a valid email address');
    if (!formData.phone.trim() || formData.phone.length < 10) return setErrorMsg('Please enter a valid 10-digit mobile number');
    if (!formData.street.trim()) return setErrorMsg('Please enter full delivery street address');
    if (!formData.city.trim()) return setErrorMsg('Please enter city');
    if (!formData.state.trim()) return setErrorMsg('Please enter state');
    if (!formData.pincode.trim() || formData.pincode.length < 6) return setErrorMsg('Please enter valid 6-digit postal pincode');

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cart.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          image: it.product.images?.[0] || '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg',
          category: it.product.category,
          price: it.product.discountPrice || it.product.price,
          quantity: it.quantity,
          selectedSize: it.selectedSize,
          selectedColor: it.selectedColor,
        })),
        paymentMethod: formData.paymentMethod,
        discount: 0,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        setLastCompletedOrder(res.order);
        clearCart();
        showToast(`Order ${res.order.id} placed successfully!`);
        setCurrentView('order-confirmation');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-8 flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
          <div>
            <button
              onClick={() => setCurrentView('cart')}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">Secure Boutique Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-[#9E7B36]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Customer Details & Delivery Address (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact Information */}
            <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-6 sm:p-8">
              <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                1. Contact Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Maharani Gayatri"
                    className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98201 23456"
                    className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. royal@kresa.com"
                    className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-6 sm:p-8">
              <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                2. Delivery Destination
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Full Street Address / Apartment / Landmark *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. Penthouse 18, Royal Palms, Marine Drive"
                    className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 400020"
                      className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-6 sm:p-8">
              <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash On Delivery Option */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
                    formData.paymentMethod === 'COD'
                      ? 'border-[#9E7B36] bg-[#FAF8F5] shadow-xs'
                      : 'border-stone-300 bg-white hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="mt-1 accent-[#9E7B36]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#9E7B36]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light mt-1">
                      Pay with cash or UPI scan when your parcel arrives at your doorstep. Zero advance fee.
                    </p>
                  </div>
                </label>

                {/* Instant Online UPI Option */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
                    formData.paymentMethod === 'ONLINE_UPI'
                      ? 'border-[#9E7B36] bg-[#FAF8F5] shadow-xs'
                      : 'border-stone-300 bg-white hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE_UPI"
                    checked={formData.paymentMethod === 'ONLINE_UPI'}
                    onChange={handleChange}
                    className="mt-1 accent-[#9E7B36]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#9E7B36]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                        Instant UPI (Google Pay, PhonePe, Paytm, BHIM)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light mt-1">
                      Instant verified authorization with immediate priority dispatch from atelier.
                    </p>
                  </div>
                </label>

                {/* Credit / Debit Card Option */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
                    formData.paymentMethod === 'CARD'
                      ? 'border-[#9E7B36] bg-[#FAF8F5] shadow-xs'
                      : 'border-stone-300 bg-white hover:border-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={formData.paymentMethod === 'CARD'}
                    onChange={handleChange}
                    className="mt-1 accent-[#9E7B36]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#9E7B36]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                        Credit / Debit Card (Visa, Mastercard, RuPay, Amex)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light mt-1">
                      Secure encrypted card gateway with zero international transaction surcharge.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Place Order Button (5 cols) */}
          <div className="lg:col-span-5 bg-[#F5EFE6] border border-[#EAE3D6] p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6]">
              Order Summary ({cart.length} creations)
            </h2>

            {/* Condensed Items Preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#EAE3D6] pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-white border border-stone-200 overflow-hidden shrink-0">
                      <img
                        src={item.product.images?.[0] || '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-stone-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-stone-500">
                        Qty: {item.quantity} {item.selectedSize ? `· ${item.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-stone-800 tabular-nums">
                    {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#EAE3D6] space-y-2 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Boutique Courier</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-xs">Complimentary</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-[#EAE3D6] flex justify-between items-baseline text-base sm:text-lg font-serif font-bold text-stone-900">
                <span>Grand Total</span>
                <span className="text-xl sm:text-2xl font-sans font-bold text-[#1C1917] tabular-nums">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C9A86A] hover:bg-[#B39356] text-stone-950 font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <span>Place Order ({formatPrice(cartTotal)})</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-light text-center">
              <Shield className="w-3.5 h-3.5 text-[#9E7B36]" />
              <span>Complimentary insured shipping with tracking link</span>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
