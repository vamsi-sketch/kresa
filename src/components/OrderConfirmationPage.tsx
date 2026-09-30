import React from 'react';
import { CheckCircle2, PackageCheck, Truck, Clock, ArrowRight, Printer, MapPin, Phone, Mail } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice, formatDate } from '../utils/format';
import { OrderStatus } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { lastCompletedOrder, setCurrentView } = useShop();

  if (!lastCompletedOrder) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F5]">
        <h2 className="text-xl font-serif text-stone-900">No recent order found</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const order = lastCompletedOrder;

  const STATUS_STEPS: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="bg-[#FAF8F5] py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Banner */}
        <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-8 text-center mb-10 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#C9A86A] flex items-center justify-center text-[#9E7B36] mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-semibold">
            Gratitude From KRESA
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917] mt-2">
            Your Order Has Been Placed
          </h1>
          <p className="mt-2 text-sm text-stone-600 font-light max-w-md mx-auto">
            Thank you, <strong className="font-semibold text-stone-900">{order.customerName}</strong>.
            Your bespoke package is being prepared with utmost care.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-[#FAF8F5] border border-[#EAE3D6] px-5 py-2.5 text-xs font-mono">
            <span className="text-stone-500 uppercase">Order ID:</span>
            <span className="font-bold text-[#1C1917] tracking-wider">{order.id}</span>
            <span className="text-stone-300">|</span>
            <span className="text-emerald-700 font-medium">Status: {order.status}</span>
          </div>
        </div>

        {/* Live Order Timeline Progress */}
        <div className="bg-white border border-[#EAE3D6] p-6 sm:p-8 mb-10 shadow-xs">
          <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
            Live Order Status Tracking
          </h2>

          {/* Stepper bar */}
          <div className="relative flex items-center justify-between overflow-x-auto pb-4 pt-2">
            <div className="absolute top-5 left-4 right-4 h-0.5 bg-stone-200 -z-0" />
            
            {STATUS_STEPS.slice(0, 5).map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step} className="flex flex-col items-center relative z-10 shrink-0 px-2 text-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                      isCompleted
                        ? 'bg-[#1C1917] text-[#D4AF37] shadow-sm ring-4 ring-[#FAF8F5]'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-[11px] uppercase tracking-wider font-medium max-w-[80px] leading-tight ${
                      isCurrent ? 'text-[#9E7B36] font-bold' : isCompleted ? 'text-stone-900' : 'text-stone-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Timeline Events */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#EAE3D6] space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
                Atelier Activity Log
              </h3>
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#9E7B36] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">{event.note || event.status}</p>
                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">{formatDate(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-[#FAF8F5] border border-[#EAE3D6] p-6 sm:p-8 space-y-8">
          
          {/* Products List */}
          <div>
            <h2 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-4">
              Ordered Creations ({order.items.length})
            </h2>

            <div className="divide-y divide-[#EAE3D6]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 bg-white border border-stone-200 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#9E7B36] font-medium">
                        {item.category}
                      </span>
                      <h3 className="font-serif text-base text-stone-900 font-medium">{item.name}</h3>
                      <div className="text-xs text-stone-500 font-light flex gap-3 mt-0.5">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono font-semibold text-stone-900 text-sm sm:text-base tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#EAE3D6] text-xs">
            <div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#9E7B36]" />
                <span>Delivery Address</span>
              </h3>
              <p className="text-stone-800 font-medium">{order.customerName}</p>
              <p className="text-stone-600 font-light mt-0.5">{order.address.street}</p>
              <p className="text-stone-600 font-light">
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p className="text-stone-500 font-mono mt-2">Mobile: {order.phone}</p>
              <p className="text-stone-500 font-mono">Email: {order.email}</p>
            </div>

            <div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-2">
                Payment Summary
              </h3>
              <div className="space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier:</span>
                  <span className="font-mono tabular-nums">
                    {order.deliveryFee === 0 ? 'Complimentary' : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-stone-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-serif font-bold text-stone-900">
                  <span>Total Paid:</span>
                  <span className="text-lg font-sans font-bold tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#EAE3D6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-2.5 border border-stone-400 hover:border-stone-800 text-stone-700 hover:text-stone-950 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice / Receipt</span>
            </button>

            <button
              onClick={() => setCurrentView('shop')}
              className="w-full sm:w-auto px-8 py-3 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore More Creations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
