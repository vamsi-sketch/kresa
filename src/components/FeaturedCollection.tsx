import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { INITIAL_PRODUCTS } from '../data/initialData';

export const FeaturedCollection: React.FC = () => {
  const { setCurrentView, openCategory } = useShop();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.filter((p) => p.isFeatured));
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    api.getProducts({ featured: true })
      .then((res) => {
        if (res.products && res.products.length) {
          setProducts(res.products);
        }
      })
      .catch(() => {
        // Fallback to initial
      });
  }, []);

  const categories = ['All', 'Fashion Jewellery', 'Women Clothes', 'Accessories', 'Decoration Items'];

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter((p) => p.category === activeTab);

  return (
    <section className="py-20 lg:py-24 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
              Heirloom Craftsmanship
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1917] tracking-tight">
              Featured Collection
            </h2>
            <div className="w-12 h-[1px] bg-[#C9A86A] mt-3" />
          </div>

          {/* Interactive Filter Controls: Allowed button tabs per constitution */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#1C1917] text-[#E5D7B7] shadow-sm'
                    : 'bg-[#FAF8F5] text-stone-600 hover:text-stone-900 border border-[#EAE3D6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 4 columns desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to Shop All */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              openCategory(activeTab === 'All' ? 'All' : activeTab);
              setCurrentView('shop');
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer group"
          >
            <span>View Full Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
