import { Category, Product, Order, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Fashion Jewellery',
    slug: 'fashion-jewellery',
    description: 'Exquisite handcrafted bridal & festive adornments crafted with artisanal precision and timeless grace.',
    image: '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg',
    itemCount: 6,
  },
  {
    id: 'cat-2',
    name: 'Women Clothes',
    slug: 'women-clothes',
    description: 'Contemporary silhouettes woven from pure silks, organzas, and handcrafted heritage embroideries.',
    image: '/src/assets/images/cat_women_clothes_1790689938768.jpg',
    itemCount: 6,
  },
  {
    id: 'cat-3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Sculptural leather handbags, embroidered potlis, and handcrafted accents that elevate every occasion.',
    image: '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg',
    itemCount: 5,
  },
  {
    id: 'cat-4',
    name: 'Decoration Items',
    slug: 'decoration-items',
    description: 'Hand-poured candles, architectural brass vessels, and heirloom accents for elevated sanctuary living.',
    image: '/src/assets/images/cat_home_decor_1790689969900.jpg',
    itemCount: 5,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Fashion Jewellery
  {
    id: 'prod-fj-1',
    name: 'Padmavati Polki Kundan Choker Set',
    slug: 'padmavati-polki-kundan-choker-set',
    category: 'Fashion Jewellery',
    price: 18500,
    discountPrice: 15999,
    description: 'An ode to royal heritage, handcrafted with uncut polki stones set in 22kt gold-plated brass foil with cultured freshwater drop pearls and fine enamel meenakari reverse work.',
    details: [
      'Handcrafted with raw polki glass stones & freshwater pearls',
      '22k micron gold plating with tarnish-resistant coating',
      'Adjustable dori cord for custom fit',
      'Includes matching statement jhumkas'
    ],
    images: [
      '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg',
      '/src/assets/images/hero_fashion_lifestyle_1790689904866.jpg'
    ],
    rating: 4.9,
    reviewCount: 42,
    stock: 14,
    sizes: ['Free Size'],
    colors: [
      { name: 'Royal Gold & Emerald', hex: '#2C5E43' },
      { name: 'Classic Champagne Ivory', hex: '#EBE5D8' }
    ],
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'prod-fj-2',
    name: 'Gulzar Carved Temple Ear Studs',
    slug: 'gulzar-carved-temple-ear-studs',
    category: 'Fashion Jewellery',
    price: 6800,
    discountPrice: 5499,
    description: 'Intricately chased floral motifs featuring cabochon ruby accents and delicate hanging seed pearls, inspired by historic South Indian temple architecture.',
    details: [
      'Pure brass with antique matte gold finish',
      'Skin-friendly hypoallergenic post-stud closure',
      'Lightweight comfort for all-day festive wear'
    ],
    images: [
      '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'
    ],
    rating: 4.8,
    reviewCount: 29,
    stock: 22,
    sizes: ['Free Size'],
    colors: [
      { name: 'Antique Gold', hex: '#D4AF37' }
    ],
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'prod-fj-3',
    name: 'Noorani Meenakari Navratna Kada',
    slug: 'noorani-meenakari-navratna-kada',
    category: 'Fashion Jewellery',
    price: 9200,
    discountPrice: 7999,
    description: 'A statement hinged cuff bracelet adorned with nine auspicious semi-precious navratna stones and hand-painted floral meenakari detailing.',
    details: [
      'Concealed screw clasp mechanism for seamless elegance',
      'Hand-fired artisan Jaipur meenakari on the inner rim',
      '2.4 to 2.6 expandable wrist circumference'
    ],
    images: [
      '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'
    ],
    rating: 4.7,
    reviewCount: 19,
    stock: 10,
    sizes: ['2.4', '2.6', '2.8'],
    colors: [
      { name: 'Multi-Stone Gold', hex: '#E5C158' }
    ],
    isFeatured: false,
    isNewArrival: true,
    createdAt: '2026-09-10T12:00:00Z'
  },
  {
    id: 'prod-fj-4',
    name: 'Chandrika Filigree Crescent Maang Tikka',
    slug: 'chandrika-filigree-crescent-maang-tikka',
    category: 'Fashion Jewellery',
    price: 4900,
    discountPrice: 3999,
    description: 'Delicate openwork filigree crescent suspended with dainty cluster pearls and a subtle central teardrop zircon, framing the forehead with ethereal radiance.',
    details: [
      'Ultra-lightweight design ensures zero strain',
      'Tarnish-shielded 18k yellow gold polish',
      'Secure hook fastening with hair pin pinout'
    ],
    images: [
      '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'
    ],
    rating: 4.9,
    reviewCount: 31,
    stock: 18,
    sizes: ['Free Size'],
    colors: [
      { name: 'Warm Gold', hex: '#CBA135' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-07-20T08:00:00Z'
  },
  {
    id: 'prod-fj-5',
    name: 'Tara Solitaire Baroque Pearl Drop Necklace',
    slug: 'tara-solitaire-baroque-pearl-drop-necklace',
    category: 'Fashion Jewellery',
    price: 11500,
    discountPrice: 9450,
    description: 'Hand-selected natural baroque pearl cradled in sculpted organic 18kt gold vermeil casing on an Italian box chain.',
    details: [
      'Each baroque pearl is unique in shape and natural iridescence',
      '18kt gold vermeil over sterling silver',
      '18-inch adjustable link chain'
    ],
    images: [
      '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'
    ],
    rating: 5.0,
    reviewCount: 16,
    stock: 8,
    sizes: ['18 Inch'],
    colors: [
      { name: 'Lustrous Pearl & Gold', hex: '#F0EAD6' }
    ],
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-09-15T15:00:00Z'
  },
  {
    id: 'prod-fj-6',
    name: 'Aafreen Layered Jadau Haathphool',
    slug: 'aafreen-layered-jadau-haathphool',
    category: 'Fashion Jewellery',
    price: 8400,
    discountPrice: 6999,
    description: 'Traditional bridal hand ornament featuring delicate pearl chains connecting a center floral medallion ring to an ornamental wrist band.',
    details: [
      'Adjustable ring loop fits all finger sizes',
      'Hand-set micro zircons and synthetic kundan stones',
      'Comes packaged in signature KRESA velvet keepsake case'
    ],
    images: [
      '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'
    ],
    rating: 4.6,
    reviewCount: 12,
    stock: 15,
    sizes: ['Free Size'],
    colors: [
      { name: 'Champagne Gold', hex: '#DFCE9D' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-08-05T09:00:00Z'
  },

  // 2. Women Clothes
  {
    id: 'prod-wc-1',
    name: 'Aura Embroidered Organza Cape & Trouser Set',
    slug: 'aura-embroidered-organza-cape-trouser-set',
    category: 'Women Clothes',
    price: 24500,
    discountPrice: 21999,
    description: 'A sheer champagne organza duster cape embellished with tone-on-tone resham and cutdana embroidery, paired with tailored raw silk cigarette trousers and an inner bustier.',
    details: [
      'Pure silk organza with hand-cut scalloped borders',
      'High-waisted raw silk ankle trousers with concealed side zip',
      'Fully lined with breathable modal satin',
      'Dry clean only'
    ],
    images: [
      '/src/assets/images/cat_women_clothes_1790689938768.jpg',
      '/src/assets/images/hero_fashion_lifestyle_1790689904866.jpg'
    ],
    rating: 4.9,
    reviewCount: 38,
    stock: 9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Champagne Ivory', hex: '#EBE4D5' },
      { name: 'Rose Dust', hex: '#D8B5A7' }
    ],
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-09-12T11:00:00Z'
  },
  {
    id: 'prod-wc-2',
    name: 'Zinnia Draped Concept Pre-Stitched Saree',
    slug: 'zinnia-draped-concept-pre-stitched-saree',
    category: 'Women Clothes',
    price: 28000,
    discountPrice: 24500,
    description: 'Modern effortless luxury. Pre-pleated metallic sheen georgette saree featuring a sculpted crystal-embroidered sweetheart blouse and a cascading pallu drape.',
    details: [
      'Ready-to-wear slip-on design with zero draping hassles',
      'Structured padded blouse with hook-and-eye back closure',
      'Includes handcrafted embellished sash belt'
    ],
    images: [
      '/src/assets/images/hero_fashion_lifestyle_1790689904866.jpg',
      '/src/assets/images/cat_women_clothes_1790689938768.jpg'
    ],
    rating: 5.0,
    reviewCount: 45,
    stock: 7,
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Warm Gold Metallic', hex: '#D8BC79' },
      { name: 'Mocha Taupe', hex: '#8E7970' }
    ],
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'prod-wc-3',
    name: 'Mehrab Chanderi Silk Angrakha Kurti Set',
    slug: 'mehrab-chanderi-silk-angrakha-kurti-set',
    category: 'Women Clothes',
    price: 16500,
    discountPrice: 13999,
    description: 'An elegant crossover Angrakha tunic rendered in woven Chanderi silk with delicate pita zari handwork along the neckline, paired with straight culottes and sheer dupatta.',
    details: [
      'Hand-spun Chanderi silk with authentic zari booti motifs',
      'Gentle flare with handmade fabric latkan tassels',
      'Includes matching embroidered organza dupatta'
    ],
    images: [
      '/src/assets/images/cat_women_clothes_1790689938768.jpg'
    ],
    rating: 4.8,
    reviewCount: 22,
    stock: 16,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pale Sand', hex: '#E7DFC6' },
      { name: 'Powder Sage', hex: '#B8C2B3' }
    ],
    isFeatured: false,
    isNewArrival: true,
    createdAt: '2026-09-08T16:00:00Z'
  },
  {
    id: 'prod-wc-4',
    name: 'Sitara Pleated Festive Silk Kaftan',
    slug: 'sitara-pleated-festive-silk-kaftan',
    category: 'Women Clothes',
    price: 14200,
    discountPrice: 11999,
    description: 'Relaxed opulence. Flowing micro-pleated pure crepe kaftan accented with hand-beaded cuffs and an empire drawstring cinch.',
    details: [
      'Fluid silhouette with luxurious weight and drape',
      'Drawstring inner tie creates customizable silhouette',
      'Hand-beaded glass tube fringe detailing'
    ],
    images: [
      '/src/assets/images/cat_women_clothes_1790689938768.jpg'
    ],
    rating: 4.7,
    reviewCount: 15,
    stock: 12,
    sizes: ['Free Size (Fits XS-XL)'],
    colors: [
      { name: 'Ivory Cream', hex: '#FDFBF7' },
      { name: 'Midnight Onyx', hex: '#1C1917' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-07-28T10:00:00Z'
  },
  {
    id: 'prod-wc-5',
    name: 'Roohani Brocade Banarasi Jacquard Ensemble',
    slug: 'roohani-brocade-banarasi-jacquard-ensemble',
    category: 'Women Clothes',
    price: 32000,
    discountPrice: 28500,
    description: 'Regal Banarasi katan silk woven with rich sona-rupa kadhwa motifs, tailored into a structured jacket kurti paired with voluminous box-pleated sharara.',
    details: [
      'Master artisan weave from Varanasi',
      'Pure silk certified mark with handcrafted finishing',
      'Includes padded inner bodice'
    ],
    images: [
      '/src/assets/images/cat_women_clothes_1790689938768.jpg',
      '/src/assets/images/hero_fashion_lifestyle_1790689904866.jpg'
    ],
    rating: 5.0,
    reviewCount: 27,
    stock: 5,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Royal Antique Gold', hex: '#CFB53B' }
    ],
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-06-30T10:00:00Z'
  },
  {
    id: 'prod-wc-6',
    name: 'Zephyr Linen Relaxed Resort Trench',
    slug: 'zephyr-linen-relaxed-resort-trench',
    category: 'Women Clothes',
    price: 12500,
    discountPrice: 9999,
    description: 'Unstructured breathable European flax linen trench coat with horn button accents and an artisanal braided belt for casual luxury layering.',
    details: [
      '100% sustainable European flax linen',
      'Double-breasted storm flap with storm collar',
      'Deep welt utility pockets'
    ],
    images: [
      '/src/assets/images/cat_women_clothes_1790689938768.jpg'
    ],
    rating: 4.8,
    reviewCount: 18,
    stock: 14,
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Natural Oatmeal', hex: '#DDD2C1' },
      { name: 'Olive Drab', hex: '#636551' }
    ],
    isFeatured: false,
    isNewArrival: true,
    createdAt: '2026-09-18T10:00:00Z'
  },

  // 3. Accessories
  {
    id: 'prod-acc-1',
    name: 'Sovereign Structured Leather Tote',
    slug: 'sovereign-structured-leather-tote',
    category: 'Accessories',
    price: 15500,
    discountPrice: 12999,
    description: 'Architectural handbag handcrafted in supple grained Italian calf leather, framed by brushed gold hardware clasps and a plush microsuede interior.',
    details: [
      'Full grain vegetable-tanned Italian leather',
      'Protective metal base feet and signature turn-lock',
      'Central zippered divider compartment holds 14" laptop',
      'Removable adjustable shoulder strap'
    ],
    images: [
      '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg'
    ],
    rating: 4.9,
    reviewCount: 34,
    stock: 11,
    sizes: ['Medium 34x26x14cm'],
    colors: [
      { name: 'Caramel Toffee', hex: '#A3683F' },
      { name: 'Soft Cream', hex: '#EFE7DA' },
      { name: 'Espresso', hex: '#3B2F2F' }
    ],
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-08-10T11:00:00Z'
  },
  {
    id: 'prod-acc-2',
    name: 'Marigold Zardozi Embellished Velvet Potli',
    slug: 'marigold-zardozi-embellished-velvet-potli',
    category: 'Accessories',
    price: 5200,
    discountPrice: 4299,
    description: 'Opulent micro-velvet evening pouch intricately embroidered with dabka gold wirework and finished with heavy pearl tassels and a beaded handle.',
    details: [
      'Hand-embroidered by generational artisans',
      'Roomy interior fits large smartphone and essentials',
      'Braided metallic drawstring tie with pearl bell accents'
    ],
    images: [
      '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg'
    ],
    rating: 4.8,
    reviewCount: 41,
    stock: 25,
    sizes: ['Standard 22x20cm'],
    colors: [
      { name: 'Wine Velvet', hex: '#581825' },
      { name: 'Ivory Gold', hex: '#EAE1CE' }
    ],
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-09-02T13:00:00Z'
  },
  {
    id: 'prod-acc-3',
    name: 'Verona Sculpted Acetate Sunglasses',
    slug: 'verona-sculpted-acetate-sunglasses',
    category: 'Accessories',
    price: 7500,
    discountPrice: 6200,
    description: 'Chic rounded cat-eye frames milled from bio-acetate with custom 24k gold-inlaid temples and category 3 UV400 polarized gradient lenses.',
    details: [
      '100% UVA/UVB protection with anti-reflective back coating',
      'Reinforced German barrel hinges for durability',
      'Includes hard leather carrying case and microfiber cloth'
    ],
    images: [
      '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg'
    ],
    rating: 4.7,
    reviewCount: 20,
    stock: 19,
    sizes: ['Universal 52-19-145'],
    colors: [
      { name: 'Honey Tortoise', hex: '#8B5A2B' },
      { name: 'Gloss Black', hex: '#111111' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-07-15T09:00:00Z'
  },
  {
    id: 'prod-acc-4',
    name: 'Kashmir Mulberry Silk Twill Stole',
    slug: 'kashmir-mulberry-silk-twill-stole',
    category: 'Accessories',
    price: 6400,
    discountPrice: 5199,
    description: 'Sumptuous 16 momme pure mulberry silk scarf printed with bespoke heritage Mughal court flora motifs and hand-rolled edges.',
    details: [
      '100% natural mulberry silk with lustrous twill weave',
      'Hand-rolled and hand-stitched borders',
      'Generous 200cm x 70cm wrap dimensions'
    ],
    images: [
      '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg'
    ],
    rating: 4.9,
    reviewCount: 28,
    stock: 15,
    sizes: ['200 x 70 cm'],
    colors: [
      { name: 'Sand & Gold Print', hex: '#D2B48C' }
    ],
    isFeatured: false,
    isNewArrival: true,
    createdAt: '2026-09-14T11:00:00Z'
  },
  {
    id: 'prod-acc-5',
    name: 'Eos Monogram Sculptural Buckle Belt',
    slug: 'eos-monogram-sculptural-buckle-belt',
    category: 'Accessories',
    price: 4800,
    discountPrice: 3999,
    description: 'Waist-defining genuine bridle leather belt anchored by an organic fluid sculptural clasp cast in antique brushed gold alloy.',
    details: [
      'Vegetable-tanned full leather with burnished edge finish',
      'Wearable at natural waist or low hip',
      '30mm width fits standard loops or over draped sarees and coats'
    ],
    images: [
      '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg'
    ],
    rating: 4.6,
    reviewCount: 14,
    stock: 20,
    sizes: ['75cm', '85cm', '95cm'],
    colors: [
      { name: 'Cognac Brown', hex: '#9E472A' },
      { name: 'Classic Black', hex: '#1F1F1F' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-08-25T14:00:00Z'
  },

  // 4. Decoration Items
  {
    id: 'prod-dec-1',
    name: 'Suryoday Fluted Solid Brass Urli',
    slug: 'suryoday-fluted-solid-brass-urli',
    category: 'Decoration Items',
    price: 8900,
    discountPrice: 7499,
    description: 'An architectural heirloom piece. Heavy hand-turned solid brass decorative vessel with scalloped fluting, ideal for floating water blossoms and brass tea lights.',
    details: [
      '100% pure heavy virgin brass (approx 2.4 kg weight)',
      'Hand-buffed natural satin wax coating',
      '32 cm diameter statement center-piece'
    ],
    images: [
      '/src/assets/images/cat_home_decor_1790689969900.jpg'
    ],
    rating: 4.9,
    reviewCount: 36,
    stock: 12,
    sizes: ['32cm Large', '24cm Medium'],
    colors: [
      { name: 'Brushed Heritage Brass', hex: '#C5A059' }
    ],
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-09-04T12:00:00Z'
  },
  {
    id: 'prod-dec-2',
    name: 'Oud & Saffron Luxury Soy Wax Urn Candle',
    slug: 'oud-saffron-luxury-soy-wax-urn-candle',
    category: 'Decoration Items',
    price: 3600,
    discountPrice: 2999,
    description: 'Hand-poured 100% natural botanical soy candle housed in a reusable artisanal ribbed ceramic vessel with wooden crackling wicks. Notes of rare Cambodian oud, Kashmiri saffron, and warm golden amber.',
    details: [
      '80+ hours clean soot-free burn time',
      'Dual organic FSC-certified crackling wood wicks',
      'Phthalate-free and paraben-free natural essential fragrance oils'
    ],
    images: [
      '/src/assets/images/cat_home_decor_1790689969900.jpg'
    ],
    rating: 4.9,
    reviewCount: 52,
    stock: 30,
    sizes: ['450g / 16 oz'],
    colors: [
      { name: 'Warm Terracotta Urn', hex: '#BA6D54' },
      { name: 'Ivory Matte Stone', hex: '#EAE6DF' }
    ],
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-08-12T14:00:00Z'
  },
  {
    id: 'prod-dec-3',
    name: 'Vanya Sculpted Wabi-Sabi Stoneware Vessel',
    slug: 'vanya-sculpted-wabi-sabi-stoneware-vessel',
    category: 'Decoration Items',
    price: 6200,
    discountPrice: 4999,
    description: 'An organic asymmetric vase thrown on the wheel by master potters, celebrating subtle imperfections, raw earthy textures, and architectural silhouettes.',
    details: [
      'High-fired durable stoneware ceramic',
      'Waterproof interior glaze suitable for fresh blooms or dry pampas',
      '38cm height statement floor or console accent'
    ],
    images: [
      '/src/assets/images/cat_home_decor_1790689969900.jpg'
    ],
    rating: 4.8,
    reviewCount: 19,
    stock: 8,
    sizes: ['38cm Tall'],
    colors: [
      { name: 'Textured Sand Beige', hex: '#D8CBB8' }
    ],
    isFeatured: false,
    isNewArrival: true,
    createdAt: '2026-09-17T09:00:00Z'
  },
  {
    id: 'prod-dec-4',
    name: 'Ananta Inlaid Makrana Marble Coaster Set',
    slug: 'ananta-inlaid-makrana-marble-coaster-set',
    category: 'Decoration Items',
    price: 4400,
    discountPrice: 3499,
    description: 'Set of four hexagonal coasters hand-cut from authentic white Makrana marble and accented with brass geometric inlay lines and cork bottom protection.',
    details: [
      'Pure Indian Makrana marble with natural grey veining',
      'Sealed against stains and water condensation',
      'Set includes custom brass storage caddy'
    ],
    images: [
      '/src/assets/images/cat_home_decor_1790689969900.jpg'
    ],
    rating: 4.7,
    reviewCount: 23,
    stock: 25,
    sizes: ['Set of 4 (10cm each)'],
    colors: [
      { name: 'White Marble & Brass', hex: '#F3F2EE' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-07-22T13:00:00Z'
  },
  {
    id: 'prod-dec-5',
    name: 'Dhara Hand-Carved Teakwood Decorative Platter',
    slug: 'dhara-hand-carved-teakwood-decorative-platter',
    category: 'Decoration Items',
    price: 5800,
    discountPrice: 4800,
    description: 'Carved from reclaimed aged teakwood by Saharanpur woodcraft artisans, featuring a rich organic grain and gentle curved lip for table styling.',
    details: [
      '100% sustainable reclaimed seasoned teakwood',
      'Food-safe organic cold-pressed oil finish',
      '45cm x 22cm elongated oval serving or vanity tray'
    ],
    images: [
      '/src/assets/images/cat_home_decor_1790689969900.jpg'
    ],
    rating: 4.8,
    reviewCount: 14,
    stock: 11,
    sizes: ['45cm Length'],
    colors: [
      { name: 'Natural Honey Teak', hex: '#875638' }
    ],
    isFeatured: false,
    isNewArrival: false,
    createdAt: '2026-08-18T10:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KRE-91823',
    userId: 'user-cust-1',
    customerName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98201 44521',
    address: {
      street: '402, Mayfair Towers, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    items: [
      {
        productId: 'prod-fj-1',
        name: 'Padmavati Polki Kundan Choker Set',
        image: '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg',
        category: 'Fashion Jewellery',
        price: 15999,
        quantity: 1,
        selectedSize: 'Free Size',
        selectedColor: 'Royal Gold & Emerald'
      },
      {
        productId: 'prod-dec-2',
        name: 'Oud & Saffron Luxury Soy Wax Urn Candle',
        image: '/src/assets/images/cat_home_decor_1790689969900.jpg',
        category: 'Decoration Items',
        price: 2999,
        quantity: 1,
        selectedSize: '450g / 16 oz',
        selectedColor: 'Warm Terracotta Urn'
      }
    ],
    subtotal: 18998,
    deliveryFee: 0,
    discount: 500,
    total: 18498,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'Paid',
    status: 'Shipped',
    createdAt: '2026-09-25T11:20:00Z',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-09-25T11:20:00Z', note: 'Order received and verified' },
      { status: 'Confirmed', timestamp: '2026-09-25T12:00:00Z', note: 'Payment verified via UPI' },
      { status: 'Processing', timestamp: '2026-09-25T14:30:00Z', note: 'Items allocated from Mumbai warehouse' },
      { status: 'Packed', timestamp: '2026-09-26T10:15:00Z', note: 'Carefully wrapped in signature gift box' },
      { status: 'Shipped', timestamp: '2026-09-27T08:45:00Z', note: 'Dispatched via BlueDart Express (AWB: BD881923)' }
    ]
  },
  {
    id: 'KRE-91824',
    userId: 'user-cust-2',
    customerName: 'Priya Mehra',
    email: 'priya.mehra@example.com',
    phone: '+91 98112 39912',
    address: {
      street: 'Villa 14, Magnolia Enclave, Golf Course Road',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002'
    },
    items: [
      {
        productId: 'prod-wc-1',
        name: 'Aura Embroidered Organza Cape & Trouser Set',
        image: '/src/assets/images/cat_women_clothes_1790689938768.jpg',
        category: 'Women Clothes',
        price: 21999,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Champagne Ivory'
      }
    ],
    subtotal: 21999,
    deliveryFee: 0,
    discount: 0,
    total: 21999,
    paymentMethod: 'CARD',
    paymentStatus: 'Paid',
    status: 'Processing',
    createdAt: '2026-09-28T09:15:00Z',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-09-28T09:15:00Z', note: 'Order received' },
      { status: 'Confirmed', timestamp: '2026-09-28T09:30:00Z', note: 'Card transaction authorized' },
      { status: 'Processing', timestamp: '2026-09-28T14:00:00Z', note: 'Artisan hand-embroidery inspection' }
    ]
  },
  {
    id: 'KRE-91825',
    userId: 'user-cust-3',
    customerName: 'Kavita Reddy',
    email: 'kavita.reddy@example.com',
    phone: '+91 97010 77281',
    address: {
      street: 'Plot 88, Road No. 10, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    items: [
      {
        productId: 'prod-acc-1',
        name: 'Sovereign Structured Leather Tote',
        image: '/src/assets/images/cat_lifestyle_accessories_1790689953785.jpg',
        category: 'Accessories',
        price: 12999,
        quantity: 1,
        selectedSize: 'Medium 34x26x14cm',
        selectedColor: 'Caramel Toffee'
      }
    ],
    subtotal: 12999,
    deliveryFee: 0,
    discount: 0,
    total: 12999,
    paymentMethod: 'COD',
    paymentStatus: 'Cash On Delivery',
    status: 'Delivered',
    createdAt: '2026-09-20T16:00:00Z',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-09-20T16:00:00Z', note: 'Order placed via COD' },
      { status: 'Confirmed', timestamp: '2026-09-20T16:45:00Z', note: 'Phone verification confirmed' },
      { status: 'Packed', timestamp: '2026-09-21T11:00:00Z', note: 'Packed with luxury dustbag' },
      { status: 'Shipped', timestamp: '2026-09-22T09:00:00Z', note: 'Dispatched to Hyderabad hub' },
      { status: 'Out for Delivery', timestamp: '2026-09-24T08:30:00Z', note: 'Out with delivery associate' },
      { status: 'Delivered', timestamp: '2026-09-24T14:10:00Z', note: 'Delivered & COD cash collected' }
    ]
  },
  {
    id: 'KRE-91826',
    customerName: 'Rohan Kapoor',
    email: 'rohan.kapoor@example.com',
    phone: '+91 99100 88219',
    address: {
      street: '12-B, Defence Colony, Ring Road',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024'
    },
    items: [
      {
        productId: 'prod-dec-1',
        name: 'Suryoday Fluted Solid Brass Urli',
        image: '/src/assets/images/cat_home_decor_1790689969900.jpg',
        category: 'Decoration Items',
        price: 7499,
        quantity: 1,
        selectedSize: '32cm Large',
        selectedColor: 'Brushed Heritage Brass'
      }
    ],
    subtotal: 7499,
    deliveryFee: 0,
    discount: 0,
    total: 7499,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'Paid',
    status: 'Order Placed',
    createdAt: '2026-09-29T04:30:00Z',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-09-29T04:30:00Z', note: 'Order placed by customer' }
    ]
  }
];

export const INITIAL_CUSTOMERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98201 44521',
    role: 'customer',
    createdAt: '2026-05-10T12:00:00Z',
    ordersCount: 3,
    totalSpend: 46200,
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        street: '402, Mayfair Towers, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        isDefault: true
      }
    ]
  },
  {
    id: 'user-cust-2',
    name: 'Priya Mehra',
    email: 'priya.mehra@example.com',
    phone: '+91 98112 39912',
    role: 'customer',
    createdAt: '2026-06-18T14:30:00Z',
    ordersCount: 2,
    totalSpend: 38499,
    savedAddresses: [
      {
        id: 'addr-2',
        label: 'Residence',
        street: 'Villa 14, Magnolia Enclave, Golf Course Road',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        isDefault: true
      }
    ]
  },
  {
    id: 'user-cust-3',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@example.com',
    phone: '+91 97010 77281',
    role: 'customer',
    createdAt: '2026-07-02T08:15:00Z',
    ordersCount: 1,
    totalSpend: 12999,
    savedAddresses: [
      {
        id: 'addr-3',
        label: 'Villa',
        street: 'Plot 88, Road No. 10, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        isDefault: true
      }
    ]
  }
];
