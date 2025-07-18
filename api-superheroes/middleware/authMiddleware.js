import authService from '../services/authService.js';

// Middleware para verificar autenticación
const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔍 DEBUG MIDDLEWARE - Iniciando autenticación...');
    const authHeader = req.headers['authorization'];
    console.log('🔍 DEBUG MIDDLEWARE - Authorization header:', authHeader ? 'PRESENTE' : 'AUSENTE');
    
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('🔍 DEBUG MIDDLEWARE - Token extraído:', token ? 'SÍ' : 'NO');

    if (!token) {
      console.log('❌ DEBUG MIDDLEWARE - No hay token');
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        message: 'Debes iniciar sesión para acceder a tu mascota'
      });
    }

    // Verificar token
    console.log('🔍 DEBUG MIDDLEWARE - Verificando token...');
    const decoded = authService.verifyToken(token);
    console.log('🔍 DEBUG MIDDLEWARE - Token decodificado:', decoded);
    
    // Obtener información del usuario
    console.log('🔍 DEBUG MIDDLEWARE - Buscando usuario con ID:', decoded.userId);
    const user = await authService.getUserById(decoded.userId);
    console.log('🔍 DEBUG MIDDLEWARE - Usuario encontrado:', user ? 'SÍ' : 'NO');
    
    // Agregar información del usuario al request
    req.user = user;
    console.log('✅ DEBUG MIDDLEWARE - Autenticación exitosa para:', user.username);
    
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    console.error('❌ Stack trace:', error.stack);
    
    if (error.message === 'Token inválido') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
        debug: {
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    return res.status(401).json({ 
      error: 'Error de autenticación',
      message: 'No se pudo verificar tu identidad',
      debug: {
        errorMessage: error.message,
        timestamp: new Date().toISOString()
      }
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