# 🎮 API de Mascotas Privadas tipo Pou

Una API REST que permite a cada usuario tener su propia mascota virtual privada, similar al juego Pou. Cada jugador puede registrarse, crear su mascota y cuidarla de forma completamente independiente.

## 🚀 Características

- **🔐 Sistema de Autenticación**: Registro y login con JWT
- **🐾 Mascotas Privadas**: Cada usuario tiene su propia mascota
- **🎮 Mecánicas tipo Pou**: Alimentar, dar agua, ejercitar
- **📊 Estadísticas Realistas**: Hambre, sed, energía, felicidad, vida
- **🏥 Sistema de Salud**: Enfermedades y personalidades dinámicas
- **⏰ Degradación Temporal**: Las mascotas necesitan cuidado constante
- **🔒 Privacidad Total**: Los usuarios solo ven sus propias mascotas

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB Atlas
- **Autenticación**: JWT + bcryptjs
- **Validación**: express-validator
- **Deploy**: Render

## 📋 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Ver perfil

### Mascotas Privadas
- `GET /api/pets/my-pet` - Ver mi mascota
- `POST /api/pets/my-pet` - Crear mascota
- `POST /api/pets/my-pet/feed` - Alimentar
- `POST /api/pets/my-pet/water` - Dar agua
- `POST /api/pets/my-pet/exercise` - Ejercitar
- `GET /api/pets/my-pet/status` - Estado detallado

## 🚀 Deploy en Render

### Variables de Entorno
```
MONGODB_URI=tu_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
NODE_ENV=production
```

### Configuración de Build
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18+

## 🎯 Cómo Jugar

1. **Regístrate** con username, email y password
2. **Inicia sesión** para obtener tu token
3. **Crea tu mascota** con nombre, tipo y superpoder
4. **Cuídala** alimentándola, dándole agua y ejercitándola
5. **Monitorea** su estado para mantenerla feliz y saludable

## 🧪 Pruebas con Postman

Consulta el archivo `POSTMAN_EXAMPLES.md` para ejemplos completos de todas las requests.

## 🎮 Mecánicas del Juego

### Estadísticas
- **Hambre** (0-100): Aumenta con el tiempo, se reduce alimentando
- **Sed** (0-100): Aumenta con el tiempo, se reduce dando agua
- **Energía** (0-100): Se reduce con actividad, se recupera descansando
- **Felicidad** (0-100): Afectada por todas las acciones
- **Vida** (0-100): Salud general de la mascota
- **Peso** (0-100): Afectado por comida y ejercicio

### Personalidades
- **Normal**: Estado base
- **Alegre**: Cuando está muy feliz
- **Triste**: Cuando está descuidada
- **Energético**: Cuando tiene mucha energía
- **Nervioso**: Cuando está estresada

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con tokens seguros
- Validación de datos de entrada
- Aislamiento completo entre usuarios
- Rate limiting en endpoints críticos

## 📱 Uso Multiplayer

Cada usuario puede:
- Crear su cuenta independiente
- Tener su propia mascota única
- Jugar sin interferir con otros usuarios
- Competir informalmente comparando estadísticas

¡Perfecto para que cada persona tenga su propio Pou virtual! 🎮