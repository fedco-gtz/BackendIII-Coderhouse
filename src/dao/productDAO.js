import Product from '../models/Product.js';

class ProductDAO {
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async findAll(filter = {}, options = {}) {
    return await Product.paginate(filter, options);
  }

  async findById(productId) {
    return await Product.findById(productId);
  }

  async update(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true });
  }

  async delete(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

export default new ProductDAO();
