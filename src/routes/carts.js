import express from 'express';
import passport from 'passport';
import { addProductToCart, removeProductFromCart, purchaseCart } from '../controllers/cartController.js';
import { authorizeRole } from '../middleware/authorization.js';

const router = express.Router();

router.post('/add-product', passport.authenticate('jwt', { session: false }), authorizeRole('user'), addProductToCart);
router.delete('/remove-product', passport.authenticate('jwt', { session: false }), authorizeRole('user'), removeProductFromCart);
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), authorizeRole('user'), purchaseCart);

export default router;
