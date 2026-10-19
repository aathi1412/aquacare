import { repository } from '../../config/store.js';
import { slugify } from '../../utils/slugify.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Get published services
export async function getServices(request, reply) {
  const services = await repository.services.find({ isPublished: true });
  return successResponse(reply, {
    message: 'Services retrieved successfully.',
    data: services,
  });
}

// Public: Get service by slug
export async function getServiceBySlug(request, reply) {
  const { slug } = request.params;
  const service = await repository.services.findBySlug(slug);

  if (!service || !service.isPublished) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'Service offering not found.',
    });
  }

  return successResponse(reply, {
    message: 'Service retrieved successfully.',
    data: service,
  });
}

// Admin: Get all services
export async function getAdminServices(request, reply) {
  const services = await repository.services.find({});
  return successResponse(reply, {
    message: 'All services retrieved.',
    data: services,
  });
}

// Admin: Create service
export async function createService(request, reply) {
  const body = request.body || {};

  if (!body.name || !body.name.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Service name is required.' });
  }
  if (!body.shortDescription) {
    return errorResponse(reply, { statusCode: 400, message: 'Short description is required.' });
  }

  const slug = slugify(body.slug || body.name);
  const existing = await repository.services.findBySlug(slug);
  if (existing) {
    return errorResponse(reply, { statusCode: 409, message: 'A service with this slug already exists.' });
  }

  const created = await repository.services.create({
    name: body.name.trim(),
    slug,
    shortDescription: body.shortDescription,
    fullDescription: body.fullDescription || '',
    image: body.image || '',
    price: body.price !== undefined && body.price !== '' ? Number(body.price) : null,
    pricingDisplayMode: body.pricingDisplayMode || 'contact_for_pricing',
    serviceConditions: Array.isArray(body.serviceConditions) ? body.serviceConditions : [],
    features: Array.isArray(body.features) ? body.features : [],
    isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : 0,
  });

  return successResponse(reply, {
    statusCode: 201,
    message: 'Service created successfully.',
    data: created,
  });
}

// Admin: Update service
export async function updateService(request, reply) {
  const { id } = request.params;
  const body = request.body || {};

  const existing = await repository.services.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Service not found.' });
  }

  const update = { ...body };
  if (body.slug && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const slugTaken = await repository.services.findBySlug(newSlug);
    if (slugTaken && slugTaken._id.toString() !== id.toString()) {
      return errorResponse(reply, { statusCode: 409, message: 'A service with this slug already exists.' });
    }
    update.slug = newSlug;
  }

  const updated = await repository.services.findByIdAndUpdate(id, update);

  return successResponse(reply, {
    message: 'Service updated successfully.',
    data: updated,
  });
}

// Admin: Delete service
export async function deleteService(request, reply) {
  const { id } = request.params;
  const existing = await repository.services.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Service not found.' });
  }

  await repository.services.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'Service deleted successfully.',
  });
}
