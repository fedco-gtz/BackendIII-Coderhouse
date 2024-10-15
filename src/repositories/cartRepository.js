import CartDAO from '../dao/cartDAO.js';

class CartRepository {
  async createCart() {
    return await CartDAO.create();
  }

  async getCartById(cartId) {
    return await CartDAO.getById(cartId);
  }

  async addProductToCart(cartId, productId) {
    return await CartDAO.addProductToCart(cartId, productId);
  }

  async removeProductFromCart(cartId, productId) {
    return await CartDAO.removeProductFromCart(cartId, productId);
  }

  async updateCart(cartId, cartData) {
    return await CartDAO.update(cartId, cartData);
  }

  async clearCart(cartId) {
    return await CartDAO.clearCart(cartId);
  }
}

export default new CartRepository();
