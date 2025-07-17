import Product from '../models/productModel.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
    const products = await Product.find({ artisanId: req.user._id });
    res.status(200).json(new ApiResponse(200, products));
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

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'active' });
    res.status(200).json(new ApiResponse(200, products));
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: 'active' });
    if (!product) throw new ApiError(404, 'Product not found');
    res.status(200).json(new ApiResponse(200, product));
  } catch (err) {
    next(err);
  }
};
