import Product from '../models/productModel.js';
import User from '../models/userModel.js'; 
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
import { createNotification } from '../utils/notificationUtils.js'; 

export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search = '', category, minPrice, maxPrice, rating, sort = 'createdAt', order = 'desc', artisanId } = req.query;
    const filter = { status: 'active' };
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (artisanId) {
      if (!mongoose.Types.ObjectId.isValid(artisanId)) throw new ApiError(400, "Invalid artisan ID format");
      filter.artisanId = new mongoose.Types.ObjectId(artisanId);
    }
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) throw new ApiError(400, "Invalid category ID format");
      filter.category = new mongoose.Types.ObjectId(category);
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (rating) filter.ratingsAverage = { $gte: Number(rating) };
    const sortOptions = {};
    const allowedSortFields = ['price', 'ratingsAverage', 'createdAt'];
    if (allowedSortFields.includes(sort)) {
      sortOptions[sort] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions['createdAt'] = -1;
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const products = await Product.find(filter).populate('category', 'name').sort(sortOptions).skip(skip).limit(limitNum);
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);
    res.status(200).json(new ApiResponse(200, { products, pagination: { currentPage: pageNum, totalPages, totalProducts, limit: limitNum, } }, 'Products fetched successfully'));
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

    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
        await createNotification(
            admin._id,
            `New product '${product.name}' requires approval.`,
            `/admin/product-approval`,
            'admin'
        );
    }

    res.status(201).json(new ApiResponse(201, product, 'Product created successfully and is pending review.'));
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

export const getProductsForAdmin = async (req, res, next) => {
  try {
    const { status = 'all' } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const products = await Product.find(query)
      .populate('artisanId', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully for admin.'));
  } catch (err) {
    next(err);
  }
};

export const updateProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'rejected', 'suspended'].includes(status)) {
      throw new ApiError(400, 'Invalid status provided. Must be "active", "rejected", or "suspended".');
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found.');
    }

    product.status = status;
    await product.save();

    const statusMessage = status.charAt(0).toUpperCase() + status.slice(1);
    await createNotification(
        product.artisanId,
        `Your product '${product.name}' has been ${statusMessage}.`,
        `/seller/products`,
        'artisan'
    );

    res.status(200).json(new ApiResponse(200, product, `Product has been ${status}.`));
  } catch (err) {
    next(err);
  }
};
