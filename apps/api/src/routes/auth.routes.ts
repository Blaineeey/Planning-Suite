import { Router } from 'express';
import { authService } from '../modules/auth/auth.service';
import { asyncHandler } from '../utils/async-handler';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    status: 'success',
    data: result
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({
    status: 'success',
    data: result
  });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  res.json({
    status: 'success',
    data: result
  });
}));

router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
}));

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  res.json({
    status: 'success',
    data: profile
  });
}));

export default router;
