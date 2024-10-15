import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import authRouter from './routes/auth.js';
import connectDB from './config/db.js';
import passport from './config/passport.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import { authorizeRole } from './middleware/authorization.js';
import dotenv from 'dotenv';
import ProductRepository from './repositories/productRepository.js';
import CartRepository from './repositories/cartRepository.js';
dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

Handlebars.registerHelper('buildUrl', (limit, page, sort, query, cartId) => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (page) params.append('page', page);
  if (sort && sort !== 'undefined') params.append('sort', sort);
  if (query && query !== 'undefined') params.append('query', query);
  if (cartId && cartId !== 'undefined') params.append('cartId', cartId);
  return `/products?${params.toString()}`;
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());

app.use((req, res, next) => {
  req.app.set('io', io);
  next();
});

app.use('/admin', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', authRouter);

app.get('/admin', passport.authenticate('jwt', { session: false }), authorizeRole('admin'), (req, res) => {
  res.redirect('/api/products/admin');
});

app.get('/', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/products');
    } catch (error) {
      return res.redirect('/login');
    }
  }
  return res.redirect('/login');
});

app.get('/login', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/products');
    } catch (error) {
      res.clearCookie('token');
    }
  }
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/products');
    } catch (error) {
      res.clearCookie('token');
    }
  }
  res.render('register', { title: 'Register' });
});

app.get('/products', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async (req, res) => {
  const { limit = 10, page = 1, sort, query, cartId } = req.query;

  const products = await ProductRepository.getProducts({ limit, page, sort, query });
  const prevLink = products.hasPrevPage 
    ? Handlebars.helpers.buildUrl(limit, products.prevPage, sort, query, cartId) 
    : null;
  const nextLink = products.hasNextPage 
    ? Handlebars.helpers.buildUrl(limit, products.nextPage, sort, query, cartId) 
    : null;

  res.render('products', {
    title: 'Products',
    products: products.docs,
    totalPages: products.totalPages,
    prevPage: products.hasPrevPage,
    nextPage: products.hasNextPage,
    page: products.page,
    prevLink,
    nextLink,
    cartId,
    user: req.user
  });
});

app.get('/logout', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

app.get('/carts', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async (req, res) => {
  try {
    const cart = await CartRepository.getCartById(req.user.cart);
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.render('cart', {
      title: 'Your Cart',
      products: cart.products,
      cartId: req.user.cart,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
