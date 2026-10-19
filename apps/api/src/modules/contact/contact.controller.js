import { repository } from '../../config/store.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Submit contact message
export async function createContactMessage(request, reply) {
  const { name, phone, email, subject, message } = request.body || {};

  if (!name || !name.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Name is required.' });
  }
  if (!phone || !phone.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Phone number is required.' });
  }
  if (!email || !email.trim() || !email.includes('@')) {
    return errorResponse(reply, { statusCode: 400, message: 'A valid email address is required.' });
  }
  if (!message || !message.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Message content is required.' });
  }

  const created = await repository.contactMessages.create({
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    status: 'New',
    internalNotes: '',
  });

  return successResponse(reply, {
    statusCode: 201,
    message: 'Thank you for reaching out! We have received your message and will respond shortly.',
    data: {
      id: created._id,
      name: created.name,
      createdAt: created.createdAt,
    },
  });
}

// Admin: Get all contact messages
export async function getAdminContactMessages(request, reply) {
  const { page = 1, limit = 20, status = '' } = request.query || {};

  const filter = {};
  if (status) filter.status = status;

  const result = await repository.contactMessages.find({
    filter,
    page: Math.max(1, parseInt(page, 10)),
    limit: Math.max(1, parseInt(limit, 10)),
    sort: { createdAt: -1 },
  });

  return successResponse(reply, {
    message: 'Contact messages retrieved.',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
    },
  });
}

// Admin: Update status & notes
export async function updateContactMessage(request, reply) {
  const { id } = request.params;
  const { status, internalNotes } = request.body || {};

  const existing = await repository.contactMessages.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Message not found.' });
  }

  const update = {};
  if (status) {
    const validStatuses = ['New', 'Read', 'Replied', 'Archived'];
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

  const updated = await repository.contactMessages.findByIdAndUpdate(id, update);

  return successResponse(reply, {
    message: 'Message updated.',
    data: updated,
  });
}

// Admin: Delete contact message
export async function deleteContactMessage(request, reply) {
  const { id } = request.params;
  const existing = await repository.contactMessages.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'Message not found.' });
  }

  await repository.contactMessages.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'Contact message deleted.',
  });
}
