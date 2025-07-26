import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Static method to calculate average ratings and update the product
ReviewSchema.statics.calculateAverageRatings = async function(productId) {
    const stats = await this.aggregate([
        {
            $match: { productId: productId }
        },
        {
            $group: {
                _id: '$productId',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    const Product = mongoose.model('Product');
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 0
        });
    }
};

// Call calculateAverageRatings after a review is saved
ReviewSchema.post('save', function() {
    this.constructor.calculateAverageRatings(this.productId);
});

// Call calculateAverageRatings when a review is deleted/updated
// findByIdAndUpdate and findByIdAndDelete trigger the 'findOneAnd' hooks
ReviewSchema.post(/^findOneAnd/, async function(doc) {
    if (doc) {
        await doc.constructor.calculateAverageRatings(doc.productId);
    }
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
