import { repository } from '../../config/store.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Submit a product enquiry
export async function createEnquiry(request, reply) {
  const { customerName, phone, email, product, productName, message, sourcePage } = request.body || {};

  if (!customerName || !customerName.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please provide your name.' });
  }
  if (!phone || !phone.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please provide your contact phone number.' });
  }
  if (!message || !message.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please enter your enquiry message.' });
  }

  // Look up product if ID is provided
  let resolvedProductName = productName || '';
  if (product && !resolvedProductName) {
    const prod = await repository.products.findById(product);
    if (prod) resolvedProductName = prod.name;
  }

  const created = await repository.enquiries.create({
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    product: product || null,
    productName: resolvedProductName,
    message: message.trim(),
    sourcePage: sourcePage || '',
    status: 'New',
    internalNotes: '',
  });

  return successResponse(reply, {
    statusCode: 201,
    message: 'Thank you! Your product enquiry has been received. Our water specialist will contact you shortly.',
    data: {
      id: created._id,
      customerName: created.customerName,
      status: created.status,
      createdAt: created.createdAt,
    },
  });
}

// Admin: Get all enquiries
export async function getAdminEnquiries(request, reply) {
  const { page = 1, limit = 20, status = '', search = '' } = request.query || {};

  const filter = {};
  if (status) filter.status = status;
  if (search && search.trim()) filter.search = search.trim();

  const result = await repository.enquiries.find({
    filter,
    page: Math.max(1, parseInt(page, 10)),
    limit: Math.max(1, parseInt(limit, 10)),
    sort: { createdAt: -1 },
  });

  return successResponse(reply, {
    message: 'Enquiries retrieved.',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    },
  });
}

// Admin: Update enquiry status & notes
export async function updateEnquiryStatus(request, reply) {
  const { id } = request.params;
  const { status, internalNotes } = request.body || {};

  const existing = await repository.enquiries.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Enquiry not found.' });
  }

  const update = {};
  if (status) {
    const validStatuses = ['New', 'Contacted', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return errorResponse(reply, {
        statusCode: 400,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }
    update.status = status;
  }
  if (internalNotes !== undefined) {
    update.internalNotes = internalNotes;
  }

  const updated = await repository.enquiries.findByIdAndUpdate(id, update);

  return successResponse(reply, {
    message: 'Enquiry updated successfully.',
    data: updated,
  });
}

// Admin: Delete enquiry
export async function deleteEnquiry(request, reply) {
  const { id } = request.params;
  const existing = await repository.enquiries.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Enquiry not found.' });
  }

  await repository.enquiries.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'Enquiry record deleted.',
  });
}
