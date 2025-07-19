import Category from '../models/categoryModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllCategories = async (req, res, next) => {
  try {
    // Find all categories and sort them by name alphabetically
    const categories = await Category.find({}).sort({ name: 1 });

    if (!categories) {
        throw new ApiError(404, "No categories found");
    }

    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
  } catch (err) {
    next(err);
  }
};
