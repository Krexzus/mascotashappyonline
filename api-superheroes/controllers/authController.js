import express from 'express';
import { body, validationResult } from 'express-validator';
import authService from '../services/authService.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Validaciones para registro
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para login
const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Usuario o email requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida')
];

// POST /api/auth/register - Registrar nuevo usuario
router.post('/auth/register', registerValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { username, email, password } = req.body;
    
    const result = await authService.register({ username, email, password });
    
    res.status(201).json({
      message: '¡Bienvenido! Tu cuenta ha sido creada exitosamente',
      user: result.user,
      token: result.token,
      instructions: 'Guarda tu token para acceder a tu mascota privada'
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.message === 'El usuario o email ya existe') {
      return res.status(409).json({
        error: 'Usuario ya existe',
        message: 'Este nombre de usuario o email ya está registrado'
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la cuenta, intenta nuevamente'
    });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post('/auth/login', loginValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { username, password } = req.body;
    
    const result = await authService.login({ username, password });
    
    res.json({
      message: `¡Bienvenido de vuelta, ${result.user.username}!`,
      user: result.user,
      token: result.token,
      instructions: 'Usa este token para acceder a tu mascota'
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({
        error: 'Credenciales incorrectas',
        message: 'Usuario o contraseña incorrectos'
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo iniciar sesión, intenta nuevamente'
    });
  }
});

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Perfil de usuario',
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el perfil'
    });
  }
});

// POST /api/auth/logout - Cerrar sesión (opcional, principalmente del lado cliente)
router.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: `¡Hasta luego, ${req.user.username}!`,
      instructions: 'Tu sesión ha sido cerrada. Elimina el token del cliente.'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

export default router;