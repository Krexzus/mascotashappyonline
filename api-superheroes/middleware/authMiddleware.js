import authService from '../services/authService.js';

// Middleware para verificar autenticación
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        message: 'Debes iniciar sesión para acceder a tu mascota'
      });
    }

    // Verificar token
    const decoded = authService.verifyToken(token);
    
    // Obtener información del usuario
    const user = await authService.getUserById(decoded.userId);
    
    // Agregar información del usuario al request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.message === 'Token inválido') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
      });
    }
    
    return res.status(401).json({ 
      error: 'Error de autenticación',
      message: 'No se pudo verificar tu identidad'
    });
  }
};

// Middleware opcional para verificar autenticación (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = authService.verifyToken(token);
      const user = await authService.getUserById(decoded.userId);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continúa sin usuario autenticado
    next();
  }
};

export default authenticateToken;