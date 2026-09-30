import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { formatPrice } from '../utils/format';

export const ShopPage: React.FC = () => {
  const {
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [priceRange, setPriceRange] = useState<number>(35000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  const categories = [
    'All',
    'Fashion Jewellery',
    'Women Clothes',
    'Accessories',
    'Decoration Items',
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        category: selectedCategoryFilter === 'All' ? undefined : selectedCategoryFilter,
        search: searchQuery || undefined,
        sort: sortOption,
        maxPrice: priceRange < 35000 ? priceRange : undefined,
      });
      if (res.products) {
        setProducts(res.products);
      }
    } catch {
      // Fallback local filtering
      let list = [...INITIAL_PRODUCTS];
      if (selectedCategoryFilter !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (priceRange < 35000) {
        list = list.filter((p) => (p.discountPrice || p.price) <= priceRange);
      }
      if (sortOption === 'price-low') {
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sortOption === 'price-high') {
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sortOption === 'popular') {
        list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
      }
      setProducts(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryFilter, searchQuery, sortOption, priceRange]);

  const visibleProducts = products.slice(0, displayCount);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
            KRESA Catalogue
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1917] tracking-tight">
            {selectedCategoryFilter === 'All' ? 'All Creations' : selectedCategoryFilter}
          </h1>
          <div className="w-12 h-[1px] bg-[#C9A86A] mx-auto mt-3" />
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, fabric, metal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 text-stone-900 placeholder-stone-400 text-xs pl-9 pr-8 py-2.5 focus:outline-none focus:border-[#9E7B36]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 text-xs font-medium text-stone-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="hidden sm:inline uppercase tracking-wider font-light">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36] cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Sidebar Filter (3 cols) */}
          <aside className="hidden md:block md:col-span-3 space-y-8 sticky top-24 bg-[#FAF8F5] border border-[#EAE3D6] p-6">
            
            {/* Category Filter */}
            <div>
              <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-stone-900 mb-4 pb-2 border-b border-[#EAE3D6]">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`w-full text-left py-1.5 px-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'font-semibold text-[#1C1917] bg-[#F5EFE6]'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategoryFilter === cat && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B36]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EAE3D6]">
                <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-stone-900">
                  Max Price
                </h3>
                <span className="text-xs font-mono font-medium text-stone-800 tabular-nums">
                  {formatPrice(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="35000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#9E7B36] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mt-2">
                <span>₹2,000</span>
                <span>₹35,000+</span>
              </div>
            </div>

            {/* Reset Filters button */}
            {(selectedCategoryFilter !== 'All' || searchQuery || priceRange < 35000) && (
              <button
                onClick={() => {
                  setSelectedCategoryFilter('All');
                  setSearchQuery('');
                  setPriceRange(35000);
                }}
                className="w-full py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs uppercase tracking-wider transition-colors"
              >
                Clear All Filters
              </button>
            )}

            {/* Heritage Trust Badge */}
            <div className="pt-4 border-t border-[#EAE3D6] text-center">
              <p className="font-serif italic text-xs text-stone-500">
                All creations undergo two-stage hallmarking and purity checks prior to dispatch.
              </p>
            </div>
          </aside>

          {/* Mobile Filter Slide Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-4/5 max-w-sm bg-[#FAF8F5] h-full p-6 shadow-2xl overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <h3 className="font-serif text-base font-semibold text-stone-900">Filter Catalogue</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedCategoryFilter(c);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left py-2 px-3 text-xs rounded ${
                          selectedCategoryFilter === c ? 'bg-[#1C1917] text-white font-medium' : 'text-stone-700 bg-stone-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="uppercase font-medium">Max Price</span>
                    <span className="font-mono tabular-nums">{formatPrice(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="35000"
                    step="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#9E7B36]"
                  />
                </div>

                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#C9A86A] text-stone-950 font-semibold text-xs uppercase tracking-wider"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Grid Area (9 cols) */}
          <main className="md:col-span-9">
            
            {/* Meta results banner */}
            <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
              <span>
                Showing <strong className="text-stone-800 tabular-nums">{products.length}</strong> creations
                {selectedCategoryFilter !== 'All' && ` in ${selectedCategoryFilter}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-serif text-xs uppercase tracking-widest text-stone-500">Loading Boutique...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center bg-[#F5EFE6] border border-[#EAE3D6] p-8">
                <p className="font-serif text-lg text-stone-800">No creations found matching your filter.</p>
                <p className="text-xs text-stone-500 mt-2 font-light">Try expanding your price range or adjusting keywords.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('All');
                    setSearchQuery('');
                    setPriceRange(35000);
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#1C1917] text-white text-xs uppercase tracking-widest"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Load More Pagination */}
                {displayCount < products.length && (
                  <div className="mt-14 text-center">
                    <button
                      onClick={() => setDisplayCount((prev) => prev + 6)}
                      className="px-8 py-3 bg-[#FAF8F5] border border-stone-800 text-stone-900 hover:bg-[#1C1917] hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                    >
                      Load More ({products.length - displayCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
