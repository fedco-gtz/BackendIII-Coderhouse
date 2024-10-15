import Cart from '../models/Cart.js';

class CartDAO {
  async create() {
    const newCart = new Cart();
    return await newCart.save();
  }

  async getById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products.push({ product: productId, quantity: 1 });
    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
    return await cart.save();
  }

  async update(cartId, cartData) {
    return await Cart.findByIdAndUpdate(cartId, cartData, { new: true });
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    cart.products = [];
    return await cart.save();
  }
}

export default new CartDAO();
