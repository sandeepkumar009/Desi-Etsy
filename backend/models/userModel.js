import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// This model serves all roles: customer, artisan, and admin.
// The 'role' field differentiates them, and the 'artisanProfile' sub-document
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
    password: {
        type: String,
        select: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    authProviders: {
        type: [{
            type: String,
            enum: ['email', 'google']
        }],
        default: [],
    },
    role: {
        type: String,
        enum: ['customer', 'artisan', 'admin'],
        default: 'customer',
    },
    profilePicture: {
        type: String,
        default: 'default-avatar-url.jpg',
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    addresses: [{
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'India' },
        isDefault: { type: Boolean, default: false },
    }],
    // Sub-document for artisan-specific information
    artisanProfile: {
        type: {
            brandName: { type: String, trim: true },
            story: { type: String },
            bannerImage: {
                type: String,
                default: 'default-banner-url.jpg'
            },
            // Status managed by admin
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected', 'suspended'],
                default: 'pending',
            },
            // Placeholder for payout information
            payoutInfo: {
                bankAccountNumber: String,
                ifscCode: String,
            },
        },
        // This sub-document is only required if the role is 'artisan'
        required: function() { return this.role === 'artisan'; },
    },
}, {
    timestamps: true
});

UserSchema.index({ role: 1 });

// Mongoose middleware to hash password before saving a new user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
