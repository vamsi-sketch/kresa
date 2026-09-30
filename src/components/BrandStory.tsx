import React from 'react';
import { Award, Feather, ShieldCheck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BrandStory: React.FC = () => {
  const { setCurrentView } = useShop();

  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5] border-t border-[#EAE3D6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Imagery Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#EAE3D6] bg-stone-100 shadow-xl">
              <img
                src="/src/assets/images/hero_fashion_lifestyle_1790689904866.jpg"
                alt="KRESA Artisanal Couture Process"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-900/10" />
            </div>

            {/* Overlapping Floating Quote Card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-[#FAF8F5] border border-[#EAE3D6] p-6 max-w-xs shadow-2xl hidden sm:block">
              <p className="font-serif italic text-sm text-[#1C1917] leading-relaxed">
                "We do not design mere garments or jewellery; we weave ancestral memory into modern couture."
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-widest text-[#9E7B36] font-medium">Boutique Atelier</span>
                <span>Varanasi & Jaipur</span>
              </div>
            </div>
          </div>

          {/* Editorial Story Prose */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
              The KRESA Heritage
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1917] tracking-tight leading-snug">
              More Than Just Style... It's A Way Of Life
            </h2>
            <div className="w-12 h-[1px] bg-[#C9A86A] mt-4 mb-6" />

            <div className="space-y-4 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              <p>
                Founded on the belief that personal adornment is a sacred ritual, KRESA curates timeless
                treasures from India's most celebrated artisanal clusters. Every polki setting, hand-loomed
                organza drape, and hand-beaten brass vessel represents hundreds of hours of patient devotion.
              </p>
              <p>
                From the royal courtly traditions of Rajasthan to the contemporary cosmopolitan salons of Mumbai
                and London, KRESA bridges generational craft with effortless modern silhouettes.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-8 pt-8 border-t border-[#EAE3D6] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="w-9 h-9 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] flex items-center justify-center text-[#9E7B36] mb-3">
                  <Feather className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-stone-900">Noble Fibers</h4>
                <p className="text-xs text-stone-500 mt-1 font-light">Pure silks, spun organzas & natural European linens.</p>
              </div>

              <div>
                <div className="w-9 h-9 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] flex items-center justify-center text-[#9E7B36] mb-3">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-stone-900">Master Guilds</h4>
                <p className="text-xs text-stone-500 mt-1 font-light">Authentic GI-recognized generational artisans.</p>
              </div>

              <div>
                <div className="w-9 h-9 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] flex items-center justify-center text-[#9E7B36] mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-stone-900">Guaranteed Hallmarked</h4>
                <p className="text-xs text-stone-500 mt-1 font-light">Certified non-tarnish micron precious gold finishes.</p>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => setCurrentView('shop')}
                className="px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md cursor-pointer"
              >
                Discover The Atelier
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
