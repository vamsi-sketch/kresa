import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { setCurrentView, openCategory } = useShop();

  return (
    <section className="relative overflow-hidden bg-[#F5EFE6]">
      {/* Background Image Container with Measured Scrim */}
      <div className="relative h-[680px] lg:h-[760px] w-full flex items-center justify-center">
        <img
          src="/src/assets/images/hero_fashion_lifestyle_1790689904866.jpg"
          alt="KRESA Luxury Fashion and Lifestyle Editorial Campaign"
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Dual Gradient Scrim ensuring WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/85 via-[#141210]/40 to-[#141210]/30" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#141210]/30 to-[#141210]/70" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-[#FAF8F5] flex flex-col items-center">
          {/* Subtle Brand Insignia / Kicker */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D8BC79] mb-4 font-medium">
            <span>High Luxury Indian Boutique</span>
            <span aria-hidden="true">·</span>
            <span>Est. 2026</span>
          </div>

          {/* Brand Logo Wordmark */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal tracking-[0.18em] uppercase text-[#FBF9F5] drop-shadow-sm leading-tight text-balance">
            KRESA
          </h1>

          {/* Primary & Secondary Taglines */}
          <p className="mt-4 text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#E5D7B7] tracking-wider text-balance">
            Style Meets Life
          </p>

          <p className="mt-3 text-sm sm:text-base text-stone-200/90 font-light max-w-xl mx-auto tracking-wide text-balance leading-relaxed">
            "More Than Just Style... It's a way of life."
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={() => {
                openCategory('All');
                setCurrentView('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C9A86A] hover:bg-[#B39356] text-[#1A1815] text-xs font-semibold uppercase tracking-[0.2em] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('category-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('shop');
              }}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#FAF8F5]/60 hover:border-[#FAF8F5] text-[#FAF8F5] hover:bg-white/10 text-xs font-medium uppercase tracking-[0.2em] transition-all backdrop-blur-xs cursor-pointer"
            >
              Explore Collection
            </button>
          </div>

          {/* Subtle Craftsmanship Pillars (Claim-to-proof) */}
          <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-3 gap-6 sm:gap-12 text-center text-xs tracking-wider text-stone-300">
            <div>
              <p className="font-serif text-base sm:text-lg text-[#E5D7B7] font-semibold">100% Handcrafted</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Artisanal Heritage</p>
            </div>
            <div>
              <p className="font-serif text-base sm:text-lg text-[#E5D7B7] font-semibold">Pure Silks & Brass</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Noble Materials</p>
            </div>
            <div>
              <p className="font-serif text-base sm:text-lg text-[#E5D7B7] font-semibold">Worldwide Express</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Discreet Packaging</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
