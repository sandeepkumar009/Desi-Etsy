import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// A helper function to generate a URL-friendly slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

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

export const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        throw new ApiError(400, 'Category name is required.');
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        throw new ApiError(400, 'Category with this name already exists.');
    }

    const category = await Category.create({
        name,
        slug: generateSlug(name),
        description,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, category, 'Category created successfully.'));
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, 'Category not found.');
    }

    if (name) {
        category.name = name;
        category.slug = generateSlug(name);
    }
    if (description) {
        category.description = description;
    }

    const updatedCategory = await category.save();
    res.status(200).json(new ApiResponse(200, updatedCategory, 'Category updated successfully.'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, 'Category not found.');
    }
    
    await category.deleteOne();

    res.status(200).json(new ApiResponse(200, {}, 'Category deleted successfully.'));
});
