import express from 'express';
import {
  register,
  forgotPassword,
  login,
  logout,
  verify
} from '../controllers/userController.js';

import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify', verify);
// router.post('/reverify', reVerify);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
router.post('/forgot-password', forgotPassword);

export default router;