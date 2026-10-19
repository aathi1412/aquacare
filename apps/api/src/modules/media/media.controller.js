import { successResponse, errorResponse } from '../../utils/response.js';

// Admin: Upload single or multiple images
export async function uploadImage(request, reply) {
  try {
    const data = await request.file();
    if (!data) {
      return errorResponse(reply, { statusCode: 400, message: 'No file uploaded.' });
    }

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedMime.includes(data.mimetype)) {
      return errorResponse(reply, {
        statusCode: 400,
        message: 'Invalid file format. Only JPEG, PNG, WEBP, and SVG are supported.',
      });
    }

    const buffer = await data.toBuffer();
    if (buffer.length > 10 * 1024 * 1024) {
      return errorResponse(reply, {
        statusCode: 400,
        message: 'File size exceeds maximum allowed limit (10MB).',
      });
    }

    const folder = data.fields?.folder?.value || 'aquaCare/products';
    const result = await request.server.mediaService.uploadBuffer(buffer, {
      folder,
      filename: data.filename,
    });

    return successResponse(reply, {
      statusCode: 201,
      message: 'Image uploaded successfully.',
      data: result,
    });
  } catch (err) {
    request.log.error(err);
    return errorResponse(reply, {
      statusCode: 500,
      message: 'Failed to process file upload.',
      errors: [err.message],
    });
  }
}

// Admin: Upload multiple 360 frames
export async function upload360Frames(request, reply) {
  try {
    const parts = request.files();
    const uploadedFrames = [];
    let orderCounter = 1;

    for await (const part of parts) {
      const buffer = await part.toBuffer();
      const filename = part.filename;
      const result = await request.server.mediaService.uploadBuffer(buffer, {
        folder: 'aquaCare/360-frames',
        filename,
      });

      uploadedFrames.push({
        url: result.url,
        publicId: result.publicId,
        order: orderCounter++,
      });
    }

    if (uploadedFrames.length === 0) {
      return errorResponse(reply, {
        statusCode: 400,
        message: 'No frame images received.',
      });
    }

    return successResponse(reply, {
      statusCode: 201,
      message: `Successfully uploaded ${uploadedFrames.length} 360-degree frame(s).`,
      data: uploadedFrames,
    });
  } catch (err) {
    request.log.error(err);
    return errorResponse(reply, {
      statusCode: 500,
      message: 'Failed to upload 360-degree frames.',
      errors: [err.message],
    });
  }
}

// Admin: Delete media asset
export async function deleteMedia(request, reply) {
  const { publicId } = request.body || {};

  if (!publicId) {
    return errorResponse(reply, { statusCode: 400, message: 'publicId is required.' });
  }

  // Security check: restrict deletion to aquaCare folder
  if (!publicId.startsWith('aquaCare/')) {
    return errorResponse(reply, {
      statusCode: 403,
      message: 'Unauthorized deletion path.',
    });
  }

  const result = await request.server.mediaService.deleteAsset(publicId);

  return successResponse(reply, {
    message: 'Media asset deleted successfully.',
    data: result,
  });
}
