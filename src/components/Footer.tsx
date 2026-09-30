import React, { useState } from 'react';
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin, ShieldCheck, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setCurrentView, openCategory } = useShop();
  const [modalPolicy, setModalPolicy] = useState<{ title: string; content: string } | null>(null);

  const policies: Record<string, { title: string; content: string }> = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      content:
        'All KRESA orders are shipped via insured premium express logistics partners (BlueDart, Delhivery Air). Orders above ₹1,999 enjoy complimentary shipping. Delivery across major metropolitan areas takes 2–4 business days. Real-time SMS and email tracking links are provided upon atelier dispatch.',
    },
    returns: {
      title: 'Exchange & Returns Policy',
      content:
        'We offer a seamless 7-day exchange policy for our handcrafted creations. Items must be returned in their original unworn condition with KRESA gold seal tags intact and in signature luxury packaging. Our concierge will arrange complimentary doorstep pickup.',
    },
    privacy: {
      title: 'Privacy Policy',
      content:
        'KRESA respects your personal sanctuary. We never sell, rent, or disclose customer contact information, delivery addresses, or purchase history to third-party commercial brokers. All transactions are encrypted via 256-bit SSL gateways.',
    },
    terms: {
      title: 'Terms & Conditions',
      content:
        'All textile and jewellery dimensions, carat weights, and silver purity certificates comply with Bureau of Indian Standards (BIS) norms. Hand-embroidered resham and hand-block variations celebrate authentic artisan individuality.',
    },
    about: {
      title: 'About KRESA - Style Meets Life',
      content:
        'KRESA is an ode to authentic Indian luxury, slow fashion, and heirloom living. Founded on the belief that everyday living deserves ritualistic beauty, we design regal jewellery, modern festive ensembles, structured leather accessories, and hand-sculpted home decor.',
    },
    contact: {
      title: 'Boutique Concierge & Atelier Contact',
      content:
        'Atelier Headquarters: 104, Heritage Arcade, Kala Ghoda, Fort, Mumbai 400001.\nClientele Support: +91 98201 44521\nEmail: concierge@kresa.com\nHours: Monday to Saturday, 10:00 AM – 7:30 PM IST.',
    },
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-stone-800">
          
          {/* Brand Manifesto Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#FAF8F5] uppercase font-medium">
              KRESA
            </span>
            <p className="text-sm font-serif italic text-[#C9A86A] tracking-wider">
              Style Meets Life
            </p>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              Handcrafted luxury fashion, bridal polki jewellery, contemporary festive silhouettes, and artisanal homeware.
              "More Than Just Style... It's a way of life."
            </p>

            {/* Social Media Links with Affordance Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919820144521"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Concierge"
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#E5D7B7] mb-4">
              Atelier Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button
                  onClick={() => openCategory('Fashion Jewellery')}
                  className="hover:text-white transition-colors"
                >
                  Fashion Jewellery
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('Women Clothes')}
                  className="hover:text-white transition-colors"
                >
                  Women Clothes & Silks
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('Accessories')}
                  className="hover:text-white transition-colors"
                >
                  Luxury Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('Decoration Items')}
                  className="hover:text-white transition-colors"
                >
                  Sanctuary Decoration Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    openCategory('All');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors text-[#C9A86A]"
                >
                  Explore Complete Catalogue →
                </button>
              </li>
            </ul>
          </div>

          {/* Clientèle & Policies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#E5D7B7] mb-4">
              Client Care & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button
                  onClick={() => setModalPolicy(policies.about)}
                  className="hover:text-white transition-colors"
                >
                  About KRESA Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalPolicy(policies.shipping)}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalPolicy(policies.returns)}
                  className="hover:text-white transition-colors"
                >
                  7-Day Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalPolicy(policies.privacy)}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalPolicy(policies.terms)}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Boutique Concierge (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#E5D7B7] mb-4">
              Concierge
            </h4>
            <div className="text-xs text-stone-400 font-light space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A86A] mt-0.5 shrink-0" />
                <span>Kala Ghoda, Fort, Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                <span>+91 98201 44521</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                <span>concierge@kresa.com</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setModalPolicy(policies.contact)}
                className="text-[11px] text-[#C9A86A] hover:underline uppercase tracking-wider font-medium"
              >
                Atelier Hours & Appointments
              </button>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Copyright & Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-light gap-4">
          <p>© {new Date().getFullYear()} KRESA Luxury Boutique. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Crafted with devotion for Indian Heritage</span>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => setCurrentView('admin')}
              className="hover:text-stone-300 font-mono text-[11px] transition-colors"
              title="Restricted boutique management console"
            >
              Owner Admin
            </button>
          </div>
        </div>

      </div>

      {/* Policy Content Viewer Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] text-stone-900 max-w-lg w-full p-6 sm:p-8 rounded shadow-2xl relative border-t-4 border-[#C9A86A]">
            <button
              onClick={() => setModalPolicy(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">{modalPolicy.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light whitespace-pre-line">
              {modalPolicy.content}
            </p>
            <div className="mt-6 pt-4 border-t border-stone-200 text-right">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-5 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
