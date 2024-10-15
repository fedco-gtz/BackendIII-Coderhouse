import express from 'express';
import passport from 'passport';
import { authorizeRole } from '../middleware/authorization.js';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductForEdit } from '../controllers/productController.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), getAllProducts);

router.get('/create', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), (req, res) => {
  res.render('createProduct', { user: req.user });
});

router.post('/create', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), createProduct);

router.get('/edit/:pid', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), getProductForEdit);

router.post('/edit/:pid', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), updateProduct);

router.post('/delete/:pid', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), deleteProduct);

export default router;
