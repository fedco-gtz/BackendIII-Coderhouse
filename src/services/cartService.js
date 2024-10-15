import CartRepository from '../repositories/cartRepository.js';
import ProductRepository from '../repositories/productRepository.js';
import TicketService from './ticketService.js';
import TicketDTO from '../dto/ticketDTO.js';
import CartDTO from '../dto/cartDTO.js';

class CartService {
  
  async getCartById(cartId) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return new CartDTO(cart);
  }

  async addProductToCart(cartId, productId) {
    const cart = await CartRepository.getCartById(cartId);
    const product = await ProductRepository.getProductById(productId);

    if (!cart || !product) {
      throw new Error('Cart or Product not found');
    }

    const productIndex = cart.products.findIndex(p => p.product._id.equals(productId));

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    const updatedCart = await CartRepository.updateCart(cartId, cart);
    return new CartDTO(updatedCart);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartRepository.getCartById(cartId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.product._id.equals(productId));
    
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      const updatedCart = await CartRepository.updateCart(cartId, cart);
      return new CartDTO(updatedCart);
    } else {
      throw new Error('Product not found in cart');
    }
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    let totalAmount = 0;
    const productsOutOfStock = [];
    const productsPurchased = [];

    for (const item of cart.products) {
      const product = await ProductRepository.getProductById(item.product._id);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        productsPurchased.push({ product, quantity: item.quantity });
        await ProductRepository.updateProduct(product._id, { stock: product.stock });
      } else if (product.stock > 0) {
        totalAmount += product.price * product.stock;
        productsPurchased.push({ product, quantity: product.stock });
        productsOutOfStock.push({ product, quantityUnavailable: item.quantity - product.stock });
        await ProductRepository.updateProduct(product._id, { stock: 0 });
      } else {
        productsOutOfStock.push({ product, quantityUnavailable: item.quantity });
      }
    }

    if (totalAmount > 0) {
      const ticket = await TicketService.createTicket(totalAmount, userEmail);

      cart.products = [];
      await CartRepository.updateCart(cartId, cart);

      return new TicketDTO(ticket, productsPurchased, productsOutOfStock);
    }

    throw new Error('No products available for purchase');
  }

  async clearCart(cartId) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.products = [];
    const updatedCart = await CartRepository.updateCart(cartId, cart);
    return new CartDTO(updatedCart);
  }
}

export default new CartService();
