import bcrypt from 'bcryptjs';
import { repository } from '../../config/store.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function login(request, reply) {
  const { email, password } = request.body || {};

  if (!email || !password) {
    return errorResponse(reply, {
      statusCode: 400,
      message: 'Email and password are required.',
    });
  }

  const user = await repository.users.findByEmail(email);
  if (!user) {
    return errorResponse(reply, {
      statusCode: 401,
      message: 'Invalid email or password.',
    });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return errorResponse(reply, {
      statusCode: 401,
      message: 'Invalid email or password.',
    });
  }

  if (user.isActive === false) {
    return errorResponse(reply, {
      statusCode: 403,
      message: 'Your administrator account has been deactivated.',
    });
  }

  const token = await reply.jwtSign({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Set secure cookie
  reply.setCookie('admin_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return successResponse(reply, {
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
}

export async function logout(request, reply) {
  reply.clearCookie('admin_token', {
    path: '/',
    httpOnly: true,
  });

  return successResponse(reply, {
    message: 'Logged out successfully.',
  });
}

export async function getMe(request, reply) {
  const userId = request.user.id;
  const user = await repository.users.findById(userId);

  if (!user) {
    return errorResponse(reply, {
      statusCode: 404,
      message: 'User profile not found.',
    });
  }

  return successResponse(reply, {
    message: 'User profile retrieved.',
    data: {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
