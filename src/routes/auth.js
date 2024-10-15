import express from 'express';
import passport from 'passport';
import { login, register, getCurrentUser, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);
router.get('/logout', passport.authenticate('jwt', { session: false }), logout);

export default router;
