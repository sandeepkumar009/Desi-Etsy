import mongoose from 'mongoose';

// Product Category Model * Manages the different categories products can belong to. * Managed by admins.
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // URL-friendly version of the name, can be auto-generated from the name
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
    },
    // Reference to the admin who created the category
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

export default Category;
