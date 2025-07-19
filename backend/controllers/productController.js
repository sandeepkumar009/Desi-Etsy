import Product from '../models/productModel.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';


// Controller to get all products with filtering, pagination, and sorting
export const getAllProducts = async (req, res, next) => {
  try {
    // Destructure query parameters with default values
    const {
      page = 1,
      limit = 12,
      search = '',
      category,
      minPrice,
      maxPrice,
      rating,
      sort = 'createdAt', // Default sort by newest
      order = 'desc', // Default order descending
      artisanId // **NEW**: Added artisanId filter
    } = req.query;

    // --- 1. BUILD FILTER QUERY ---
    const filter = {
      status: 'active' // Only fetch active products
    };

    // Add search to filter (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // **NEW**: Add artisanId to filter
    if (artisanId) {
        if (!mongoose.Types.ObjectId.isValid(artisanId)) {
            throw new ApiError(400, "Invalid artisan ID format");
        }
        filter.artisanId = new mongoose.Types.ObjectId(artisanId);
    }

    // Add category to filter
    if (category) {
        if (!mongoose.Types.ObjectId.isValid(category)) {
            throw new ApiError(400, "Invalid category ID format");
        }
        filter.category = new mongoose.Types.ObjectId(category);
    }

    // Add price range to filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Add minimum rating to filter
    if (rating) {
      filter.ratingsAverage = { $gte: Number(rating) };
    }

    // --- 2. BUILD SORT QUERY ---
    const sortOptions = {};
    const allowedSortFields = ['price', 'ratingsAverage', 'createdAt'];
    if (allowedSortFields.includes(sort)) {
        sortOptions[sort] = order === 'asc' ? 1 : -1;
    } else {
        sortOptions['createdAt'] = -1;
    }


    // --- 3. EXECUTE QUERY WITH PAGINATION & SORTING ---
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // --- 4. GET TOTAL COUNT FOR PAGINATION ---
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // --- 5. SEND RESPONSE ---
    res.status(200).json(new ApiResponse(200, {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        limit: limitNum,
      }
    }, 'Products fetched successfully'));

  } catch (err) {
    next(err);
  }
};


export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, tags } = req.body;
    const imageUpload = await uploadOnCloudinary(req.file?.path);
    if (!imageUpload?.url) throw new ApiError(400, 'Image upload failed');

    const product = await Product.create({
      artisanId: req.user._id,
      name,
      description,
      images: [imageUpload.url],
      price,
      category,
      stock,
      tags: tags ? tags.split(',') : []
    });

    res.status(201).json(new ApiResponse(201, product, 'Product created'));
  } catch (err) {
    next(err);
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ artisanId: req.user._id }).populate('category', 'name');
    res.status(200).json(new ApiResponse(200, products, "Artisan's products fetched successfully"));
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');
    if (product.artisanId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to update this product');
    }

    if (req.file) {
      await deleteFromCloudinary(product.images[0]);
      const newImage = await uploadOnCloudinary(req.file.path);
      product.images = [newImage.url];
    }

    const fields = ['name', 'description', 'price', 'category', 'stock', 'tags'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    if (req.body.tags) product.tags = req.body.tags.split(',');
    await product.save();

    res.status(200).json(new ApiResponse(200, product, 'Product updated'));
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');
    if (product.artisanId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'You do not have permission to delete this product');
    }

    await deleteFromCloudinary(product.images[0]);
    await product.deleteOne();

    res.status(200).json(new ApiResponse(200, null, 'Product deleted'));
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: 'active' })
                                  .populate('category', 'name slug')
                                  .populate('artisanId', 'name profilePicture');
                                  
    if (!product) throw new ApiError(404, 'Product not found');
    res.status(200).json(new ApiResponse(200, product));
  } catch (err) {
    next(err);
  }
};
