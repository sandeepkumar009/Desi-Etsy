import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    artisanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
        validate: [arr => arr.length > 0, 'At least one image is required.']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative.'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative.'],
        default: 0,
    },
    // Status managed by admin for approval
    status: {
        type: String,
        enum: ['pending_approval', 'active', 'inactive', 'rejected', 'suspended'],
        default: 'pending_approval',
    },
    // Aggregated rating fields, updated by a trigger or middleware after a review is added/updated
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be below 5'],
        set: val => Math.round(val * 10) / 10 // Rounds to one decimal place
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    tags: [String], // For enhanced searchability
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ProductSchema.index({ artisanId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
