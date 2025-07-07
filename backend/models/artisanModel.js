const mongoose = require("mongoose");

const artisanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  bio: String,
  isVerified: { type: Boolean, default: false },
  documents: [String],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

module.exports = mongoose.model("Artisan", artisanSchema);
