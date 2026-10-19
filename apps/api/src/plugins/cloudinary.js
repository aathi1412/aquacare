import fp from 'fastify-plugin';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

export default fp(async function cloudinaryPlugin(fastify) {
  const isCloudinaryConfigured = Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );

  if (isCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    fastify.log.info('Cloudinary configured successfully.');
  } else {
    fastify.log.warn('Cloudinary credentials not set in .env. Mock upload adapter will be active for development.');
  }

  const mediaService = {
    isConfigured: isCloudinaryConfigured,

    async uploadBuffer(buffer, { folder = 'aquacare/products', filename = null } = {}) {
      if (!isCloudinaryConfigured) {
        // Mock fallback for local testing without external account
        const mockId = (filename || 'img_' + Date.now()).replace(/[^a-zA-Z0-9_-]/g, '_');
        return {
          url: `https://res.cloudinary.com/mnedzlvg/image/upload/v1792398545/PDP_1_de97f82356.png`,
          publicId: `${folder}/${mockId}`,
          format: 'jpg',
          bytes: buffer.length,
          isMock: true,
        };
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: filename || undefined,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              bytes: result.bytes,
              isMock: false,
            });
          }
        );
        uploadStream.end(buffer);
      });
    },

    async deleteAsset(publicId) {
      if (!isCloudinaryConfigured || !publicId || publicId.startsWith('aquacare/')) {
        return { result: 'ok', mock: true };
      }
      try {
        const res = await cloudinary.uploader.destroy(publicId);
        return res;
      } catch (err) {
        fastify.log.error(`Cloudinary deletion error: ${err.message}`);
        return { result: 'error', error: err.message };
      }
    },
  };

  fastify.decorate('mediaService', mediaService);
});
