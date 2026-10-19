export function successResponse(reply, { statusCode = 200, message = 'Success', data = null, meta = null }) {
  const payload = {
    success: true,
    message,
    data,
  };
  if (meta !== null) {
    payload.meta = meta;
  }
  return reply.code(statusCode).send(payload);
}

export function errorResponse(reply, { statusCode = 500, message = 'An error occurred', errors = [] }) {
  return reply.code(statusCode).send({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
}
