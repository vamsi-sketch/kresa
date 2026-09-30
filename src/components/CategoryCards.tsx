import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { INITIAL_CATEGORIES } from '../data/initialData';

export const CategoryCards: React.FC = () => {
  const { openCategory } = useShop();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    api.getCategories()
      .then((res) => {
        if (res.categories && res.categories.length) {
          setCategories(res.categories);
        }
      })
      .catch(() => {
        // fallback to initial
      });
  }, []);

  return (
    <section id="category-section" className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
            Curated Universes
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1917] tracking-tight">
            Explore By Category
          </h2>
          <div className="w-12 h-[1px] bg-[#C9A86A] mx-auto mt-4" />
          <p className="mt-4 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            From imperial uncut polki jewellery and modern couture drapes to artisanal brass accents and statement leathercraft.
          </p>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || cat.name}
              onClick={() => openCategory(cat.name)}
              className="group cursor-pointer bg-[#F5EFE6] border border-[#EAE2D5] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#C9A86A]/60"
            >
              {/* Card Image Container with 4:3 Aspect Ratio and Zoom on Hover */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback container image
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Fallback pattern if image is missing */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Editorial Index */}
                <span className="absolute top-4 left-4 text-xs font-serif italic text-white/90 tracking-widest">
                  0{idx + 1}
                </span>

                {/* Item Count Unboxed Metadata */}
                {cat.itemCount !== undefined && (
                  <span className="absolute top-4 right-4 text-[11px] uppercase tracking-wider text-white/90 font-light">
                    {cat.itemCount} Designs
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow justify-between bg-[#FAF8F5]">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#1C1917] group-hover:text-[#9E7B36] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-stone-600 line-clamp-2 font-light leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE2D5] flex items-center justify-between text-xs uppercase tracking-[0.18em] font-medium text-[#1C1917] group-hover:text-[#9E7B36]">
                  <span>Explore Universe</span>
                  <div className="w-7 h-7 rounded-full bg-[#F5EFE6] border border-[#EAE2D5] flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:bg-[#C9A86A] group-hover:text-white group-hover:border-[#C9A86A]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
