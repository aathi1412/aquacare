import { repository } from '../../config/store.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Get published FAQs
export async function getFAQs(request, reply) {
  const { category } = request.query || {};
  const filter = { isPublished: true };
  if (category) filter.category = category;

  const faqs = await repository.faqs.find(filter);

  return successResponse(reply, {
    message: 'FAQs retrieved successfully.',
    data: faqs,
  });
}

// Admin: Get all FAQs
export async function getAdminFAQs(request, reply) {
  const faqs = await repository.faqs.find({});
  return successResponse(reply, {
    message: 'All FAQs retrieved.',
    data: faqs,
  });
}

// Admin: Create FAQ
export async function createFAQ(request, reply) {
  const { question, answer, category, displayOrder, isPublished } = request.body || {};

  if (!question || !question.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Question is required.' });
  }
  if (!answer || !answer.trim()) {
    return errorResponse(reply, { statusCode: 400, message: 'Answer is required.' });
  }

  const created = await repository.faqs.create({
    question: question.trim(),
    answer: answer.trim(),
    category: category || 'general',
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
  });

  return successResponse(reply, {
    statusCode: 201,
    message: 'FAQ created successfully.',
    data: created,
  });
}

// Admin: Update FAQ
export async function updateFAQ(request, reply) {
  const { id } = request.params;
  const body = request.body || {};

  const existing = await repository.faqs.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'FAQ not found.' });
  }

  const updated = await repository.faqs.findByIdAndUpdate(id, body);

  return successResponse(reply, {
    message: 'FAQ updated successfully.',
    data: updated,
  });
}

// Admin: Delete FAQ
export async function deleteFAQ(request, reply) {
  const { id } = request.params;
  const existing = await repository.faqs.findById(id);
  if (!existing) {
    return errorResponse(reply, { statusCode: 404, message: 'FAQ not found.' });
  }

  await repository.faqs.findByIdAndDelete(id);

  return successResponse(reply, {
    message: 'FAQ deleted successfully.',
  });
}
