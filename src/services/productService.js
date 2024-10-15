import ProductRepository from '../repositories/productRepository.js';
import ProductDTO from '../dto/productDTO.js';

class ProductService {
  async createProduct(productData) {
    const product = await ProductRepository.createProduct(productData);
    return new ProductDTO(product);
  }

  async getProducts(filterOptions) {
    const products = await ProductRepository.getProducts(filterOptions);

    return {
      docs: products.docs.map(product => new ProductDTO(product)),
      totalPages: products.totalPages,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
    };
  }

  async getProductById(productId) {
    const product = await ProductRepository.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return new ProductDTO(product);
  }

  async updateProduct(productId, updateData) {
    const updatedProduct = await ProductRepository.updateProduct(productId, updateData);
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return new ProductDTO(updatedProduct);
  }

  async deleteProduct(productId) {
    const deletedProduct = await ProductRepository.deleteProduct(productId);
    if (!deletedProduct) {
      throw new Error('Product not found');
    }
    return new ProductDTO(deletedProduct);
  }
}

export default new ProductService();
