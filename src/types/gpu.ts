export type GPUCategory = '4-8 vram' | '8-12 vram' | '16-24 vram' | '24 and above vram';

export interface GPUBenchmark {
  game: string;
  fps1080p: number;
  fps1440p: number;
  fps4k: number;
}

export interface GPUProduct {
  id: string;
  name: string;
  code: string;
  tagline: string;
  category: GPUCategory;
  vramGB: number;
  vramType: 'GDDR6' | 'GDDR6X' | 'HBM3e';
  busWidth: string;
  coreClock: number; // MHz
  boostClock: number; // MHz
  cores: number; // Shader/Stream Processors or Compute Units
  tdpWatts: number;
  recommendedPsu: number;
  cooling: 'Dual Fan' | 'Triple Fan' | 'Liquid Vapor-Chamber' | 'Blower Edition';
  lengthMm: number;
  slots: number;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockUnits: number;
  badge?: 'FLAGSHIP' | 'BESTSELLER' | 'OVERCLOCKED' | 'LIMITED' | 'VALUE PICK' | 'NEW';
  mainImage: string;
  deskImage?: string;
  backImage?: string;
  portsImage?: string;
  fanImage?: string;
  benchmarks: GPUBenchmark[];
  ports: string[];
  features: string[];
}

export interface DeskShowcaseItem {
  id: string;
  image: string;
  title: string;
  setupDescription: string;
  featuredCardName: string;
  cardId: string;
  lightingTheme: string;
}

export interface CartItem {
  product: GPUProduct;
  quantity: number;
}

export interface FilterState {
  search: string;
  category: string; // 'all' or specific GPUCategory
  cooling: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'vram-desc' | 'rating-desc';
}
