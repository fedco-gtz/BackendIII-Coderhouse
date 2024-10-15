import AuthService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const newUser = await AuthService.register({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, role } = await AuthService.login(email, password);

    res.cookie('token', token, { httpOnly: true });

    if (role === 'admin') {
      return res.redirect('/admin');
    } else if (role === 'user') {
      return res.redirect('/products');
    } else {
      return res.status(400).json({ message: 'Role not recognized' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await AuthService.getCurrentUser(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};
