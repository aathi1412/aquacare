import { repository } from '../../config/store.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Submit service request
export async function createServiceRequest(request, reply) {
  const {
    customerName,
    phone,
    email,
    location,
    serviceType,
    productModel,
    preferredDate,
    message,
  } = request.body || {};

  if (!customerName || !customerName.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please provide your full name.' });
  }
  if (!phone || !phone.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please provide your contact phone number.' });
  }
  if (!location || !location.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please provide your service area or address.' });
  }
  if (!serviceType || !serviceType.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please choose the required service type.' });
  }
  if (!message || !message.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Please describe your request or water issue.' });
  }

  const created = await repository.serviceRequests.create({
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    location: location.trim(),
    serviceType: serviceType.trim(),
    productModel: productModel ? productModel.trim() : '',
    preferredDate: preferredDate || '',
    message: message.trim(),
    status: 'New',
    internalNotes: '',
  });

  return successResponse(reply, {
    statusCode: 201,
    message: 'Your service request has been logged successfully. A service coordinator will confirm your appointment shortly.',
    data: {
      id: created._id,
      customerName: created.customerName,
      serviceType: created.serviceType,
      status: created.status,
      createdAt: created.createdAt,
    },
  });
}

// Admin: Get all service requests
export async function getAdminServiceRequests(request, reply) {
  const { page = 1, limit = 20, status = '', search = '' } = request.query || {};

  const filter = {};
  if (status) filter.status = status;
  if (search && search.trim()) filter.search = search.trim();

  const result = await repository.serviceRequests.find({
    filter,
    page: Math.max(1, parseInt(page, 10)),
    limit: Math.max(1, parseInt(limit, 10)),
    sort: { createdAt: -1 },
  });

  return successResponse(reply, {
    message: 'Service requests retrieved.',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    },
  });
}

// Admin: Update service request status & notes
export async function updateServiceRequestStatus(request, reply) {
  const { id } = request.params;
  const { status, internalNotes } = request.body || {};

  const existing = await repository.serviceRequests.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Service request not found.' });
  }

  const update = {};
  if (status) {
    const validStatuses = ['New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
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

  const updated = await repository.serviceRequests.findByIdAndUpdate(id, update);

  return successResponse(reply, {
    message: 'Service request updated successfully.',
    data: updated,
  });
}

// Admin: Delete service request
export async function deleteServiceRequest(request, reply) {
  const { id } = request.params;
  const existing = await repository.serviceRequests.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Service request not found.' });
  }

  await repository.serviceRequests.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'Service request record deleted.',
  });
}
