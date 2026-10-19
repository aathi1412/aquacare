import { repository } from '../../config/store.js';
import { slugify } from '../../utils/slugify.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: List published products with search, category filtering, pagination, and sorting
export async function getProducts(request, reply) {
  const {
    page = 1,
    limit = 12,
    search = '',
    category = '',
    sort = 'newest',
    featured,
  } = request.query || {};

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const filter = { isPublished: true };

  if (category) {
    // Can be category slug or category ID
    const catDoc = await repository.categories.findBySlug(category);
    if (catDoc) {
      filter.category = catDoc._id.toString();
    } else {
      filter.category = category;
    }
  }

  if (search && search.trim()) {
    filter.search = search.trim();
  }

  if (featured === 'true' || featured === true) {
    filter.isFeatured = true;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'name-asc') sortOption = { name: 1 };
  if (sort === 'name-desc') sortOption = { name: -1 };
  if (sort === 'price-asc') sortOption = { price: 1 };
  if (sort === 'price-desc') sortOption = { price: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  const result = await repository.products.find({
    filter,
    page: pageNum,
    limit: limitNum,
    sort: sortOption,
  });

  return successResponse(reply, {
    message: 'Products retrieved successfully.',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    },
  });
}

// Public: Get single product by slug
export async function getProductBySlug(request, reply) {
  const { slug } = request.params;
  const product = await repository.products.findBySlug(slug);

  if (!product || !product.isPublished) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Product not found or is currently unavailable.',
    });
  }

  // Fetch related products in the same category
  const relatedRes = await repository.products.find({
    filter: {
      isPublished: true,
      category: product.category?._id || product.category,
    },
    limit: 4,
  });

  const related = (relatedRes.data || [])
    .filter((p) => p._id.toString() !== product._id.toString())
    .slice(0, 3);

  return successResponse(reply, {
    message: 'Product retrieved successfully.',
    data: {
      ...product.toObject ? product.toObject() : product,
      relatedProducts: related,
    },
  });
}

// Admin: Get all products
export async function getAdminProducts(request, reply) {
  const { page = 1, limit = 20, search = '', category = '', status = '' } = request.query || {};

  const filter = {};
  if (category) filter.category = category;
  if (search && search.trim()) filter.search = search.trim();
  if (status === 'published') filter.isPublished = true;
  if (status === 'draft') filter.isPublished = false;

  const result = await repository.products.find({
    filter,
    page: Math.max(1, parseInt(page, 10)),
    limit: Math.max(1, parseInt(limit, 10)),
    sort: { createdAt: -1 },
  });

  return successResponse(reply, {
    message: 'Admin products retrieved.',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    },
  });
}

// Admin: Get product by ID
export async function getAdminProductById(request, reply) {
  const { id } = request.params;
  const product = await repository.products.findById(id);

  if (!product) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Product not found.',
    });
  }

  return successResponse(reply, {
    message: 'Product details retrieved.',
    data: product,
  });
}

// Admin: Create product
export async function createProduct(request, reply) {
  const body = request.body || {};

  if (!body.name || !body.name.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Product name is required.' });
  }
  if (!body.category) {
    return errorResponse(reply, { statusCode: 400, message: 'Category is required.' });
  }
  if (!body.shortDescription) {
    return errorResponse(reply, { statusCode: 400, message: 'Short description is required.' });
  }

  const slug = slugify(body.slug || body.name);
  const existing = await repository.products.findBySlug(slug);
  if (existing) {
    return errorResponse(reply, {
      statusCode: 409,
      message: 'A product with this slug already exists. Please choose a different slug.',
    });
  }

  // Lookup category to cache name
  const catDoc = await repository.categories.findById(body.category);

  const productData = {
    name: body.name.trim(),
    slug,
    category: body.category,
    categoryName: catDoc ? catDoc.name : '',
    shortDescription: body.shortDescription,
    fullDescription: body.fullDescription || '',
    features: Array.isArray(body.features) ? body.features : [],
    specifications: Array.isArray(body.specifications) ? body.specifications : [],
    purificationTechnology: body.purificationTechnology || 'RO + UV + UF',
    capacity: body.capacity || '',
    warranty: body.warranty || '1 Year Comprehensive Warranty',
    installationInfo: body.installationInfo || 'Free standard installation included.',
    price: body.price !== undefined && body.price !== '' ? Number(body.price) : null,
    priceDisplayMode: body.priceDisplayMode || 'request_price',
    images: Array.isArray(body.images) ? body.images : [],
    threeSixty: body.threeSixty || { isEnabled: false, frames: [], frameCount: 0, sensitivity: 1 },
    seo: body.seo || { title: `${body.name} | AquaCare`, description: body.shortDescription },
    isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
  };

  const created = await repository.products.create(productData);

  return successResponse(reply, {
    statusCode: 201,
    message: 'Product created successfully.',
    data: created,
  });
}

// Admin: Update product
export async function updateProduct(request, reply) {
  const { id } = request.params;
  const body = request.body || {};

  const existing = await repository.products.findById(id);
  if (!existing) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Product not found.',
    });
  }

  const update = { ...body };

  if (body.slug && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const slugTaken = await repository.products.findBySlug(newSlug);
    if (slugTaken && slugTaken._id.toString() !== id.toString()) {
      return errorResponse(reply, {
        statusCode: 409,
        message: 'A product with this slug already exists.',
      });
    }
    update.slug = newSlug;
  }

  if (body.category && body.category !== existing.category?.toString()) {
    const catDoc = await repository.categories.findById(body.category);
    if (catDoc) update.categoryName = catDoc.name;
  }

  const updated = await repository.products.findByIdAndUpdate(id, update);

  return successResponse(reply, {
    message: 'Product updated successfully.',
    data: updated,
  });
}

// Admin: Toggle publish
export async function togglePublishProduct(request, reply) {
  const { id } = request.params;
  const existing = await repository.products.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Product not found.' });
  }

  const updated = await repository.products.findByIdAndUpdate(id, {
    isPublished: !existing.isPublished,
  });

  return successResponse(reply, {
    message: `Product ${updated.isPublished ? 'published' : 'unpublished'} successfully.`,
    data: updated,
  });
}

// Admin: Delete product
export async function deleteProduct(request, reply) {
  const { id } = request.params;
  const existing = await repository.products.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Product not found.' });
  }

  await repository.products.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'Product deleted successfully.',
  });
}

// Admin: Update gallery
export async function updateGallery(request, reply) {
  const { id } = request.params;
  const { images } = request.body || {};

  if (!Array.isArray(images)) {
    return errorResponse(reply, { statusCode: 400, message: 'Images array is required.' });
  }

  const updated = await repository.products.findByIdAndUpdate(id, { images });
  return successResponse(reply, {
    message: 'Gallery updated successfully.',
    data: updated.images,
  });
}

// Admin: Update 360 viewer config
export async function update360Viewer(request, reply) {
  const { id } = request.params;
  const { threeSixty } = request.body || {};

  if (!threeSixty || typeof threeSixty !== 'object') {
    return errorResponse(reply, { statusCode: 400, message: '360 configuration object required.' });
  }

  const updated = await repository.products.findByIdAndUpdate(id, {
    threeSixty: {
      isEnabled: Boolean(threeSixty.isEnabled),
      frames: Array.isArray(threeSixty.frames) ? threeSixty.frames : [],
      frameCount: Array.isArray(threeSixty.frames) ? threeSixty.frames.length : 0,
      sensitivity: Number(threeSixty.sensitivity || 1),
    },
  });

  return successResponse(reply, {
    message: '360-degree viewer configuration updated.',
    data: updated.threeSixty,
  });
}
