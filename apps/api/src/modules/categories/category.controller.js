import { repository } from '../../config/store.js';
import { slugify } from '../../utils/slugify.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Get published categories
export async function getCategories(request, reply) {
  const categories = await repository.categories.find({ isPublished: true });
  return successResponse(reply, {
    message: 'Categories retrieved successfully.',
    data: categories,
  });
}

// Public: Get category by slug
export async function getCategoryBySlug(request, reply) {
  const { slug } = request.params;
  const category = await repository.categories.findBySlug(slug);

  if (!category || !category.isPublished) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Category not found.',
    });
  }

  return successResponse(reply, {
    message: 'Category retrieved successfully.',
    data: category,
  });
}

// Admin: Get all categories
export async function getAdminCategories(request, reply) {
  const categories = await repository.categories.find({});
  return successResponse(reply, {
    message: 'All categories retrieved successfully.',
    data: categories,
  });
}

// Admin: Create category
export async function createCategory(request, reply) {
  const { name, slug, description, image, displayOrder, isPublished } = request.body || {};

  if (!name || !name.trim()) {
    return errorResponse(reply, {
      statusCode: 400,
      message: 'Category name is required.',
    });
  }

  const resolvedSlug = slugify(slug || name);
  const existing = await repository.categories.findBySlug(resolvedSlug);
  if (existing) {
    return errorResponse(reply, {
      statusCode: 409,
      message: 'A category with this slug already exists.',
    });
  }

  const category = await repository.categories.create({
    name: name.trim(),
    slug: resolvedSlug,
    description: description || '',
    image: image || '',
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
  });

  return successResponse(reply, {
    statusCode: 201,
    message: 'Category created successfully.',
    data: category,
  });
}

// Admin: Update category
export async function updateCategory(request, reply) {
  const { id } = request.params;
  const { name, slug, description, image, displayOrder, isPublished } = request.body || {};

  const existing = await repository.categories.findById(id);
  if (!existing) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Category not found.',
    });
  }

  const update = {};
  if (name !== undefined) update.name = name.trim();
  if (slug !== undefined) update.slug = slugify(slug);
  if (description !== undefined) update.description = description;
  if (image !== undefined) update.image = image;
  if (displayOrder !== undefined) update.displayOrder = Number(displayOrder);
  if (isPublished !== undefined) update.isPublished = Boolean(isPublished);

  // If slug is changed, check uniqueness
  if (update.slug && update.slug !== existing.slug) {
    const slugExists = await repository.categories.findBySlug(update.slug);
    if (slugExists && slugExists._id.toString() !== id.toString()) {
      return errorResponse(reply, {
        statusCode: 409,
        message: 'A category with this slug already exists.',
      });
    }
  }

  const updated = await repository.categories.findByIdAndUpdate(id, update);

  return successResponse(reply, {
    message: 'Category updated successfully.',
    data: updated,
  });
}

// Admin: Delete category safely
export async function deleteCategory(request, reply) {
  const { id } = request.params;

  const existing = await repository.categories.findById(id);
  if (!existing) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Category not found.',
    });
  }

  // Safe deletion check: prevent if products are using this category
  const productCount = await repository.products.countDocuments({ category: id });
  if (productCount > 0) {
    return errorResponse(reply, {
      statusCode: 400,
      message: `Cannot delete category "${existing.name}". It is currently assigned to ${productCount} product(s). Please reassign or delete those products first.`,
    });
  }

  await repository.categories.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'Category deleted successfully.',
  });
}
