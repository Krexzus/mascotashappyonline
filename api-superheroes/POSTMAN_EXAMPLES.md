# 🎮 API de Mascotas Privadas tipo Pou - Ejemplos para Postman

## Base URL
```
http://localhost:3001
```

## 📋 Flujo Completo de Uso

### 1. 🏠 Verificar que la API funciona
**GET** `http://localhost:3001/`

**Respuesta esperada:**
```json
{
  "message": "🎮 API de Mascotas Privadas tipo Pou",
  "version": "3.0",
  "description": "Cada usuario tiene su propia mascota privada que solo él puede ver y cuidar",
  "features": [...],
  "endpoints": {...},
  "instructions": "1. Regístrate, 2. Inicia sesión, 3. Crea tu mascota, 4. ¡Cuídala como en Pou!"
}
```

---

### 2. 👤 Registrar Usuario
**POST** `http://localhost:3001/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "jugador1",
  "email": "jugador1@example.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "message": "¡Bienvenido! Tu cuenta ha sido creada exitosamente",
  "user": {
    "id": 1,
    "username": "jugador1",
    "email": "jugador1@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "instructions": "Guarda tu token para acceder a tu mascota privada"
}
```

---

### 3. 🔐 Iniciar Sesión
**POST** `http://localhost:3001/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "jugador1",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "message": "¡Bienvenido de vuelta, jugador1!",
  "user": {
    "id": 1,
    "username": "jugador1",
    "email": "jugador1@example.com",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "instructions": "Usa este token para acceder a tu mascota"
}
```

**⚠️ IMPORTANTE: Copia el token de la respuesta para usarlo en las siguientes requests**

---

### 4. 👤 Ver Perfil de Usuario
**GET** `http://localhost:3001/api/auth/profile`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 5. 🐾 Ver Mi Mascota (primera vez)
**GET** `http://localhost:3001/api/pets/my-pet`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta esperada (primera vez):**
```json
{
  "success": false,
  "message": "No tienes una mascota. Puedes crear una nueva.",
  "instructions": "Usa POST /api/pets/my-pet para crear tu mascota"
}
```

---

### 6. 🎨 Crear Mi Mascota
**POST** `http://localhost:3001/api/pets/my-pet`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Buddy",
  "tipo": "perro",
  "superpoder": "lealtad"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "¡Bienvenido Buddy! Tu mascota ha sido creada. ¡Cuídala como en Pou!",
  "data": {
    "id": 1,
    "userId": 1,
    "nombre": "Buddy",
    "tipo": "perro",
    "superpoder": "lealtad",
    "felicidad": 100,
    "vida": 100,
    "hambre": 0,
    "sed": 0,
    "energia": 100,
    "peso": 50,
    "personalidad": "normal",
    "enfermedades": [],
    "items": [],
    "ultimaActualizacion": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 7. 🐾 Ver Mi Mascota (después de crearla)
**GET** `http://localhost:3001/api/pets/my-pet`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "¡Aquí está tu mascota!",
  "data": {
    "id": 1,
    "userId": 1,
    "nombre": "Buddy",
    "tipo": "perro",
    "superpoder": "lealtad",
    "felicidad": 100,
    "vida": 100,
    "hambre": 0,
    "sed": 0,
    "energia": 100,
    "peso": 50,
    "personalidad": "normal",
    "enfermedades": [],
    "items": []
  }
}
```

---

## 🎮 Acciones de Cuidado (Próximamente)

### 🍖 Alimentar Mascota
**POST** `http://localhost:3001/api/pets/my-pet/feed`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

### 💧 Dar Agua
**POST** `http://localhost:3001/api/pets/my-pet/water`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

### 💪 Ejercitar
**POST** `http://localhost:3001/api/pets/my-pet/exercise`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

### 📊 Ver Estado Detallado
**GET** `http://localhost:3001/api/pets/my-pet/status`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

---

## 🧪 Pruebas con Múltiples Usuarios

### Usuario 2
```json
{
  "username": "jugador2",
  "email": "jugador2@example.com",
  "password": "password456"
}
```

### Usuario 3
```json
{
  "username": "jugador3",
  "email": "jugador3@example.com",
  "password": "password789"
}
```

**Cada usuario tendrá su propia mascota completamente privada e independiente.**

---

## 🚨 Errores Comunes

### Error 401 - No autorizado
```json
{
  "error": "Token de acceso requerido",
  "message": "Debes iniciar sesión para acceder a tu mascota"
}
```
**Solución:** Agregar el header `Authorization: Bearer TU_TOKEN`

### Error 409 - Ya tienes mascota
```json
{
  "success": false,
  "message": "Ya tienes una mascota. Solo puedes tener una mascota por usuario."
}
```
**Solución:** Cada usuario solo puede tener una mascota. Usa GET para verla.

---

## 🎯 Características del Sistema Pou

- ✅ **Privacidad Total**: Cada usuario solo ve su propia mascota
- ✅ **Estadísticas Realistas**: Hambre, sed, energía, felicidad, vida
- ✅ **Sistema de Cuidados**: Alimentar, hidratar, ejercitar
- ✅ **Personalidades Dinámicas**: Cambian según el cuidado
- ✅ **Enfermedades**: Sistema de salud realista
- ✅ **Degradación Temporal**: Las mascotas necesitan cuidado constante

¡Disfruta cuidando tu mascota virtual tipo Pou! 🎮
--
-

## 🎨 Sistema de Customización e Items

### 🛍️ Agregar Item a la Mascota
**POST** `http://localhost:3001/api/pets/my-pet/customize`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "item": {
    "nombre": "Sombrero Rojo",
    "tipo": "sombrero",
    "color": "#FF0000",
    "descripcion": "Un elegante sombrero rojo que hace ver muy elegante a tu mascota"
  }
}
```

**Otros ejemplos de items:**
```json
{
  "item": {
    "nombre": "Gafas de Sol",
    "tipo": "gafas",
    "color": "#000000",
    "descripcion": "Gafas oscuras para lucir genial"
  }
}
```

```json
{
  "item": {
    "nombre": "Collar Dorado",
    "tipo": "collar",
    "color": "#FFD700",
    "descripcion": "Un collar brillante y lujoso"
  }
}
```

```json
{
  "item": {
    "nombre": "Camiseta Azul",
    "tipo": "ropa",
    "color": "#0066CC",
    "descripcion": "Una camiseta cómoda de color azul"
  }
}
```

### 👀 Ver Todos los Items
**GET** `http://localhost:3001/api/pets/my-pet/items`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

### 👕 Equipar/Desequipar Item
**PUT** `http://localhost:3001/api/pets/my-pet/items/1/equip`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON) - Para equipar:**
```json
{
  "equipado": true
}
```

**Body (JSON) - Para desequipar:**
```json
{
  "equipado": false
}
```

### 🗑️ Eliminar Item
**DELETE** `http://localhost:3001/api/pets/my-pet/items/1`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

### 🎭 Ver Apariencia Actual
**GET** `http://localhost:3001/api/pets/my-pet/appearance`

**Headers:**
```
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Apariencia actual de tu mascota",
  "data": {
    "nombre": "Buddy",
    "tipo": "perro",
    "personalidad": "alegre",
    "itemsEquipados": [
      {
        "id": 1,
        "nombre": "Sombrero Rojo",
        "tipo": "sombrero",
        "color": "#FF0000",
        "equipado": true
      }
    ],
    "descripcion": "Buddy es un perro con personalidad alegre. Lleva puesto: Sombrero Rojo (sombrero). Se ve muy feliz! 😄"
  }
}
```

---

## 🎮 Flujo Completo de Customización

### 1. Crear varios items para tu mascota:
```bash
# Sombrero
POST /api/pets/my-pet/customize
{ "item": { "nombre": "Sombrero Rojo", "tipo": "sombrero", "color": "#FF0000" } }

# Gafas
POST /api/pets/my-pet/customize  
{ "item": { "nombre": "Gafas Cool", "tipo": "gafas", "color": "#000000" } }

# Collar
POST /api/pets/my-pet/customize
{ "item": { "nombre": "Collar Dorado", "tipo": "collar", "color": "#FFD700" } }
```

### 2. Ver todos tus items:
```bash
GET /api/pets/my-pet/items
```

### 3. Equipar items (solo uno por tipo):
```bash
# Equipar sombrero
PUT /api/pets/my-pet/items/1/equip
{ "equipado": true }

# Equipar gafas  
PUT /api/pets/my-pet/items/2/equip
{ "equipado": true }
```

### 4. Ver cómo se ve tu mascota:
```bash
GET /api/pets/my-pet/appearance
```

### 5. Cambiar de look:
```bash
# Desequipar sombrero
PUT /api/pets/my-pet/items/1/equip
{ "equipado": false }

# Equipar collar
PUT /api/pets/my-pet/items/3/equip  
{ "equipado": true }
```

---

## 🎨 Tipos de Items Disponibles

- **sombrero**: Sombreros, gorras, boinas
- **gafas**: Gafas de sol, anteojos, lentes
- **collar**: Collares, cadenas, medallones  
- **ropa**: Camisetas, vestidos, chaquetas
- **zapatos**: Zapatos, botas, sandalias
- **accesorio**: Pulseras, relojes, moños
- **juguete**: Pelotas, huesos, ratones de juguete

¡Personaliza tu mascota como en el juego Pou! 🎮