import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  category: { type: String },
  tags: [String],
  images: [String],
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
