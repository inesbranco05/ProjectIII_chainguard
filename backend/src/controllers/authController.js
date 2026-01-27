const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/auth');

class AuthController {
  // Registar novo utilizador
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Verificar se o email já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Criar novo utilizador
      const user = new User({
        email,
        password,
        name,
      });

      await user.save();

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        authConfig.jwt.secret,
        { expiresIn: authConfig.jwt.expiresIn }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message,
      });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Encontrar utilizador
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Verificar password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Verificar se o utilizador está ativo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      // Atualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        authConfig.jwt.secret,
        { expiresIn: authConfig.jwt.expiresIn }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            preferences: user.preferences,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message,
      });
    }
  }

  // Obter perfil do utilizador
  static async getProfile(req, res) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching profile',
        error: error.message,
      });
    }
  }

  // Atualizar perfil
  static async updateProfile(req, res) {
    try {
      const updates = req.body;
      delete updates.password; // Não permitir atualizar password aqui
      delete updates.role; // Não permitir atualizar role

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message,
      });
    }
  }

  // Logout (cliente remove token)
  static async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during logout',
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;