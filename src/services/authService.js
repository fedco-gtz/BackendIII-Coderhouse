import UserRepository from '../repositories/userRepository.js';
import CartRepository from '../repositories/cartRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  async login(email, password) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, role: user.role };
  }

  async register(userData) {
    const existingUser = await UserRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Usuario ya registrado');
    }

    const newCart = await CartRepository.createCart();
    const newUser = await UserRepository.createUser({
      ...userData,
      cart: newCart._id
    });

    return newUser;
  }

  async getCurrentUser(userId) {
    return await UserRepository.getUserById(userId);
  }
}

export default new AuthService();
