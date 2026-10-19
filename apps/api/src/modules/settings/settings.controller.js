import { repository } from '../../config/store.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Public: Get public site settings
export async function getPublicSettings(request, reply) {
  const settings = await repository.settings.getSettings();

  const publicData = {
    businessName: settings.businessName || 'AquaCare',
    tagline: settings.tagline || '',
    logoUrl: settings.logoUrl || '',
    primaryColor: settings.primaryColor || '#0284c7',
    phone: settings.phone || '',
    email: settings.email || '',
    whatsapp: settings.whatsapp || '',
    address: settings.address || '',
    serviceArea: settings.serviceArea || '',
    businessHours: settings.businessHours || '',
    hero: settings.hero || {},
    socialLinks: settings.socialLinks || {},
    footer: settings.footer || {},
    mapEmbedUrl: settings.mapEmbedUrl || '',
  };

  return successResponse(reply, {
    message: 'Site settings retrieved.',
    data: publicData,
  });
}

// Admin: Get settings
export async function getAdminSettings(request, reply) {
  const settings = await repository.settings.getSettings();
  return successResponse(reply, {
    message: 'Settings retrieved.',
    data: settings,
  });
}

// Admin: Update settings
export async function updateAdminSettings(request, reply) {
  const body = request.body || {};
  const updated = await repository.settings.updateSettings(body);

  return successResponse(reply, {
    message: 'Settings updated successfully.',
    data: updated,
  });
}
