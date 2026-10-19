import { repository } from '../../config/store.js';
import { successResponse } from '../../utils/response.js';

export async function getDashboardStats(request, reply) {
  const stats = await repository.dashboard.getStats();

  return successResponse(reply, {
    message: 'Dashboard metrics retrieved.',
    data: stats,
  });
}
