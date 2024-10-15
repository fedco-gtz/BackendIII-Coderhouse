import User from '../models/User.js';

class UserDAO {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(userId) {
    return await User.findById(userId).populate('cart');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async update(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }
}

export default new UserDAO();
