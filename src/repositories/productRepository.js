import ProductDAO from '../dao/productDAO.js';

class ProductRepository {
  async createProduct(productData) {
    return await ProductDAO.create(productData);
  }

  async getProducts(filterOptions) {
    const { limit = 10, page = 1, sort, query } = filterOptions;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
    };
    const queryObj = query ? { $or: [{ category: query }, { status: query }] } : {};
    return await ProductDAO.findAll(queryObj, options);
  }

  async getProductById(productId) {
    return await ProductDAO.findById(productId);
  }

  async updateProduct(productId, updateData) {
    return await ProductDAO.update(productId, updateData);
  }

  async deleteProduct(productId) {
    return await ProductDAO.delete(productId);
  }
}

export default new ProductRepository();
