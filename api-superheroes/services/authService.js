import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pou-pets-jwt-secret-key-2024-render-production';
const JWT_EXPIRES_IN = '24h';

class AuthService {
  // Registrar nuevo usuario
  async register(userData) {
    const { username, email, password } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('El usuario o email ya existe');
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const userId = await User.getNextId();
    const newUser = new User({
      id: userId,
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generar token
    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt
      },
      token
    };
  }

  // Login de usuario
  async login(credentials) {
    const { username, password } = credentials;

    // Buscar usuario por username o email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin
      },
      token
    };
  }

  // Generar JWT token
  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Verificar token
  verifyToken(token) {
    try {
      console.log('🔍 DEBUG TOKEN - Verificando token...');
      console.log('🔍 DEBUG TOKEN - JWT_SECRET existe:', !!JWT_SECRET);
      console.log('🔍 DEBUG TOKEN - Token recibido:', token ? 'SÍ' : 'NO');
      console.log('🔍 DEBUG TOKEN - Longitud del token:', token ? token.length : 0);
      
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('🔍 DEBUG TOKEN - Token decodificado exitosamente:', decoded);
      return decoded;
    } catch (error) {
      console.error('❌ DEBUG TOKEN - Error al verificar token:', error.message);
      console.error('❌ DEBUG TOKEN - Tipo de error:', error.name);
      throw new Error('Token inválido');
    }
  }

  // Obtener usuario por ID
  async getUserById(userId) {
    const user = await User.findOne({ id: userId }).select('-password');
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }
}

export default new AuthService();