import mongoose from 'mongoose';

const benchmarkSchema = new mongoose.Schema({
  game: { type: String, required: true },
  fps1080p: { type: Number, required: true },
  fps1440p: { type: Number, required: true },
  fps4k: { type: Number, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, sparse: true },
    code: { type: String, trim: true },
    tagline: { type: String },
    description: { type: String },
    category: { 
      type: String, 
      required: true,
      enum: ['4-8 vram', '8-12 vram', '16-24 vram', '24 and above vram']
    },
    vramGB: { type: Number, required: true, min: 1 },
    vramType: { type: String, default: 'GDDR6' },
    busWidth: { type: String, default: '128-bit' },
    coreClock: { type: Number, default: 2000 },
    boostClock: { type: Number, default: 2500 },
    cores: { type: Number, default: 2048 },
    tdpWatts: { type: Number, default: 150 },
    recommendedPsu: { type: Number, default: 550 },
    cooling: { 
      type: String, 
      default: 'Dual Fan',
      enum: ['Dual Fan', 'Triple Fan', 'Liquid Vapor-Chamber', 'Blower Edition']
    },
    lengthMm: { type: Number, default: 240 },
    slots: { type: Number, default: 2 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 10, min: 0 },
    stockUnits: { type: Number, default: 10, min: 0 },
    badge: { 
      type: String,
      enum: ['FLAGSHIP', 'BESTSELLER', 'OVERCLOCKED', 'LIMITED', 'VALUE PICK', 'NEW', ''] 
    },
    mainImage: { type: String, required: true },
    deskImage: { type: String },
    backImage: { type: String },
    portsImage: { type: String },
    fanImage: { type: String },
    images: [{ type: String }],
    ports: [{ type: String }],
    features: [{ type: String }],
    benchmarks: [benchmarkSchema],
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        return ret;
      }
    },
    toObject: { 
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        return ret;
      }
    }
  }
);

// Pre-save hook to generate slug and id if not provided
productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (!this.id) {
    this.id = `gpu-${this._id.toString()}`;
  }
  if (this.stockUnits !== undefined && this.stock === undefined) {
    this.stock = this.stockUnits;
  }
  if (this.stock !== undefined && this.stockUnits === undefined) {
    this.stockUnits = this.stock;
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);
